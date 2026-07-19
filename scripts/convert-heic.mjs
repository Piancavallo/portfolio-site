/**
 * Convert album HEIC/HEIF files to sibling JPEGs so the site can serve them in browsers.
 * Skips conversion when a newer/same-age .jpg already exists.
 *
 * Usage: node scripts/convert-heic.mjs
 */
import convert from 'heic-convert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const albumsRoot = path.join(root, 'src', 'images', 'albums');

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function jpegPathFor(heicPath) {
  const { dir, name } = path.parse(heicPath);
  return path.join(dir, `${name}.jpg`);
}

async function needsConvert(heicPath, jpgPath) {
  try {
    const [heicStat, jpgStat] = await Promise.all([fs.stat(heicPath), fs.stat(jpgPath)]);
    return jpgStat.mtimeMs < heicStat.mtimeMs || jpgStat.size < 1024;
  } catch {
    return true;
  }
}

async function convertOne(heicPath) {
  const jpgPath = jpegPathFor(heicPath);
  if (!(await needsConvert(heicPath, jpgPath))) {
    return 'skip';
  }

  const input = await fs.readFile(heicPath);
  const output = Buffer.from(
    await convert({
      buffer: input,
      format: 'JPEG',
      quality: 0.85,
    }),
  );
  await fs.writeFile(jpgPath, output);
  return 'wrote';
}

async function main() {
  let wrote = 0;
  let skipped = 0;
  let failed = 0;

  for await (const file of walk(albumsRoot)) {
    if (!/\.heic$/i.test(file)) continue;
    const rel = path.relative(root, file);
    try {
      const result = await convertOne(file);
      if (result === 'wrote') {
        wrote += 1;
        console.log(`✓ ${rel}`);
      } else {
        skipped += 1;
      }
    } catch (err) {
      failed += 1;
      console.error(`✗ ${rel}: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`\nHEIC convert done — wrote ${wrote}, skipped ${skipped}, failed ${failed}`);
  if (failed > 0) process.exitCode = 1;
}

main();
