const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync('cl_products_temp.json', 'utf8'));
const templatePath = 'product-ma-eternal-oud.html';
const template = fs.readFileSync(templatePath, 'utf8');

const sourceRoot = 'c:/Users/idkth/Documents/scion/assets/OneDrive_2026-03-19 (2)/2. Shared with agency folder/Brands/CL';
const destRoot = 'c:/Users/idkth/Documents/scion/assets';

const mapping = {
    "Cuir Ultime": "CL Prive'/CL_Prive_Cuir Ultime",
    "Amber Imperial": "CL Prive'/CL_Prive_Amber Imperial",
    "Oud Magique": "CL Prive'/CL_Prive_Oud Magique",
    "Tabac Aromatique": "CL Prive'/CL_Prive_Tobac Aromatique",
    "Rose Augusta": "CL Prive'/CL_Prive_Rose Augusta",
    "Sandal Intense": "CL Prive'/CL_Prive_Sandal Intense",
    "Jasmine Joy": "CL Prive'/CL_Prive_Jasmine Joy",
    "Vanille Divine": "CL Prive'/CL_Prive_Vanilla Divin",
    "Atar Al Afraah": "CL Oriental/CL__Attar Al Afraah",
    "Jawharat Al Afrah": "CL Oriental/CL__Jawharat Al Afrah",
    "Alhob Quloh": "CL Oriental/CL_Orientals_Alhob Quloh",
    "Oud Al Mlouk": "CL Oriental/CL_Orientals_Oud Al Mlouk"
};

products.forEach(product => {
    const name = product["20 ML"];
    const folderPath = mapping[name];
    if (!folderPath) {
        console.log(`No mapping found for ${name}`);
        return;
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const fullSourcePath = path.join(sourceRoot, folderPath);
    
    // Copy images
    if (fs.existsSync(fullSourcePath)) {
        const files = fs.readdirSync(fullSourcePath);
        files.forEach((file, index) => {
            if (index < 7 && (file.endsWith('.jpg') || file.endsWith('.png'))) {
                const ext = path.extname(file);
                fs.copyFileSync(path.join(fullSourcePath, file), path.join(destRoot, `prod-cl-${slug}-${index + 1}${ext}`));
            }
        });
    } else {
        console.log(`Folder not found: ${fullSourcePath}`);
    }

    // Generate HTML
    let content = template;
    content = content.replace(/Eternal Oud/g, name);
    content = content.replace(/Maison de l'Avenir/g, 'Creation Lamis');
    content = content.replace(/assets\/prod-ma-eternal-oud-/g, `assets/prod-cl-${slug}-`);
    content = content.replace(/assets\/prod-ma-/g, `assets/prod-ma-`); // Keep related products
    
    // Update breadcrumb
    content = content.replace(/<a href="products-luxury.html">Maison de l'Avenir<\/a>/g, `<a href="products-luxury.html">Creation Lamis</a>`);
    
    fs.writeFileSync(`product-cl-${slug}.html`, content);
    console.log(`Generated product-cl-${slug}.html`);
});
