const fs = require('fs');
const path = require('path');
const vm = require('vm');

const useColor = !process.env.NO_COLOR;
const c = {
  reset: useColor ? '\x1b[0m' : '',
  bold: useColor ? '\x1b[1m' : '',
  sky: useColor ? '\x1b[38;2;56;189;248m' : '',
  emerald: useColor ? '\x1b[38;2;52;211;153m' : '',
  amber: useColor ? '\x1b[38;2;251;191;36m' : '',
  rose: useColor ? '\x1b[38;2;248;113;113m' : '',
  slate: useColor ? '\x1b[38;2;148;163;184m' : '',
  darkSlate: useColor ? '\x1b[38;2;71;85;105m' : '',
  white: useColor ? '\x1b[38;2;248;250;252m' : '',
};

let errorCount = 0;
let warnCount = 0;
let okCount = 0;

function reportError(category, message) {
  errorCount++;
  console.error(`  ${c.rose}✖${c.reset}  ${c.rose}[ERROR] ${category}:${c.reset} ${message}`);
}

function reportWarn(category, message) {
  warnCount++;
  console.warn(`  ${c.amber}▲${c.reset}  ${c.amber}[WARN] ${category}:${c.reset} ${message}`);
}

function reportSuccess(category, message) {
  okCount++;
  console.log(`  ${c.emerald}✔${c.reset}  ${c.sky}[${category}]${c.reset} ${c.white}${message}${c.reset}`);
}

console.log(`\n${c.darkSlate}╭──────────────────────────────────────────────────────────────────────────╮${c.reset}`);
console.log(`${c.darkSlate}│${c.reset}  ${c.bold}${c.sky}FULL SUITE AUDIT & STATIC ANALYSIS${c.reset}                                      ${c.darkSlate}│${c.reset}`);
console.log(`${c.darkSlate}╰──────────────────────────────────────────────────────────────────────────╯${c.reset}\n`);

// 1. Check Files Existence
const requiredFiles = ['index.html', 'styles.css', 'script.js', 'server.js', 'package.json'];
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    reportSuccess('File Structure', `Found core file '${file}'`);
  } else {
    reportError('File Structure', `Missing core file '${file}'`);
  }
}

// 2. Syntax check JS files
console.log('\n--- Checking JavaScript Syntax & Runtime Initialization ---');
const js = fs.readFileSync('script.js', 'utf8');
const serverJs = fs.readFileSync('server.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');

try {
  new vm.Script(serverJs);
  reportSuccess('Syntax', 'server.js compiles cleanly');
} catch (e) {
  reportError('Syntax', `server.js compilation error: ${e.message}`);
}

// Simulate browser environment in VM
const mockElem = {
  textContent: '',
  innerHTML: '',
  value: '',
  classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
  style: {},
  addEventListener: () => {},
  setAttribute: () => {},
  getAttribute: () => '',
  querySelectorAll: () => [],
  querySelector: () => null,
  appendChild: () => {},
  focus: () => {}
};

const sandbox = {
  window: { addEventListener: () => {}, location: { hash: '' } },
  document: {
    getElementById: () => mockElem,
    querySelector: () => mockElem,
    querySelectorAll: () => [mockElem],
    addEventListener: () => {},
    body: mockElem,
    documentElement: mockElem,
    createElement: () => mockElem
  },
  navigator: { clipboard: { writeText: () => Promise.resolve() } },
  localStorage: { getItem: () => null, setItem: () => {} },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  console: { log: () => {}, warn: () => {}, error: () => {} }
};
sandbox.window.window = sandbox.window;
sandbox.window.document = sandbox.document;

let pKeys = [];
let cKeys = [];
let lKeys = [];
let codeRepoKeys = [];

try {
  vm.createContext(sandbox);
  vm.runInContext(js, sandbox);
  reportSuccess('Runtime Simulation', 'script.js executes without exceptions in mock DOM environment');

  pKeys = vm.runInContext('Object.keys(typeof projectModalData !== "undefined" ? projectModalData : {})', sandbox);
  cKeys = vm.runInContext('Object.keys(typeof certModalData !== "undefined" ? certModalData : {})', sandbox);
  lKeys = vm.runInContext('Object.keys(typeof legalModalData !== "undefined" ? legalModalData : {})', sandbox);
  codeRepoKeys = vm.runInContext('Object.keys(typeof codeRepository !== "undefined" ? codeRepository : {})', sandbox);
} catch (e) {
  reportError('Runtime Simulation', `script.js failed to execute: ${e.message}`);
}

// 3. HTML Duplicate IDs & Target IDs
console.log('\n--- Checking HTML Elements, IDs & Attributes ---');
const idRegex = /id=["']([^"']+)["']/g;
const idCounts = {};
const allIds = new Set();
let m;
while ((m = idRegex.exec(html)) !== null) {
  const id = m[1];
  idCounts[id] = (idCounts[id] || 0) + 1;
  allIds.add(id);
}

const duplicates = Object.keys(idCounts).filter(id => idCounts[id] > 1);
if (duplicates.length > 0) {
  reportError('HTML IDs', `Duplicate IDs found: ${duplicates.join(', ')}`);
} else {
  reportSuccess('HTML IDs', `All ${allIds.size} element IDs are unique`);
}

// 4. In-page Anchor Links
console.log('\n--- Checking Anchor Navigation (#id) ---');
const hashRegex = /href=["']#([^"']+)["']/g;
const brokenHashes = new Set();
while ((m = hashRegex.exec(html)) !== null) {
  const targetId = m[1];
  if (!allIds.has(targetId)) {
    brokenHashes.add('#' + targetId);
  }
}
if (brokenHashes.size > 0) {
  reportError('Anchor Links', `Broken in-page anchor links: ${[...brokenHashes].join(', ')}`);
} else {
  reportSuccess('Anchor Links', 'All in-page navigation anchors point to existing IDs');
}

// 5. HTML Tag Pairing Symmetry
console.log('\n--- Checking HTML Tag Pairing Symmetry ---');
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const tagStack = [];
const tagRegex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
let tagMismatch = [];

while ((m = tagRegex.exec(html)) !== null) {
  const fullTag = m[0];
  const tagName = m[1].toLowerCase();
  if (voidTags.has(tagName) || fullTag.endsWith('/>')) continue;

  if (fullTag.startsWith('</')) {
    if (tagStack.length === 0) {
      tagMismatch.push(`Unexpected closing tag: ${fullTag}`);
    } else {
      const last = tagStack.pop();
      if (last !== tagName) {
        tagMismatch.push(`Mismatched closing tag: expected </${last}> but got ${fullTag}`);
      }
    }
  } else {
    tagStack.push(tagName);
  }
}

if (tagStack.length > 0 || tagMismatch.length > 0) {
  reportError('HTML Tag Hierarchy', `Tag mismatches: ${tagMismatch.slice(0, 5).join('; ')} (Unclosed: ${tagStack.join(', ')})`);
} else {
  reportSuccess('HTML Tag Hierarchy', 'All opening and closing tags are symmetrical');
}
const assetRegex = /(?:src|href)=["']([^"'#][^"']*)["']/g;
const checkedAssets = new Set();
const missingAssets = [];
while ((m = assetRegex.exec(html)) !== null) {
  let assetPath = m[1];
  if (assetPath.startsWith('http://') || 
      assetPath.startsWith('https://') || 
      assetPath.startsWith('mailto:') || 
      assetPath.startsWith('tel:') || 
      assetPath.startsWith('javascript:')) {
    continue;
  }
  assetPath = assetPath.split('?')[0].split('#')[0];
  if (!assetPath || checkedAssets.has(assetPath)) continue;
  checkedAssets.add(assetPath);

  const fullPath = path.join(__dirname, assetPath);
  if (!fs.existsSync(fullPath)) {
    missingAssets.push(assetPath);
  }
}

if (missingAssets.length > 0) {
  reportError('Asset Files', `Missing referenced files: ${missingAssets.join(', ')}`);
} else {
  reportSuccess('Asset Files', `All ${checkedAssets.size} local assets exist and are reachable`);
}

// 6. CSS Balanced Braces & Rules
console.log('\n--- Checking CSS Rules & Syntax ---');
let openBraces = 0;
let closeBraces = 0;
for (let i = 0; i < css.length; i++) {
  if (css[i] === '{') openBraces++;
  if (css[i] === '}') closeBraces++;
}
if (openBraces !== closeBraces) {
  reportError('CSS Syntax', `Mismatched braces: ${openBraces} '{' vs ${closeBraces} '}'`);
} else {
  reportSuccess('CSS Syntax', `Balanced braces (${openBraces} blocks)`);
}

// 7. Modal Calls vs Defined Keys
console.log('\n--- Checking Modal Key Integrity ---');
const pKeySet = new Set(pKeys);
const cKeySet = new Set(cKeys);
const lKeySet = new Set(lKeys);
const codeSet = new Set(codeRepoKeys);

const pCalls = [...html.matchAll(/openProjectModal\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
const cCalls = [...html.matchAll(/openCertModal\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
const lCalls = [...html.matchAll(/openLegalModal\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
const tabCalls = [...html.matchAll(/switchCodeTab\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
const snippetCalls = [...html.matchAll(/showCodeSnippet\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);

const missingP = pCalls.filter(k => !pKeySet.has(k));
const missingC = cCalls.filter(k => !cKeySet.has(k));
const missingL = lCalls.filter(k => !lKeySet.has(k));
const missingTabs = tabCalls.filter(k => !codeSet.has(k));
const missingSnippets = snippetCalls.filter(k => !codeSet.has(k));

if (missingP.length) reportError('Project Modal', `Missing keys: ${missingP.join(', ')}`);
else reportSuccess('Project Modal', `All ${pCalls.length} calls pass valid keys: [${pCalls.join(', ')}]`);

if (missingC.length) reportError('Cert Modal', `Missing keys: ${missingC.join(', ')}`);
else reportSuccess('Cert Modal', `All ${cCalls.length} calls pass valid keys: [${cCalls.join(', ')}]`);

if (missingL.length) reportError('Legal Modal', `Missing keys: ${missingL.join(', ')}`);
else reportSuccess('Legal Modal', `All ${lCalls.length} calls pass valid keys: [${lCalls.join(', ')}]`);

if (missingTabs.length) reportError('Code Tabs', `Missing tab keys: ${missingTabs.join(', ')}`);
else reportSuccess('Code Tabs', `All ${tabCalls.length} tab switchers pass valid keys: [${tabCalls.join(', ')}]`);

if (missingSnippets.length) reportError('Code Snippets', `Missing snippet keys: ${missingSnippets.join(', ')}`);
else reportSuccess('Code Snippets', `All ${snippetCalls.length} snippet callers pass valid keys`);

// 8. Checking global inline functions
console.log('\n--- Checking Global Inline Function Handlers ---');
const inlineFnRegex = /on[a-z]+=["']([a-zA-Z0-9_]+)\(/g;
const inlineFns = new Set();
while ((m = inlineFnRegex.exec(html)) !== null) {
  inlineFns.add(m[1]);
}

const reservedWords = new Set(['if', 'for', 'while', 'switch', 'return', 'catch', 'function']);
for (const fn of inlineFns) {
  if (reservedWords.has(fn)) continue;
  const isGlobal = vm.runInContext(`typeof ${fn} === "function" || typeof window.${fn} === "function"`, sandbox);
  if (!isGlobal) {
    reportError('Inline Handlers', `Function '${fn}' called in HTML is not defined on window or global scope`);
  } else {
    reportSuccess('Inline Handlers', `Function '${fn}()' is defined and callable`);
  }
}

// 9. Document getElementById in script.js vs HTML
console.log('\n--- Checking DOM Queries in script.js vs HTML ---');
const getByIdRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
const jsQueriedIds = new Set();
while ((m = getByIdRegex.exec(js)) !== null) {
  jsQueriedIds.add(m[1]);
}
const missingDomIds = [...jsQueriedIds].filter(id => !allIds.has(id));
if (missingDomIds.length > 0) {
  reportError('DOM Element IDs', `IDs queried in script.js but missing in HTML: ${missingDomIds.join(', ')}`);
} else {
  reportSuccess('DOM Element IDs', `All ${jsQueriedIds.size} IDs queried in script.js exist in HTML`);
}

// 10. SEO & Structured Data Integrity
console.log('\n--- Checking SEO Meta, OpenGraph & Schema.org Structured Data ---');
if (html.includes('<title>') && html.includes('</title>')) {
  reportSuccess('SEO Title', 'Page title tag exists and is defined');
} else {
  reportError('SEO Title', 'Missing page <title> tag');
}

if (html.includes('name="description"') && html.includes('name="robots"')) {
  reportSuccess('SEO Meta', 'Meta description and robots directives present');
} else {
  reportError('SEO Meta', 'Missing meta description or robots directives');
}

if (html.includes('property="og:title"') && html.includes('property="og:image"') && html.includes('name="twitter:card"')) {
  reportSuccess('Social Cards', 'OpenGraph and Twitter Card metadata present');
} else {
  reportError('Social Cards', 'Missing OpenGraph or Twitter metadata');
}

// Check Schema.org JSON-LD
const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (ldMatch) {
  try {
    const parsedLd = JSON.parse(ldMatch[1]);
    if (parsedLd['@context'] === 'https://schema.org' && Array.isArray(parsedLd['@graph'])) {
      reportSuccess('Schema.org JSON-LD', `Valid JSON-LD schema graph with ${parsedLd['@graph'].length} structured entities`);
    } else {
      reportError('Schema.org JSON-LD', 'Invalid Schema.org graph structure');
    }
  } catch (err) {
    reportError('Schema.org JSON-LD', `JSON-LD parse error: ${err.message}`);
  }
} else {
  reportError('Schema.org JSON-LD', 'Missing Schema.org JSON-LD script block');
}

// Check robots.txt and sitemap.xml
if (fs.existsSync('robots.txt') && fs.existsSync('sitemap.xml')) {
  reportSuccess('Search Crawlers', 'robots.txt and sitemap.xml present and accessible');
} else {
  reportError('Search Crawlers', 'Missing robots.txt or sitemap.xml');
}

// 11. Final Result
console.log(`\n${c.darkSlate}╭──────────────────────────────────────────────────────────────────────────╮${c.reset}`);
console.log(`${c.darkSlate}│${c.reset}  ${c.bold}${c.sky}STATIC ANALYSIS SUMMARY${c.reset}                                                 ${c.darkSlate}│${c.reset}`);
console.log(`${c.darkSlate}├──────────────────────────────────────────────────────────────────────────┤${c.reset}`);
console.log(`${c.darkSlate}│${c.reset}  ${c.bold}Results:${c.reset}     ${c.emerald}${okCount} passed${c.reset}, ${warnCount > 0 ? c.amber + warnCount + ' warnings' + c.reset : c.slate + '0 warnings' + c.reset}, ${errorCount > 0 ? c.rose + errorCount + ' failed' + c.reset : c.slate + '0 failed' + c.reset}                              ${c.darkSlate}│${c.reset}`);
console.log(`${c.darkSlate}├──────────────────────────────────────────────────────────────────────────┤${c.reset}`);
if (errorCount === 0) {
  console.log(`${c.darkSlate}│${c.reset}  ${c.emerald}✔ VERDICT:${c.reset} ${c.white}All JavaScript, HTML, CSS, assets, and modal bindings are healthy!${c.reset} ${c.darkSlate}│${c.reset}`);
  console.log(`${c.darkSlate}╰──────────────────────────────────────────────────────────────────────────╯${c.reset}\n`);
  process.exit(0);
} else {
  console.log(`${c.darkSlate}│${c.reset}  ${c.rose}✖ VERDICT:${c.reset} ${c.rose}Audit failed with ${errorCount} errors. Review issues above.${c.reset}              ${c.darkSlate}│${c.reset}`);
  console.log(`${c.darkSlate}╰──────────────────────────────────────────────────────────────────────────╯${c.reset}\n`);
  process.exit(1);
}
