const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\idkth\\Documents\\scion';
const assetsDir = path.join(baseDir, 'assets');
const oneDriveDir = path.join(assetsDir, 'OneDrive_2026-03-19 (2)', '2. Shared with agency folder');

const placeholderPatterns = [
    /banner[0-9]/i,
    /Picture[0-9]/i,
    /placeholder/i,
    /Our Brands - BG 2/i,
    /Our Brands - CL 1/i,
    /Our Brands - CP 2/i,
    /Our Brands - DC 1/i,
    /Our Brands - JPD Majestic Aura/i,
    /Our Brands - MA Nebula Nectar/i,
    /Our Brands - PC KERETIN 1/i
];

function scanFiles(dir, extensions) {
    let results = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
            results = results.concat(scanFiles(fullPath, extensions));
        } else if (extensions.includes(path.extname(file))) {
            results.push(fullPath);
        }
    }
    return results;
}

function audit() {
    const htmlFiles = scanFiles(baseDir, ['.html', '.css']);
    const auditResults = [];

    for (const file of htmlFiles) {
        const content = fs.readFileSync(file, 'utf8');
        const imgTags = content.match(/<img[^>]+src=["']([^"']+)["']/g) || [];
        const cssBgImgs = content.match(/background-image:\s*url\(["']?([^"'\)]+)["']?\)/g) || [];

        imgTags.forEach(tag => {
            const src = tag.match(/src=["']([^"']+)["']/)[1];
            auditResults.push({ file, type: 'img', src });
        });

        cssBgImgs.forEach(style => {
            const url = style.match(/url\(["']?([^"'\)]+)["']?\)/)[1];
            auditResults.push({ file, type: 'css-bg', src: url });
        });
    }

    const uniqueReferences = [...new Set(auditResults.map(r => r.src))];
    console.log(`Scan complete. Found ${auditResults.length} image references across ${htmlFiles.length} files.`);
    console.log(`Unique image paths: ${uniqueReferences.length}`);

    const findings = auditResults.map(r => {
        const decodedSrc = decodeURIComponent(r.src.split('?')[0]);
        const fullPath = path.join(baseDir, decodedSrc.replace(/\//g, path.sep));
        const exists = fs.existsSync(fullPath);
        const isPlaceholder = placeholderPatterns.some(p => p.test(r.src));
        return { ...r, exists, isPlaceholder, decodedSrc };
    });

    const missing = findings.filter(f => !f.exists);
    const placeholders = findings.filter(f => f.isPlaceholder);

    console.log('\n--- Missing Images ---');
    missing.forEach(m => console.log(`${m.file}: ${m.src}`));

    console.log('\n--- Placeholder Images ---');
    placeholders.forEach(p => console.log(`${p.file}: ${p.src}`));

    fs.writeFileSync(path.join(baseDir, 'full_image_audit.json'), JSON.stringify(findings, null, 2));
}

audit();
