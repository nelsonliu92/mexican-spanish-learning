const fs = require('fs');
let c = fs.readFileSync('index.html','utf8');

// ===== BUG 1: textContent doesn't parse HTML entities =====
// Replace all &#8634; textContent assignments with plain Unicode ↻
const before1 = c.match(/textContent='再試一次 &#8634;'/g);
c = c.replace(/textContent='再試一次 &#8634;'/g, "textContent='再試一次 \u219b'");
console.log('Fixed retry buttons:', before1 ? before1.length : 0);

// ===== BUG 2: JSON.stringify in inline onclick breaks HTML =====
// Find: onclick="speak("Hola, ...")"  - inner quotes break the attribute
// Replace with: onclick="speak('Hola, ...')" where single quote is escaped
// First, find the exact pattern
const idx = c.indexOf('JSON.stringify(q.audio)');
if (idx > -1) {
  // Find surrounding context
  const start = c.lastIndexOf('optsHtml=', idx);
  const end = c.indexOf('>', idx) + 1;
  const oldCode = c.substring(start, end);
  
  // Build replacement:
  // Use JSON.stringify to get a JS-safe string, then swap double to single quotes
  const newCode = "var aud=JSON.stringify(q.audio);aud=aud.slice(1,-1);aud=aud.replace(/'/g,\\"\\\\'\\");optsHtml='<button class=\\"quiz-option\\" onclick=\\"speak(\\''+aud+'\\')\\" style=\\"background:var(--mx-yellow);border-color:var(--mx-orange);\\">'";
  
  c = c.replace(oldCode, newCode);
  console.log('Fixed listen question speak()');
} else {
  console.log('No JSON.stringify(q.audio) found');
}

fs.writeFileSync('index.html', c, 'utf8');

// Verify
const check = fs.readFileSync('index.html','utf8');
console.log('\\nVerification:');
console.log('No &#8634; in textContent:', !check.includes('&#8634;'));
console.log('Has 再試一次:', check.includes('再試一次'));
console.log('No JSON.stringify(q.audio):', !check.includes('JSON.stringify(q.audio)'));
console.log('Has var aud:', check.includes('var aud'));
