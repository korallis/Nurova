/**
 * Builds the web copies of the brand font, public/fonts/Grift-*.woff, from the
 * original public/fonts/Grift-*.ttf files:
 *
 *   - removes the TrueType hinting, which distorts some letters at small sizes
 *     on Windows (the "M" loses half its strokes at 12–24px);
 *   - packs them as WOFF, about half the size of the TTFs.
 *
 * Every other table (kerning, ligatures, metrics, names) is copied unchanged.
 *
 *   bun run fonts:build
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const DIR = new URL('../public/fonts/', import.meta.url);
const WEIGHTS = ['Regular', 'Medium', 'Bold'];
/** Hinting programs, and the digital signature, which no longer matches. */
const DROP = new Set(['fpgm', 'prep', 'cvt ', 'DSIG']);

const pad4 = (buf) => (buf.length % 4 ? Buffer.concat([buf, Buffer.alloc(4 - (buf.length % 4))]) : buf);

function checksum(buf) {
  const padded = pad4(buf);
  let sum = 0;
  for (let i = 0; i < padded.length; i += 4) sum = (sum + padded.readUInt32BE(i)) >>> 0;
  return sum;
}

function readTables(font) {
  const tables = new Map();
  for (let i = 0; i < font.readUInt16BE(4); i++) {
    const record = 12 + i * 16;
    const tag = font.toString('latin1', record, record + 4);
    const offset = font.readUInt32BE(record + 8);
    tables.set(tag, Buffer.from(font.subarray(offset, offset + font.readUInt32BE(record + 12))));
  }
  return { flavor: font.readUInt32BE(0), tables };
}

/** Removes the instructions from every glyph and rewrites glyf/loca (long offsets). */
function stripGlyphInstructions(tables) {
  const head = tables.get('head');
  const maxp = tables.get('maxp');
  const loca = tables.get('loca');
  const glyf = tables.get('glyf');
  const numGlyphs = maxp.readUInt16BE(4);
  const longLoca = head.readInt16BE(50) === 1;
  const offsetOf = (i) => (longLoca ? loca.readUInt32BE(i * 4) : loca.readUInt16BE(i * 2) * 2);

  const glyphs = [];
  for (let i = 0; i < numGlyphs; i++) {
    const start = offsetOf(i);
    const end = offsetOf(i + 1);
    if (end <= start) {
      glyphs.push(Buffer.alloc(0));
      continue;
    }
    const glyph = Buffer.from(glyf.subarray(start, end));
    const contours = glyph.readInt16BE(0);
    if (contours >= 0) {
      // Simple glyph: header, contour ends, then the instructions to remove.
      const at = 10 + contours * 2;
      const length = glyph.readUInt16BE(at);
      glyphs.push(Buffer.concat([glyph.subarray(0, at), Buffer.alloc(2), glyph.subarray(at + 2 + length)]));
    } else {
      // Composite glyph: clear WE_HAVE_INSTRUCTIONS and drop what follows the last component.
      let p = 10;
      let flags;
      do {
        flags = glyph.readUInt16BE(p);
        glyph.writeUInt16BE(flags & ~0x0100, p);
        p += 4 + (flags & 0x0001 ? 4 : 2);
        if (flags & 0x0008) p += 2;
        else if (flags & 0x0040) p += 4;
        else if (flags & 0x0080) p += 8;
      } while (flags & 0x0020);
      glyphs.push(glyph.subarray(0, p));
    }
  }

  const padded = glyphs.map(pad4);
  const newLoca = Buffer.alloc((numGlyphs + 1) * 4);
  let offset = 0;
  padded.forEach((glyph, i) => {
    newLoca.writeUInt32BE(offset, i * 4);
    offset += glyph.length;
  });
  newLoca.writeUInt32BE(offset, numGlyphs * 4);
  tables.set('glyf', Buffer.concat(padded));
  tables.set('loca', newLoca);
  head.writeInt16BE(1, 50);
  // maxp 1.0: no function or instruction definitions, no instructions.
  if (maxp.readUInt32BE(0) === 0x00010000) for (const at of [20, 22, 26]) maxp.writeUInt16BE(0, at);
}

/** Lays the tables out as a font file, to size it and to fill in head.checkSumAdjustment. */
function finishSfnt(flavor, tables) {
  const tags = [...tables.keys()].sort();
  const head = tables.get('head');
  head.writeUInt32BE(0, 8);
  const sums = Object.fromEntries(tags.map((tag) => [tag, checksum(tables.get(tag))]));
  const entrySelector = Math.floor(Math.log2(tags.length));
  const searchRange = 2 ** entrySelector * 16;
  const directory = Buffer.alloc(12 + tags.length * 16);
  directory.writeUInt32BE(flavor, 0);
  directory.writeUInt16BE(tags.length, 4);
  directory.writeUInt16BE(searchRange, 6);
  directory.writeUInt16BE(entrySelector, 8);
  directory.writeUInt16BE(tags.length * 16 - searchRange, 10);
  let offset = directory.length;
  tags.forEach((tag, i) => {
    const record = 12 + i * 16;
    directory.write(tag, record, 'latin1');
    directory.writeUInt32BE(sums[tag], record + 4);
    directory.writeUInt32BE(offset, record + 8);
    directory.writeUInt32BE(tables.get(tag).length, record + 12);
    offset += pad4(tables.get(tag)).length;
  });
  const sfnt = Buffer.concat([directory, ...tags.map((tag) => pad4(tables.get(tag)))]);
  head.writeUInt32BE((0xb1b0afba - checksum(sfnt)) >>> 0, 8);
  return { size: sfnt.length, sums };
}

function toWoff(flavor, tables, { size, sums }) {
  const tags = [...tables.keys()].sort();
  const directory = Buffer.alloc(tags.length * 20);
  const data = [];
  let offset = 44 + directory.length;
  tags.forEach((tag, i) => {
    const table = tables.get(tag);
    const compressed = deflateSync(table, { level: 9 });
    const stored = compressed.length < table.length ? compressed : table;
    directory.write(tag, i * 20, 'latin1');
    directory.writeUInt32BE(offset, i * 20 + 4);
    directory.writeUInt32BE(stored.length, i * 20 + 8);
    directory.writeUInt32BE(table.length, i * 20 + 12);
    directory.writeUInt32BE(sums[tag], i * 20 + 16);
    data.push(pad4(stored));
    offset += pad4(stored).length;
  });
  const header = Buffer.alloc(44);
  header.write('wOFF', 0, 'latin1');
  header.writeUInt32BE(flavor, 4);
  header.writeUInt32BE(offset, 8);
  header.writeUInt16BE(tags.length, 12);
  header.writeUInt32BE(size, 16);
  header.writeUInt16BE(1, 20);
  return Buffer.concat([header, directory, ...data]);
}

for (const weight of WEIGHTS) {
  const source = readFileSync(new URL(`Grift-${weight}.ttf`, DIR));
  const { flavor, tables } = readTables(source);
  for (const tag of DROP) tables.delete(tag);
  stripGlyphInstructions(tables);
  // Smooth rendering at every size, with no grid-fitting.
  tables.set('gasp', Buffer.from([0, 1, 0, 1, 0xff, 0xff, 0, 0x0a]));
  const woff = toWoff(flavor, tables, finishSfnt(flavor, tables));
  writeFileSync(new URL(`Grift-${weight}.woff`, DIR), woff);
  console.log(`Grift-${weight}: ${source.length} → ${woff.length} bytes`);
}
