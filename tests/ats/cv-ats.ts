// Runs the built CV PDFs through OpenResume's parser (AGPL-3.0, not vendored:
// fetched at a pinned commit into .cache/) and checks what an ATS would read.
// Usage: pnpm build && pnpm test:cv

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { site } from '../../src/config';

const UPSTREAM = 'xitanggg/open-resume';
const COMMIT = '4f8255a2c763479837f69f1dccf2a3338730cd79';
const CACHE = resolve('.cache/open-resume');

async function ensureParser() {
  if (existsSync(`${CACHE}/lib/parse-resume-from-pdf/index.ts`)) return;
  console.log(`fetching ${UPSTREAM}@${COMMIT.slice(0, 7)} into .cache/`);
  const res = await fetch(`https://codeload.github.com/${UPSTREAM}/tar.gz/${COMMIT}`);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  mkdirSync(CACHE, { recursive: true });
  const tgz = `${CACHE}/src.tar.gz`;
  writeFileSync(tgz, Buffer.from(await res.arrayBuffer()));
  execFileSync('tar', ['-xzf', tgz, '-C', CACHE, '--strip-components=3', `open-resume-${COMMIT}/src/app/lib`]);
  // The parser's only runtime import outside itself is one constant from the app's Redux store.
  writeFileSync(
    `${CACHE}/lib/redux/resumeSlice.ts`,
    "export const initialFeaturedSkills = Array(6).fill({ skill: '', rating: 4 });\n",
  );
}

// Step 1 of the parser, rewritten for pdfjs in Node (upstream targets pdfjs 3 in a browser).
async function readPdf(path: string) {
  const doc = await getDocument({ data: new Uint8Array(readFileSync(path)) }).promise;
  const items = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    await page.getOperatorList();
    for (const it of content.items) {
      if (!('str' in it)) continue;
      const font = page.commonObjs.get(it.fontName) as { name?: string } | undefined;
      items.push({
        text: it.str,
        x: it.transform[4],
        y: it.transform[5],
        width: it.width,
        height: it.height,
        fontName: font?.name ?? it.fontName,
        hasEOL: it.hasEOL,
      });
    }
  }
  return items;
}

async function parse(path: string) {
  const { groupTextItemsIntoLines } = await import('lib/parse-resume-from-pdf/group-text-items-into-lines');
  const { groupLinesIntoSections } = await import('lib/parse-resume-from-pdf/group-lines-into-sections');
  const { extractResumeFromSections } = await import('lib/parse-resume-from-pdf/extract-resume-from-sections');
  return extractResumeFromSections(groupLinesIntoSections(groupTextItemsIntoLines(await readPdf(path))));
}

let failures = 0;
function check(label: string, ok: boolean, got: unknown) {
  console.log(`  ${ok ? 'ok ' : 'FAIL'} ${label}${ok ? '' : `: got ${JSON.stringify(got)}`}`);
  if (!ok) failures++;
}

const cvProjects = (lang: string) =>
  readdirSync(`src/content/projects/${lang}`).filter((f) =>
    /^cv: true$/m.test(readFileSync(`src/content/projects/${lang}/${f}`, 'utf8')),
  ).length;

// Whitespace around the hyphen varies with the parser's item merge, not with the PDF text.
const DATE_RANGE = /^\p{L}+\.? \d{4}\s?-\s?(\p{L}+\.? \d{4}|present|aujourd'hui)$/u;

await ensureParser();

for (const lang of ['en', 'fr'] as const) {
  const path = lang === 'en' ? 'dist/cv.pdf' : 'dist/fr/cv.pdf';
  const r = await parse(path);
  console.log(`\n${path}`);
  console.log(`  name: ${r.profile.name} | email: ${r.profile.email} | url: ${r.profile.url}`);
  for (const w of r.workExperiences) console.log(`  work: ${w.jobTitle} | ${w.company} | ${w.date} | ${w.descriptions.length} bullets`);
  for (const e of r.educations) console.log(`  edu: ${e.degree} | ${e.school} | ${e.date}`);
  console.log(`  projects: ${r.projects.map((p) => p.project).join(', ')}`);
  console.log(`  skills: ${r.skills.descriptions.length} lines`);

  check('name', r.profile.name === site.name, r.profile.name);
  check('email', r.profile.email === site.email, r.profile.email);
  // The parser only knows English section keywords, so structure is EN-only.
  if (lang !== 'en') continue;
  check('3 work experiences', r.workExperiences.length === 3, r.workExperiences.length);
  check('every work date is a full range', r.workExperiences.every((w) => DATE_RANGE.test(w.date)), r.workExperiences.map((w) => w.date));
  check('every work experience has bullets', r.workExperiences.every((w) => w.descriptions.length >= 2), r.workExperiences.map((w) => w.descriptions.length));
  check(`${cvProjects(lang)} projects`, r.projects.length === cvProjects(lang), r.projects.map((p) => p.project));
  check("master's degree found", r.educations.some((e) => /master/i.test(e.degree)), r.educations.map((e) => e.degree));
  check('skills section found', r.skills.descriptions.length >= 6, r.skills.descriptions.length);
}

console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
process.exit(failures ? 1 : 0);
