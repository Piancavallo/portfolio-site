/**
 * Generate or refresh album.ts for an existing album folder.
 * Does not move, rename, or modify any image files.
 *
 * Usage:
 *   node scripts/createAlbum.mjs Ohio
 *   node scripts/createAlbum.mjs "San Angelo"
 *   node scripts/createAlbum.mjs --all
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const albumsRoot = path.join(root, 'src', 'images', 'albums');

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

function usage() {
  console.log('Usage: node scripts/createAlbum.mjs <album-name|--all>');
}

function sortFiles(files) {
  return [...files].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

function parseExistingCaptions(content) {
  const captions = new Map();
  const entryPattern = /file:\s*"((?:\\.|[^"\\])*)"[\s\S]*?caption:\s*"((?:\\.|[^"\\])*)"/g;
  let match;
  while ((match = entryPattern.exec(content)) !== null) {
    captions.set(JSON.parse(`"${match[1]}"`), JSON.parse(`"${match[2]}"`));
  }
  return captions;
}

function formatAlbumTs(photos) {
  if (photos.length === 0) {
    return 'export default {\n  photos: [],\n};\n';
  }

  const lines = photos.map(({ file, caption }) => {
    const fileJson = JSON.stringify(file);
    const captionJson = JSON.stringify(caption ?? '');
    return `    {\n      file: ${fileJson},\n      caption: ${captionJson},\n    }`;
  });

  return `export default {\n  photos: [\n${lines.join(',\n')},\n  ],\n};\n`;
}

async function listAlbumImages(albumDir) {
  const entries = await fs.readdir(albumDir, { withFileTypes: true });
  return sortFiles(
    entries
      .filter((entry) => entry.isFile() && IMAGE_EXT.test(entry.name) && entry.name !== 'album.ts')
      .map((entry) => entry.name),
  );
}

export async function writeAlbumMetadata(albumName, legacyCaptions = {}) {
  const albumDir = path.join(albumsRoot, albumName);
  const albumTsPath = path.join(albumDir, 'album.ts');

  let stat;
  try {
    stat = await fs.stat(albumDir);
  } catch {
    throw new Error(`Album folder not found: ${albumDir}`);
  }
  if (!stat.isDirectory()) {
    throw new Error(`Not an album directory: ${albumDir}`);
  }

  const files = await listAlbumImages(albumDir);

  let existingCaptions = new Map();
  try {
    const existing = await fs.readFile(albumTsPath, 'utf8');
    existingCaptions = parseExistingCaptions(existing);
  } catch {
    // new album.ts
  }

  const photos = files.map((file) => ({
    file,
    caption: existingCaptions.get(file) ?? legacyCaptions[file] ?? '',
  }));

  await fs.writeFile(albumTsPath, formatAlbumTs(photos), 'utf8');

  return { albumTsPath, count: photos.length };
}

async function listPhysicalAlbums() {
  const entries = await fs.readdir(albumsRoot, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    usage();
    process.exitCode = 1;
    return;
  }

  if (arg === '--all') {
    for (const albumName of await listPhysicalAlbums()) {
      const { albumTsPath, count } = await writeAlbumMetadata(albumName);
      console.log(`✓ ${albumTsPath} (${count} photos)`);
    }
    return;
  }

  const { albumTsPath, count } = await writeAlbumMetadata(path.basename(arg));
  console.log(`✓ ${albumTsPath}`);
  console.log(`  ${count} photo${count === 1 ? '' : 's'}`);
  console.log('  Run npm run optimize-albums to regenerate responsive variants.');
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
