const fs = require('fs');
const path = require('path');

const root = __dirname;
const files = fs.readdirSync(root).filter((file) => /^product-.*\.html$/.test(file));

for (const file of files) {
    const filePath = path.join(root, file);
    const original = fs.readFileSync(filePath, 'utf8');
    let html = original;

    html = html.replace(
        /<div class="tabs-header">\s*<button class="tab-btn active" onclick="openTab\(event, 'notes'\)">Fragrance Notes<\/button>\s*<button class="tab-btn" onclick="openTab\(event, 'info'\)">Information<\/button>/g,
        `<div class="tabs-header">\r\n                <button class="tab-btn active" onclick="openTab(event, 'info')">Information</button>\r\n                <button class="tab-btn" onclick="openTab(event, 'notes')">Fragrance Notes</button>`
    );

    html = html.replace(
        /<div class="tab-content" id="notes" style="display: block;">/g,
        `<div class="tab-content" id="notes" style="display: none;">`
    );

    html = html.replace(
        /<div class="tab-content" id="info" style="display: none;">/g,
        `<div class="tab-content" id="info" style="display: block;">`
    );

    html = html.replace(
        /<div class="tabs-header">\s*<button class="tab-btn active" onclick="openTab\(event, 'notes'\)">Fragrance Notes<\/button>\s*<button class="tab-btn" onclick="openTab\(event, 'ingredients'\)">(Ingredients|Description)<\/button>\s*<button class="tab-btn" onclick="openTab\(event, 'shipping'\)">Shipping & Returns<\/button>/g,
        `<div class="tabs-header">\r\n                <button class="tab-btn active" onclick="openTab(event, 'ingredients')">Information</button>\r\n                <button class="tab-btn" onclick="openTab(event, 'notes')">Fragrance Notes</button>\r\n                <button class="tab-btn" onclick="openTab(event, 'shipping')">Shipping & Returns</button>`
    );

    html = html.replace(
        /<button class="tab-btn active" onclick="openTab\(event, 'notes'\)">Product Details<\/button>/g,
        `<button class="tab-btn active" onclick="openTab(event, 'ingredients')">Information</button>`
    );

    html = html.replace(
        /<button class="tab-btn active" onclick="openTab\(event, 'details'\)">Product Details<\/button>/g,
        `<button class="tab-btn active" onclick="openTab(event, 'details')">Information</button>`
    );

    html = html.replace(
        /<button class="tab-btn active" onclick="openTab\(event, 'contents'\)">Set Contents<\/button>/g,
        `<button class="tab-btn active" onclick="openTab(event, 'contents')">Information</button>`
    );

    html = html.replace(
        /<button class="tab-btn" onclick="openTab\(event, 'notes'\)">Fragrance Notes<\/button>/g,
        `<button class="tab-btn" onclick="openTab(event, 'notes')">Scent Notes</button>`
    );

    html = html.replace(
        /<button class="tab-btn active" onclick="openTab\(event, 'notes'\)">Fragrance Notes<\/button>/g,
        `<button class="tab-btn active" onclick="openTab(event, 'notes')">Scent Notes</button>`
    );

    html = html.replace(
        /<div class="tab-content" id="ingredients" style="display: none;">/g,
        `<div class="tab-content" id="ingredients" style="display: block;">`
    );

    html = html.replace(
        /<div class="tab-content" id="details" style="display: block;">/g,
        `<div class="tab-content" id="details" style="display: block;">`
    );

    html = html.replace(
        /<div class="tab-content" id="contents" style="display: block;">/g,
        `<div class="tab-content" id="contents" style="display: block;">`
    );

    if (html !== original) {
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`Updated ${file}`);
    }
}
