/**
 * Build-time responsive album image pipeline.
 * Originals in src/images/albums/ are untouched.
 * Outputs WebP variants to public/_optimized/albums/ and a JSON manifest.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const albumsRoot = path.join(root, 'src', 'images', 'albums');
const outputRoot = path.join(root, 'public', '_optimized', 'albums');
const manifestPath = path.join(root, 'src', 'generated', 'albumPhotos.manifest.json');

/** Additional flat image folders (no album.ts) included in the same manifest. */
const EXTRA_GALLERIES = [
  { key: '__garden__', sourceDir: path.join(root, 'src', 'images', 'garden'), outputName: 'garden' },
];

const WIDTHS = [400, 800, 1600];
const QUALITY = { 400: 72, 800: 78, 1600: 82 };
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

const GALLERY_SIZES =
  '(max-width: 480px) 45vw, (max-width: 768px) 30vw, (max-width: 1200px) 22vw, 200px';

function sortFiles(files) {
  return [...files].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

function parseAlbumPhotos(content) {
  const photos = [];
  const entryPattern = /file:\s*"((?:\\.|[^"\\])*)"[\s\S]*?caption:\s*"((?:\\.|[^"\\])*)"/g;
  let match;
  while ((match = entryPattern.exec(content)) !== null) {
    photos.push({
      file: JSON.parse(`"${match[1]}"`),
      caption: JSON.parse(`"${match[2]}"`),
    });
  }
  return photos;
}

async function readAlbumOrder(albumName) {
  const albumTsPath = path.join(albumsRoot, albumName, 'album.ts');
  try {
    const content = await fs.readFile(albumTsPath, 'utf8');
    return parseAlbumPhotos(content);
  } catch {
    return null;
  }
}

async function listAlbumImages(albumDir) {
  const entries = await fs.readdir(albumDir, { withFileTypes: true });
  return sortFiles(
    entries
      .filter((entry) => entry.isFile() && IMAGE_EXT.test(entry.name))
      .map((entry) => entry.name),
  );
}

async function isUpToDate(sourcePath, outputPaths) {
  const sourceStat = await fs.stat(sourcePath);
  for (const outputPath of outputPaths) {
    try {
      const outStat = await fs.stat(outputPath);
      if (outStat.mtimeMs < sourceStat.mtimeMs) return false;
    } catch {
      return false;
    }
  }
  return outputPaths.length > 0;
}

async function optimizeImage(sourcePath, outputAlbumName, fileName) {
  const meta = await sharp(sourcePath).metadata();
  const naturalWidth = meta.width ?? 0;
  const naturalHeight = meta.height ?? 0;
  if (naturalWidth < 1 || naturalHeight < 1) return null;

  const stem = path.parse(fileName).name;
  const outDir = path.join(outputRoot, outputAlbumName);
  await fs.mkdir(outDir, { recursive: true });

  const targetWidths = WIDTHS.map((w) => Math.min(w, naturalWidth));
  const uniqueWidths = [...new Set(targetWidths)].sort((a, b) => a - b);

  const outputPaths = uniqueWidths.map((w) => path.join(outDir, `${stem}-${w}w.webp`));
  const fullPath = path.join(outDir, `${stem}-full.webp`);

  if (!(await isUpToDate(sourcePath, [...outputPaths, fullPath]))) {
    for (const w of uniqueWidths) {
      const outPath = path.join(outDir, `${stem}-${w}w.webp`);
      await sharp(sourcePath)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY[w] ?? 80, effort: 4 })
        .toFile(outPath);
    }

    const fullWidth = Math.min(1600, naturalWidth);
    if (naturalWidth <= 1600) {
      await sharp(sourcePath)
        .rotate()
        .webp({ quality: 85, effort: 4 })
        .toFile(fullPath);
    } else {
      await sharp(sourcePath)
        .rotate()
        .resize({ width: fullWidth, withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 })
        .toFile(fullPath);
    }
  }

  const variants = await Promise.all(
    uniqueWidths.map(async (w) => {
      const outPath = path.join(outDir, `${stem}-${w}w.webp`);
      const info = await sharp(outPath).metadata();
      return {
        width: info.width ?? w,
        url: `/_optimized/albums/${outputAlbumName}/${stem}-${w}w.webp`,
      };
    }),
  );

  const fullSrc = `/_optimized/albums/${outputAlbumName}/${stem}-full.webp`;
  const srcSet = variants.map((v) => `${v.url} ${v.width}w`).join(', ');
  const smallest = variants[0];

  return {
    src: smallest?.url ?? fullSrc,
    srcSet,
    sizes: GALLERY_SIZES,
    fullSrc,
    width: naturalWidth,
    height: naturalHeight,
  };
}

async function buildAlbum(albumName) {
  const albumDir = path.join(albumsRoot, albumName);
  const filesOnDisk = await listAlbumImages(albumDir);
  const albumOrder = await readAlbumOrder(albumName);

  const orderedFiles = albumOrder
    ? albumOrder.map((entry) => entry.file).filter((file) => filesOnDisk.includes(file))
    : filesOnDisk;

  const extraFiles = filesOnDisk.filter((file) => !orderedFiles.includes(file));
  const files = [...orderedFiles, ...sortFiles(extraFiles)];

  const captions = new Map(albumOrder?.map((entry) => [entry.file, entry.caption]) ?? []);

  const photos = [];
  for (const file of files) {
    const sourcePath = path.join(albumDir, file);
    const optimized = await optimizeImage(sourcePath, albumName, file);
    if (!optimized) continue;
    photos.push({
      ...optimized,
      caption: (captions.get(file) ?? '').trim(),
    });
  }

  return photos;
}

async function buildFlatGallery({ key, sourceDir, outputName }) {
  try {
    await fs.access(sourceDir);
  } catch {
    return [];
  }

  const files = await listAlbumImages(sourceDir);
  const photos = [];

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const optimized = await optimizeImage(sourcePath, outputName, file);
    if (!optimized) continue;
    photos.push({
      ...optimized,
      caption: '',
    });
  }

  return photos;
}

async function main() {
  const entries = await fs.readdir(albumsRoot, { withFileTypes: true });
  const albumNames = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

  const manifest = {};
  let total = 0;

  for (const albumName of albumNames) {
    const photos = await buildAlbum(albumName);
    manifest[albumName] = photos;
    total += photos.length;
    console.log(`✓ ${albumName}: ${photos.length} photos`);
  }

  for (const gallery of EXTRA_GALLERIES) {
    const photos = await buildFlatGallery(gallery);
    manifest[gallery.key] = photos;
    total += photos.length;
    console.log(`✓ ${gallery.key}: ${photos.length} photos`);
  }

  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log(`\nOptimized ${total} album photos → public/_optimized/albums/`);
  console.log(`Manifest → src/generated/albumPhotos.manifest.json`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
