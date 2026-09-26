const fs = require('fs');
let c = fs.readFileSync('index.html','utf8');

// Listen question: break the long line into two - first build audioStr, then use it
const listenOld = '    optsHtml=\'<button class="quiz-option" onclick="speak(\'+JSON.stringify(q.audio)+\')" style="background:var(--mx-yellow);border-color:var(--mx-orange);">\'+';

const listenNew = "    var audioStr=q.audio.replace(/\\'/g,\\\\'\\\\');optsHtml='<button class=\"quiz-option\" onclick=\"speak(\\''+audioStr+'\\')\" style=\"background:var(--mx-yellow);border-color:var(--mx-orange);\">';";
// Hmm this is getting complex with escaping. Let me write a simpler approach:

// First find the exact text
const listenPattern = "optsHtml='<button class=\"quiz-option\" onclick=\"speak('+JSON.stringify(q.audio)+')\"";

// Replace with a version that uses a data attribute instead
const safeVersion = "optsHtml='<button class=\"quiz-option\" data-audio=\"'+esc(q.audio)+'\"";

// But then we need to add a click handler differently... actually let's just store the audio in a data attribute and handle the click
// Actually the simplest fix: use encodeURIComponent and decode on click, or use simple string manipulation

// Approach: set audio text in a clean way
const oldCode = "    optsHtml='<button class=\"quiz-option\" onclick=\"speak('+JSON.stringify(q.audio)+')\" style=\"background:var(--mx-yellow);border-color:var(--mx-orange);\">'+";

const newCode = "    var _a=q.audio.replace(/'/g,'\\\\\\'');optsHtml='<button class=\"quiz-option\" onclick=\"speak(\\''+_a+'\\')\" style=\"background:var(--mx-yellow);border-color:var(--mx-orange);\">';";

// Actually let's use a completely different approach - attach click handler after rendering
const afterRender = "  document.getElementById('quiz-options').innerHTML=optsHtml;";
const afterRenderNew = "  document.getElementById('quiz-options').innerHTML=optsHtml;\n  if(qType==='listen'){var listenBtn=document.querySelector('[data-listen]');if(listenBtn)listenBtn.onclick=function(){speak(q.audio);};}";

const cleanOld = "    optsHtml='<button class=\"quiz-option\" onclick=\"speak('+JSON.stringify(q.audio)+')\" style=\"background:var(--mx-yellow);border-color:var(--mx-orange);\">'+";
const cleanNew = "    optsHtml='<button class=\"quiz-option\" data-listen=\"1\" style=\"background:var(--mx-yellow);border-color:var(--mx-orange);\">'+";

c = c.replace(cleanOld, cleanNew);

// Also add click handler after HTML is inserted
// Find: "  document.getElementById('quiz-options').innerHTML=optsHtml;"
// Add after it: attach listen button handler
const optsSetLine = "  document.getElementById('quiz-options').innerHTML=optsHtml;";
const optsSetLineNew = optsSetLine + "\n  if(qType==='listen'){var lb=document.querySelector('[data-listen]');if(lb)lb.onclick=function(){speak(q.audio);};}";

c = c.replace(optsSetLine, optsSetLineNew);

fs.writeFileSync('index.html', c, 'utf8');
console.log('Fixed! Listen button now uses data-listen + onclick via JS');
