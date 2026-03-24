const fs = require("fs");
const products = JSON.parse(fs.readFileSync("cl_products_temp.json", "utf8"));
let html = "";
products.forEach((p) => {
  const name = p["20 ML"];
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  html += `
                <!-- ${name} -->
                <div class="product-card-luxury" data-brand="creation-lamis">
                    <div class="product-img-wrap-luxury">
                        <img src="assets/prod-cl-${slug}-1.jpg" alt="${name}" class="product-img-luxury" onerror="this.src='assets/prod-cl-${slug}-1.png'">
                        <div class="product-badge-luxury">New</div>
                    </div>
                    <div class="product-info-luxury">
                        <span class="product-cat-luxury">Creation Lamis</span>
                        <h3 class="product-title-luxury">${name}</h3>
                        <div class="product-actions-luxury">
                            <a href="product-cl-${slug}.html" class="add-btn-luxury">View Details</a>
                        </div>
                    </div>
                </div>`;
});
fs.writeFileSync("cl_products_html.txt", html);
