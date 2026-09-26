const fs = require('fs');
let c = fs.readFileSync('index.html','utf8');

// ===== BUG 1: Fix retry button HTML entity in ansFill() =====
// textContent doesn't parse HTML entities - use actual Unicode
// &#8634; (↻) might not render on some devices → replace with ⤾ 
c = c.replace("retryBtn.textContent='再試一次 &#8634;'", "retryBtn.textContent='再試一次 ⤾'");

// Also check if ans() has the same issue
c = c.replace(/retryBtn\.textContent='再試一次 &#8634;'/g, "retryBtn.textContent='再試一次 ⤾'");

// ===== BUG 2: Fix speak(audio) URL for listen questions =====
// JSON.stringify(q.audio) produces double quotes that break onclick HTML
// Replace with proper escape: speak('text') using the audio string escaped for JS string
const oldPattern = 'optsHtml=\'<button class="quiz-option" onclick="speak(\'+JSON.stringify(q.audio)+\')"';
const newPattern = 'var audioText=q.audio.replace(/\\\'/g,"\\\\'");optsHtml=\'<button class="quiz-option" onclick="speak(\\\''+audioText+'\\\')';

// Actually let's find and replace more carefully
const listenHtmlOld = `optsHtml='<button class="quiz-option" onclick="speak('+JSON.stringify(q.audio)+')" style="background:var(--mx-yellow);border-color:var(--mx-orange);">
      '<span class="opt-letter">&#128266;</span><span>播放句子 &#128266;</span>'+
    '</button>';`;

const listenHtmlNew = `var audioText=q.audio.replace(/\\'/g,"\\\\'");optsHtml='<button class="quiz-option" onclick="speak(\\''+audioText+'\\')" style="background:var(--mx-yellow);border-color:var(--mx-orange);">'+      '<span class="opt-letter">&#128266;</span><span>播放句子 &#128266;</span>'+    '</button>';`;

c = c.replace(listenHtmlOld, listenHtmlNew);

fs.writeFileSync('index.html', c, 'utf8');

// Verify
const check = fs.readFileSync('index.html','utf8');
console.log('=== Fixes applied ===');
console.log('Retry button entity fixed:', check.includes("'再試一次 ⤾'") || check.includes("'再試一次 ↻'"));
console.log('No &#8634; in textContent:', !check.includes("textContent='再試一次 &#8634;"));
console.log('audioText var exists:', check.includes('var audioText=q.audio'));
console.log('No JSON.stringify audio:', !check.includes('JSON.stringify(q.audio)'));
