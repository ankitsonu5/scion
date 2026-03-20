const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/idkth/Documents/scion';
const files = fs.readdirSync(directory).filter(f => f.endsWith('.html') || f.endsWith('.css'));

const externalUrls = new Set();
const imgRegex = /(https?:\/\/[^\s"'()>]+\.(?:jpg|png|webp|jpeg|gif|svg))/gi;

files.forEach(file => {
    const content = fs.readFileSync(path.join(directory, file), 'utf8');
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
        externalUrls.add(match[1]);
    }
});

console.log(JSON.stringify(Array.from(externalUrls), null, 2));
