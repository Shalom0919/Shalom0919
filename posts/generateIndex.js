const fs = require('fs');
const path = require('path');

const dir = __dirname; // posts/
const outFile = path.join(dir, 'posts.json');

function extractTitle(content, filename) {
  const m = content.match(/^#\s+(.+)$/m);
  if (m) return m[1].trim();
  // fallback: use filename without extension and date prefix
  return filename.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-?/, '').replace(/-/g, ' ');
}

function extractExcerpt(content) {
  // split into paragraphs
  const parts = content.split(/\r?\n\s*\r?\n/).map(s => s.trim()).filter(Boolean);
  for (const p of parts) {
    if (!p.startsWith('#') && !p.startsWith('>') && !/^(-|\*|\d+\.)\s+/.test(p)) {
      // strip markdown links/images
      const noMd = p.replace(/!\[.*?\]\(.*?\)/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1');
      const plain = noMd.replace(/[`*_]+/g, '').replace(/\n/g, ' ').trim();
      return plain.length > 160 ? plain.slice(0, 157) + '...' : plain;
    }
  }
  return '';
}

function extractDateFromFilename(filename) {
  const m = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  try {
    const stat = fs.statSync(path.join(dir, filename));
    return new Date(stat.mtime).toISOString().slice(0, 10);
  } catch (e) {
    return '';
  }
}

function buildIndex() {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  const posts = files.map(f => {
    const p = path.join(dir, f);
    const content = fs.readFileSync(p, 'utf8');
    const title = extractTitle(content, f);
    const excerpt = extractExcerpt(content);
    const date = extractDateFromFilename(f);
    const url = `posts/viewer.html?file=posts/${f}`;
    return { title, date, url, excerpt };
  }).sort((a,b) => (b.date || '').localeCompare(a.date || ''));

  const out = { posts };
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${posts.length} posts to ${outFile}`);
}

try {
  buildIndex();
} catch (err) {
  console.error('Error building posts index:', err);
  process.exit(1);
}
