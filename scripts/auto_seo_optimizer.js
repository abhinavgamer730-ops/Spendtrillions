/**
 * Automated SEO Optimizer & Sitemap Build Script
 * Project: Spend Elon Musk's Money - Spend 1 Trillion Dollars Game
 * Author: Abhinav Gupta
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');
const robotsPath = path.join(rootDir, 'robots.txt');
const sitemapPath = path.join(rootDir, 'sitemap.xml');

const domain = 'https://abhinavgamer730-ops.github.io/Spendtrillions/';

console.log('🚀 Running Automated SEO Optimizer System...\n');

// 1. UPDATE SITEMAP.XML
function updateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];

  const urls = [
    { loc: domain, priority: '1.0', changefreq: 'daily' },
    { loc: domain + '#level-4-elon-musk', priority: '0.9', changefreq: 'daily' },
    { loc: domain + '#level-3-trillionaire-grind', priority: '0.8', changefreq: 'weekly' },
    { loc: domain + '#level-2-billionaire-prep', priority: '0.7', changefreq: 'weekly' },
    { loc: domain + '#level-1-starter-loan', priority: '0.7', changefreq: 'weekly' }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  urls.forEach(url => {
    xml += `  <url>\n`;
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`✅ [Sitemap] Updated sitemap.xml with <lastmod>${currentDate}</lastmod> for ${urls.length} URLs.`);
}

// 2. VALIDATE ROBOTS.TXT
function validateRobots() {
  let content = '';
  if (fs.existsSync(robotsPath)) {
    content = fs.readFileSync(robotsPath, 'utf8');
  }

  const expectedSitemapLine = `Sitemap: ${domain}sitemap.xml`;
  let updated = content;

  if (!content.includes('User-agent: *')) {
    updated = `User-agent: *\nAllow: /\n\n` + updated;
  }

  if (!content.includes(expectedSitemapLine)) {
    updated = updated.trim() + `\n\n${expectedSitemapLine}\n`;
  }

  if (updated !== content || !fs.existsSync(robotsPath)) {
    fs.writeFileSync(robotsPath, updated, 'utf8');
    console.log('✅ [Robots] Updated robots.txt with active Sitemap directive.');
  } else {
    console.log('✅ [Robots] robots.txt is valid and up to date.');
  }
}

// 3. RUN AUTOMATED SEO AUDIT
function runSEOAudit() {
  if (!fs.existsSync(indexPath)) {
    console.error('❌ [Audit] index.html not found!');
    return;
  }

  const html = fs.readFileSync(indexPath, 'utf8');
  const issues = [];
  const passes = [];

  // Title Check
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  if (titleMatch) {
    const title = titleMatch[1];
    if (title.length >= 30 && title.length <= 75) {
      passes.push(`Title Tag: "${title}" (${title.length} chars)`);
    } else {
      issues.push(`Title length (${title.length} chars) is outside optimal 30-75 range.`);
    }
  } else {
    issues.push('Missing <title> tag.');
  }

  // Meta Description Check
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || html.match(/<meta\s+name='description'\s+content='([^']*)'/i);
  if (descMatch) {
    const desc = descMatch[1];
    if (desc.length >= 100 && desc.length <= 180) {
      passes.push(`Meta Description: "${desc.substring(0, 50)}..." (${desc.length} chars)`);
    } else {
      issues.push(`Meta Description length (${desc.length} chars) outside 100-180 char range.`);
    }
  } else {
    issues.push('Missing <meta name="description"> tag.');
  }

  // Canonical Tag Check
  if (html.includes('<link rel="canonical"')) {
    passes.push('Canonical URL tag present');
  } else {
    issues.push('Missing <link rel="canonical"> tag.');
  }

  // OpenGraph & Twitter Tags
  if (html.includes('og:title') && html.includes('og:description')) {
    passes.push('OpenGraph metadata present');
  } else {
    issues.push('Missing OpenGraph meta tags.');
  }

  if (html.includes('twitter:title') && html.includes('twitter:card')) {
    passes.push('Twitter Card metadata present');
  } else {
    issues.push('Missing Twitter Card meta tags.');
  }

  // Schema Microdata / JSON-LD Check
  if (html.includes('AutoSEOEngine') || html.includes('application/ld+json')) {
    passes.push('Structured Data (JSON-LD / AutoSEOEngine) active');
  } else {
    issues.push('Missing Structured Data / AutoSEOEngine script.');
  }

  console.log('\n📊 --- SEO HEALTH AUDIT REPORT ---');
  passes.forEach(p => console.log(`  ✅ PASS: ${p}`));
  if (issues.length === 0) {
    console.log('\n🌟 RESULT: PERFECT SEO HEALTH (0 Errors/Warnings)!');
  } else {
    issues.forEach(i => console.log(`  ⚠️ WARN: ${i}`));
  }
}

try {
  updateSitemap();
  validateRobots();
  runSEOAudit();
  console.log('\n✨ Automated SEO Optimization Completed Successfully!');
} catch (err) {
  console.error('❌ Error during SEO optimization:', err.message);
  process.exit(1);
}
