/**
 * Mobile + Keyboard QA for 0xyz-exe.github.io portfolio
 * Run: node --experimental-vm-modules qa/mobile-keyboard.spec.mjs
 * Requires: npx playwright (v1.x installed globally or via npx)
 */
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SITE_DIR = join(__dirname, '..', '_site');

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

function serve(dir, port) {
  return new Promise(resolve => {
    const server = createServer((req, res) => {
      let p = join(dir, req.url === '/' ? 'index.html' : req.url);
      if (!existsSync(p)) p = join(dir, 'index.html');
      const ext = extname(p);
      const body = existsSync(p) ? readFileSync(p) : Buffer.from('Not found');
      res.writeHead(existsSync(p) ? 200 : 404, { 'Content-Type': MIME[ext] || 'text/plain' });
      res.end(body);
    });
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

const PASS = '✅';
const FAIL = '❌';
const SKIP = '⚠️ ';
const results = [];

function check(label, ok, detail = '') {
  const icon = ok === null ? SKIP : ok ? PASS : FAIL;
  results.push({ label, ok, detail });
  console.log(`${icon} ${label}${detail ? ' — ' + detail : ''}`);
}

async function run() {
  const PORT = 4444;
  const server = await serve(SITE_DIR, PORT);
  const BASE = `http://127.0.0.1:${PORT}`;

  const browser = await chromium.launch({ headless: true });

  // ─── Desktop baseline ────────────────────────────────────────────────────
  console.log('\n── DESKTOP (1280×800) ──');
  const desktop = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const dp = await desktop.newPage();
  const errors = [];
  dp.on('pageerror', e => errors.push(e.message));
  await dp.goto(BASE, { waitUntil: 'networkidle' });

  // Nav visible
  const navVisible = await dp.$eval('.nav', el => {
    const s = window.getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden';
  });
  check('Desktop nav visible', navVisible);

  // Menu toggle hidden on desktop
  const toggleHiddenDesktop = await dp.$eval('.menu-toggle', el => {
    const s = window.getComputedStyle(el);
    return s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0;
  });
  check('Desktop: menu-toggle hidden', toggleHiddenDesktop);

  // Theme toggle present and labelled
  const themeToggleOk = await dp.$eval('.theme-toggle', el => {
    return el.getAttribute('aria-label') && el.getAttribute('aria-label').length > 0;
  });
  check('Theme toggle has aria-label', themeToggleOk);

  // Screenshot images load (check naturalWidth > 0 for the first img with project class)
  const imgResults = await dp.evaluate(() => {
    return Array.from(document.querySelectorAll('.project figure img')).map(img => ({
      src: img.getAttribute('src'),
      w: img.naturalWidth,
      alt: img.getAttribute('alt'),
    }));
  });
  check('5 project screenshots present', imgResults.length === 5, `found ${imgResults.length}`);
  for (const img of imgResults) {
    check(`  img loads (${img.src.split('/').pop()})`, img.w > 0, `naturalWidth=${img.w}`);
    check(`  img has non-empty alt`, img.alt && img.alt.length > 5, img.alt || 'EMPTY');
  }

  // School CMS card has no img
  const schoolHasImg = await dp.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.project'));
    const school = cards.find(c => c.querySelector('h3')?.textContent.trim() === 'School CMS');
    return school ? !!school.querySelector('img') : null;
  });
  check('School CMS: no img tag', schoolHasImg === false, schoolHasImg === null ? 'card not found' : '');

  // No JS console errors
  check('No JS page errors (desktop)', errors.length === 0, errors.join('; '));

  await desktop.close();

  // ─── Mobile (375×812, iPhone 12 portrait) ────────────────────────────────
  console.log('\n── MOBILE (375×812) ──');
  const mobile = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
  });
  const mp = await mobile.newPage();
  const mErrors = [];
  mp.on('pageerror', e => mErrors.push(e.message));
  await mp.goto(BASE, { waitUntil: 'networkidle' });

  // Menu toggle visible on mobile
  const menuToggleVisible = await mp.$eval('.menu-toggle', el => {
    const s = window.getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden';
  });
  check('Mobile: menu-toggle visible', menuToggleVisible);

  // Nav initially hidden/off-screen on mobile
  const navHiddenMobile = await mp.$eval('.nav', el => {
    const s = window.getComputedStyle(el);
    return (
      s.display === 'none' ||
      s.visibility === 'hidden' ||
      parseFloat(s.opacity) === 0 ||
      el.getAttribute('aria-hidden') === 'true'
    );
  });
  check('Mobile: nav hidden before toggle', navHiddenMobile);

  // Click menu toggle → nav opens
  await mp.click('.menu-toggle');
  await mp.waitForTimeout(400);
  const navOpenAfterToggle = await mp.$eval('.nav', el => {
    const s = window.getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) !== 0;
  });
  check('Mobile: nav opens after menu-toggle click', navOpenAfterToggle);

  // aria-expanded updates
  const ariaExpanded = await mp.$eval('.menu-toggle', el => el.getAttribute('aria-expanded'));
  check('Mobile: aria-expanded="true" after open', ariaExpanded === 'true', `got "${ariaExpanded}"`);

  // Close menu by clicking toggle again
  await mp.click('.menu-toggle');
  await mp.waitForTimeout(400);
  const navClosedAgain = await mp.$eval('.nav', el => {
    const s = window.getComputedStyle(el);
    return (
      s.display === 'none' ||
      s.visibility === 'hidden' ||
      parseFloat(s.opacity) === 0 ||
      el.getAttribute('aria-hidden') === 'true'
    );
  });
  check('Mobile: nav closes after second toggle', navClosedAgain);

  // Horizontal overflow
  const hasHorizOverflow = await mp.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  check('Mobile: no horizontal overflow', !hasHorizOverflow,
    hasHorizOverflow ? `scrollWidth=${document.documentElement?.scrollWidth}` : '');

  // Project cards stack (grid is 1-column): first card top ≠ second card top
  const cardPositions = await mp.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.project'));
    return cards.slice(0, 2).map(c => c.getBoundingClientRect().top);
  });
  const cardsStack = cardPositions.length >= 2 && cardPositions[1] > cardPositions[0] + 50;
  check('Mobile: project cards stack vertically', cardsStack,
    `tops: ${cardPositions.map(t => Math.round(t)).join(', ')}`);

  // Screenshots: lazy-loaded imgs – check src attribute present (load may not complete in headless)
  const mImgSrcs = await mp.$$eval('.project figure img', imgs => imgs.map(i => i.getAttribute('src')));
  check('Mobile: 5 screenshot imgs in DOM', mImgSrcs.length === 5, `found ${mImgSrcs.length}`);

  // No errors
  check('No JS page errors (mobile)', mErrors.length === 0, mErrors.join('; '));

  await mobile.close();

  // ─── Keyboard navigation ──────────────────────────────────────────────────
  console.log('\n── KEYBOARD NAVIGATION (1280×800) ──');
  const kb = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const kp = await kb.newPage();
  await kp.goto(BASE, { waitUntil: 'networkidle' });

  // Skip link: first Tab → skip-link focused
  await kp.keyboard.press('Tab');
  const skipLinkFocused = await kp.evaluate(() => {
    const el = document.activeElement;
    return el && el.classList.contains('skip-link');
  });
  check('Keyboard: first Tab focuses skip-link', skipLinkFocused);

  // Skip link is visually present when focused (not display:none)
  const skipLinkVisible = await kp.$eval('.skip-link', el => {
    const s = window.getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden';
  });
  check('Keyboard: skip-link visible when focused', skipLinkVisible);

  // Press Enter on skip-link → focus moves to #main
  await kp.keyboard.press('Enter');
  await kp.waitForTimeout(100);
  const mainFocused = await kp.evaluate(() => {
    const el = document.activeElement;
    return el && el.id === 'main';
  });
  check('Keyboard: skip-link Enter moves focus to #main', mainFocused);

  // Tab through nav links: all nav <a> are reachable
  await kp.goto(BASE, { waitUntil: 'networkidle' });
  // Tab past skip-link
  await kp.keyboard.press('Tab');
  // Tab through wordmark, then nav links
  const navLinks = await kp.$$('.nav a');
  const navLinkCount = navLinks.length;
  // Tab enough times to reach all nav links (skip-link + wordmark + menu-toggle potentially + nav items)
  const focusedTexts = [];
  for (let i = 0; i < navLinkCount + 5; i++) {
    await kp.keyboard.press('Tab');
    const info = await kp.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      return { tag: el.tagName, text: el.textContent?.trim().slice(0, 30), cls: el.className };
    });
    if (info && info.tag === 'A' && info.cls.includes('nav') === false) {
      // might be a nav link
    }
    if (info) focusedTexts.push(info);
  }
  // Check that at least 5 nav links were reachable via Tab
  const navLinkTexts = ['About', 'Expertise', 'Projects', 'Experience', 'Contact'];
  const reachedNav = navLinkTexts.filter(t => focusedTexts.some(f => f.text && f.text.includes(t)));
  check(`Keyboard: all 5 nav links reachable via Tab`, reachedNav.length === 5,
    `reached: ${reachedNav.join(', ')} (${reachedNav.length}/5)`);

  // Focus outline visible: check that outline is not "none" on a focused nav link
  await kp.goto(BASE, { waitUntil: 'networkidle' });
  // Tab to first nav <a> (skip-link → wordmark → first nav link, may vary)
  for (let i = 0; i < 4; i++) await kp.keyboard.press('Tab');
  const outlineOk = await kp.evaluate(() => {
    const el = document.activeElement;
    if (!el) return false;
    const s = window.getComputedStyle(el);
    return s.outlineStyle !== 'none' && s.outlineWidth !== '0px';
  });
  check('Keyboard: focused element has visible outline', outlineOk);

  // Theme toggle keyboard activation (Space or Enter)
  // Navigate to theme toggle
  await kp.goto(BASE, { waitUntil: 'networkidle' });
  await kp.focus('.theme-toggle');
  const labelBefore = await kp.$eval('.theme-toggle', el => el.getAttribute('aria-label'));
  await kp.keyboard.press('Space');
  await kp.waitForTimeout(200);
  const labelAfter = await kp.$eval('.theme-toggle', el => el.getAttribute('aria-label'));
  check('Keyboard: theme-toggle Space changes aria-label', labelBefore !== labelAfter,
    `before="${labelBefore}" after="${labelAfter}"`);

  // Project links are keyboard-focusable
  await kp.goto(BASE, { waitUntil: 'networkidle' });
  const projectLinks = await kp.$$('.project .project-links a');
  check('Project cards have at least 5 keyboard-accessible links', projectLinks.length >= 5,
    `found ${projectLinks.length}`);

  await kb.close();

  // ─── Reduced motion (prefers-reduced-motion: reduce) ─────────────────────
  console.log('\n── REDUCED MOTION ──');
  const rmCtx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce',
  });
  const rmp = await rmCtx.newPage();
  await rmp.goto(BASE, { waitUntil: 'networkidle' });

  // Page still renders (no crash)
  const titleRm = await rmp.title();
  check('Reduced-motion: page loads without crash', titleRm.includes('Daniel'), `title="${titleRm}"`);

  // Signal dot animation should be none under reduced motion
  const signalAnimDuration = await rmp.$eval('.signal-dot', el => {
    return window.getComputedStyle(el).animationDuration;
  }).catch(() => 'N/A');
  // 0s or element not found both fine; just check it's not crashing and page title is present
  check('Reduced-motion: signal-dot animation duration (informational)', null,
    `animationDuration=${signalAnimDuration}`);

  await rmCtx.close();

  // ─── Summary ──────────────────────────────────────────────────────────────
  console.log('\n── SUMMARY ──');
  const failed = results.filter(r => r.ok === false);
  const passed = results.filter(r => r.ok === true);
  const skipped = results.filter(r => r.ok === null);
  console.log(`${PASS} Passed: ${passed.length}`);
  console.log(`${FAIL} Failed: ${failed.length}`);
  console.log(`${SKIP} Info:   ${skipped.length}`);
  if (failed.length) {
    console.log('\nFailed checks:');
    for (const f of failed) console.log(`  ${FAIL} ${f.label} — ${f.detail}`);
  }

  await browser.close();
  server.close();
  process.exit(failed.length > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('QA script error:', err);
  process.exit(1);
});
