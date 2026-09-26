const fs = require('fs');
let c = fs.readFileSync('index.html','utf8');

// Fix speak() for listen questions: replace JSON.stringify with quote-safe approach
const oldLine = "    optsHtml='<button class=\"quiz-option\" onclick=\"speak('+JSON.stringify(q.audio)+')\" style=\"background:var(--mx-yellow);border-color:var(--mx-orange);\">'+";

// Use a separate variable to build the JS call string
const newLine = "    var audioStr=q.audio.replace(/'/g,\\"\\\\'\\");optsHtml='<button class=\"quiz-option\" onclick=\"speak(\\''+audioStr+'\\')\" style=\"background:var(--mx-yellow);border-color:var(--mx-orange);\">'+";

c = c.replace(oldLine, newLine);

fs.writeFileSync('index.html', c, 'utf8');
console.log('Fixed speak() for listen questions');
