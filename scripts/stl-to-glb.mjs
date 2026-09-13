// Converts a binary STL into a minimal GLB (positions + uint16/uint32 indices, no normals:
// the viewer shades it flat). Vertices are welded on rounded coordinates, which is what
// makes the index buffer worth having. Run `pnpm exec gltf-transform optimize` on the
// result for meshopt compression.
//
//   node scripts/stl-to-glb.mjs in.stl out.glb
import { readFileSync, writeFileSync } from 'node:fs';

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error('usage: node scripts/stl-to-glb.mjs in.stl out.glb');
  process.exit(1);
}

const stl = readFileSync(input);
const triCount = stl.readUInt32LE(80);
if (stl.length !== 84 + triCount * 50) throw new Error('not a binary STL');

const key = (x, y, z) => `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
const lookup = new Map();
const positions = [];
const indices = [];
const min = [Infinity, Infinity, Infinity];
const max = [-Infinity, -Infinity, -Infinity];

for (let t = 0; t < triCount; t++) {
  const base = 84 + t * 50 + 12; // skip the face normal
  for (let v = 0; v < 3; v++) {
    const o = base + v * 12;
    const x = stl.readFloatLE(o);
    const y = stl.readFloatLE(o + 4);
    const z = stl.readFloatLE(o + 8);
    const k = key(x, y, z);
    let idx = lookup.get(k);
    if (idx === undefined) {
      idx = positions.length / 3;
      lookup.set(k, idx);
      positions.push(x, y, z);
      for (let i = 0; i < 3; i++) {
        const c = [x, y, z][i];
        if (c < min[i]) min[i] = c;
        if (c > max[i]) max[i] = c;
      }
    }
    indices.push(idx);
  }
}

const vertexCount = positions.length / 3;
const useU32 = vertexCount > 65535;
const posBuf = Buffer.from(new Float32Array(positions).buffer);
const idxBuf = Buffer.from((useU32 ? new Uint32Array(indices) : new Uint16Array(indices)).buffer);
const pad = (b) => (b.length % 4 ? Buffer.concat([b, Buffer.alloc(4 - (b.length % 4))]) : b);
const bin = Buffer.concat([pad(posBuf), pad(idxBuf)]);

const json = {
  asset: { version: '2.0', generator: 'scripts/stl-to-glb.mjs' },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0 }],
  meshes: [{ primitives: [{ attributes: { POSITION: 0 }, indices: 1 }] }],
  accessors: [
    { bufferView: 0, componentType: 5126, count: vertexCount, type: 'VEC3', min, max },
    { bufferView: 1, componentType: useU32 ? 5125 : 5123, count: indices.length, type: 'SCALAR' },
  ],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: posBuf.length, target: 34962 },
    { buffer: 0, byteOffset: pad(posBuf).length, byteLength: idxBuf.length, target: 34963 },
  ],
  buffers: [{ byteLength: bin.length }],
};

let jsonBuf = Buffer.from(JSON.stringify(json));
if (jsonBuf.length % 4) jsonBuf = Buffer.concat([jsonBuf, Buffer.alloc(4 - (jsonBuf.length % 4), 0x20)]);

const header = Buffer.alloc(12);
header.write('glTF', 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + jsonBuf.length + 8 + bin.length, 8);
const chunk = (len, type) => {
  const b = Buffer.alloc(8);
  b.writeUInt32LE(len, 0);
  b.writeUInt32LE(type, 4);
  return b;
};
writeFileSync(output, Buffer.concat([header, chunk(jsonBuf.length, 0x4e4f534a), jsonBuf, chunk(bin.length, 0x004e4942), bin]));
console.log(`${triCount} triangles, ${vertexCount} vertices, ${useU32 ? 'uint32' : 'uint16'} indices, ${(bin.length / 1024).toFixed(0)} KB`);
