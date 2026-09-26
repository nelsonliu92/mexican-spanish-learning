const fs = require('fs');
let c = fs.readFileSync('index.html','utf8');

// BUG 1: &#8634; HTML entity in textContent → replace with plain text '↻' or remove the arrow
// textContent sets raw text, not parsed HTML, so &#8634; displays literally
c = c.replace("retryBtn.textContent='再試一次 &#8634;'", "retryBtn.textContent='再試一次 ↻'");

// BUG 2: JSON.stringify(q.audio) produces quoted string that breaks onclick
// e.g. onclick="speak("Hola")" → the inner quotes break the attribute
// Fix: build a properly escaped JS string for the onclick attribute
const oldListen = 'optsHtml=\'<button class="quiz-option" onclick="speak(\'+JSON.stringify(q.audio)+\')" style="background:var(--mx-yellow);border-color:var(--mx-orange);">\'+';
const newListen = 'var audioText=q.audio.replace(/\\\\\'/g,"\\\\\\\\'").replace(/"/g,"\\\\\\\"");optsHtml=\'<button class="quiz-option" onclick="speak(\\\''+audioText+'\\\')" style="background:var(--mx-yellow);border-color:var(--mx-orange);">\'+"'"+'+';

// Actually, a simpler approach: store audio in data attribute, call speak on click via non-inline JS
const simplerFix = 'optsHtml=\'<button class="quiz-option" data-audio="\'+esc(q.audio)+\'" style="background:var(--mx-yellow);border-color:var(--mx-orange);">\'+';

c = c.replace(oldListen, simplerFix);

fs.writeFileSync('index.html', c, 'utf8');

const check = fs.readFileSync('index.html','utf8');
console.log('Has 再試一次 ↻:', check.includes('再試一次 ↻'));
console.log('No &#8634;:', !check.includes('&#8634;'));
console.log('data-audio exists:', check.includes('data-audio'));
console.log('No JSON.stringify(audio):', !check.includes('JSON.stringify(q.audio)'));
