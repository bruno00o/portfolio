// CV template. Data comes from src/cv.ts through --input data=<json>.
// Colors and type scale mirror src/styles/tokens.css.

#let d = json(bytes(sys.inputs.data))

#let zinc-950 = rgb("#09090b")
#let zinc-700 = rgb("#3f3f46")
#let zinc-600 = rgb("#52525b")
#let zinc-500 = rgb("#71717a")
#let zinc-400 = rgb("#a1a1aa")
#let zinc-200 = rgb("#e4e4e7")
#let accent = rgb("#1f9dff")

#set document(title: d.name + ", " + d.title, author: d.name)
#set page(
  paper: "a4",
  margin: (x: 14mm, top: 13mm, bottom: 12mm),
  footer: context if counter(page).final().first() > 1 [
    #set text(font: "Geist Mono", size: 7pt, fill: zinc-500)
    #d.siteLabel
    #h(1fr)
    #counter(page).display("1 / 1", both: true)
  ],
)
#set text(font: "Geist", size: 10pt, fill: zinc-950, lang: d.lang)
#set par(leading: 0.6em, spacing: 0.6em)
#show link: set text(fill: zinc-950)

// No letter-spacing outside headings: ATS parsers split tracked text into
// separate items, which breaks date ranges. Bold weights matter for the same
// reason, they are how parsers tell names, roles and section titles apart.
#let mono(body, size: 7.5pt, fill: zinc-500, weight: 400, tracking: 0em) = text(
  font: "Geist Mono",
  size: size,
  fill: fill,
  weight: weight,
  tracking: tracking,
  body,
)

#show heading.where(level: 1): it => block(
  above: 16pt,
  below: 10pt,
  width: 100%,
  stack(dir: ttb, spacing: 6pt, mono(upper(it.body), size: 8pt, weight: 600, fill: zinc-950, tracking: 0.06em), line(length: 100%, stroke: 0.6pt + zinc-400)),
)

// **bold** spans in bullet strings, the same convention as CvPage.astro.
#let rich(s, fill: zinc-700) = s.split("**").enumerate().map(((i, part)) => text(fill: fill, weight: if calc.odd(i) { 600 } else { 400 }, part)).join()

#let dot = box(circle(radius: 1.1pt, fill: zinc-400), baseline: -2.2pt)
#set list(marker: dot, indent: 0pt, body-indent: 6pt, spacing: 4.5pt)

// Gaps inside an entry (role -> lead -> bullets) must stay under 1.4x the bullet
// pitch or OpenResume splits the entry into several; the gap between entries
// must stay above it. `pnpm test:cv` checks both.
#let entry(role, org, dates, tag: none, note: none, body: none, gap: 13pt) = block(breakable: true, below: gap)[
  #grid(
    columns: (1fr, auto),
    align: (left, right),
    column-gutter: 10pt,
    [
      #text(weight: 600)[#role]
      #h(3pt)
      #text(fill: zinc-600)[#org]
      #if tag != none [#h(4pt) #mono(tag, size: 7pt)]
    ],
    mono(dates),
  )
  #if note != none [#v(1pt) #mono(note, size: 7pt, fill: zinc-600)]
  #if body != none [#v(3pt) #body]
]

// ---------- Header ----------

#grid(
  columns: (1fr, auto, auto),
  align: (left + bottom, right + bottom, bottom),
  column-gutter: 14pt,
  [
    #text(size: 26pt, weight: 600, tracking: -0.025em)[#d.name#h(1.5pt)#box(circle(radius: 3.4pt, fill: accent), baseline: -0.5pt)]
    #v(-3pt)
    #text(size: 11pt, fill: zinc-600)[#d.title, #d.location]
  ],
  [
    #set par(leading: 0.55em)
    #set text(size: 7.5pt)
    #mono(fill: zinc-700)[#link("mailto:" + d.email)[#d.email]] \
    #if "phone" in d [#mono(fill: zinc-700)[#link("tel:" + d.phone.replace(" ", ""))[#d.phone]] \ ]
    #mono(fill: zinc-700)[#link(d.site)[#d.siteLabel]] \
    #mono[#link(d.github)[#d.githubLabel]] \
    #mono[#link(d.linkedin)[#d.linkedinLabel]]
  ],
  link(d.site, image(bytes(d.qr), format: "svg", width: 16mm, alt: d.siteLabel)),
)

// ---------- Profile ----------

= #d.labels.profile

#text(fill: zinc-700)[#d.summary]

// ---------- Stack, languages, certifications ----------

= #d.labels.stack

#let row(label, items) = (mono(label, size: 7pt), text(fill: zinc-700)[#items.join(", ")])

// Two columns: the label/items grid is repeated on each side, rows split in half.
// The row order in src/content/cv.ts is chosen so both columns come out about as tall.
#let skill-rows = d.stack.map(r => row(r.label, r.items)) + (row(d.labels.languages, d.languages), row(d.labels.certifications, d.certifications))
#let half = calc.floor(skill-rows.len() / 2)
#let skills(rows) = grid(
  columns: (auto, 1fr),
  column-gutter: 10pt,
  row-gutter: 5pt,
  ..rows.flatten(),
)

#grid(
  columns: (1fr, 1fr),
  column-gutter: 20pt,
  skills(skill-rows.slice(0, half)),
  skills(skill-rows.slice(half)),
)

// ---------- Experience ----------

= #d.labels.work

#for w in d.work {
  entry(w.role, w.org, w.dates, tag: w.at("tag", default: none), gap: 18pt, body: [
    #text(weight: 600, fill: zinc-700)[#w.lead]
    #v(3pt)
    #list(..w.bullets.map(b => rich(b)))
  ])
}

// ---------- Projects ----------

= #d.labels.projects

#for p in d.projects {
  block(breakable: false, below: 10pt)[
    #text(weight: 600)[#link(p.url)[#p.title]]
    #h(4pt)
    #mono(p.stack.join(", "), size: 7pt)
    #v(-1pt)
    #text(fill: zinc-700)[#p.desc]
  ]
}

// ---------- Education ----------

= #d.labels.education

#for e in d.education {
  entry(e.role, e.org, e.dates, tag: e.at("tag", default: none), note: e.at("note", default: none))
}
