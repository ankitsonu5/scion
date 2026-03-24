const fs = require("fs");
const path = require("path");

const root = __dirname;
const patterns = ["product-cl-", "product-detail-"];

function stripTags(value) {
  return value
    .replace(/<a\b[^>]*>[\s\S]*?<\/a>/gis, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMetaRows(html) {
  const match = html.match(
    /<div class="pdp-meta-amazon">[\s\S]*?<table>([\s\S]*?)<\/table>[\s\S]*?<\/div>/i,
  );
  if (!match) return [];
  const rows = [];
  const rowRegex =
    /<tr>\s*<td class="label">([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/gi;
  let rowMatch;
  while ((rowMatch = rowRegex.exec(match[1])) !== null) {
    rows.push({
      label: stripTags(rowMatch[1]),
      value: stripTags(rowMatch[2]),
    });
  }
  return rows;
}

function extractAboutLines(html) {
  const aboutMatch = html.match(
    /<div class="about-content-text">([\s\S]*?)<\/div>/i,
  );
  if (!aboutMatch) return [];
  const paragraphMatches = [...aboutMatch[1].matchAll(/<p>([\s\S]*?)<\/p>/gi)];
  if (paragraphMatches.length) {
    return paragraphMatches.map((m) => stripTags(m[1])).filter(Boolean);
  }
  const plain = stripTags(aboutMatch[1]);
  return plain ? [plain] : [];
}

function buildCards(rows) {
  return rows
    .map(
      ({ label, value }) => `                    <div class="pdp-info-card">
                        <span class="info-label">${label}</span>
                        <span class="info-value">${value}</span>
                    </div>`,
    )
    .join("\n");
}

function buildAbout(lines) {
  const items = lines
    .map((line) => `                            <li>${line}</li>`)
    .join("\n");
  return `<div class="pdp-about-bullets">
                        <h3>About this item</h3>
                        <ul>
${items}
                        </ul>
                    </div>`;
}

function buildInfoTab(description, rows) {
  return `<div class="tab-content" id="info" style="display: block;">
                <div class="pdp-info-rich">
                    <p class="pdp-info-description">${description}</p>
                    <div>
                        <h4 class="pdp-info-section-title">Product Details</h4>
                        <div class="pdp-info-grid">
${buildCards(rows)}
                        </div>
                    </div>
                </div>
            </div>`;
}

function normalizeBuyBox(html, isCl) {
  if (isCl) {
    const amazonHrefMatch = html.match(
      /<a href="([^"]+)" target="_blank" class="pdp-amazon-btn">/i,
    );
    const amazonHref = amazonHrefMatch ? amazonHrefMatch[1] : "";
    return html.replace(
      /<div class="hybrid-buy-box">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/i,
      `<div class="hybrid-buy-box">
                        <div class="buy-box-price">
                            <span class="currency">Enquire for Price</span>
                        </div>

                        <div class="buy-box-actions">
                            ${
                              amazonHref
                                ? `<a href="${amazonHref}" target="_blank" class="pdp-amazon-btn">
                                <span class="market-copy">
                                    <strong>View on Amazon</strong>
                                    <span>Online availability</span>
                                </span>
                            </a>`
                                : ""
                            }
                            <a href="contact-us.html" class="pdp-amazon-btn">
                                <span class="market-copy">
                                    <strong>Contact Us</strong>
                                    <span>Request more product details</span>
                                </span>
                            </a>
                        </div>
                    </div>

                    
                    {{ABOUT_BLOCK}}
                    
                    <div class="pdp-divider"></div>

                    <div class="pdp-share-amazon" style="display: flex; gap: 15px; font-size: 1.2rem; color: #666;">
                        <span>Share:</span>
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-pinterest-p"></i></a>
                        <a href="#"><i class="far fa-envelope"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </section>`,
    );
  }

  return html.replace(
    /<div class="hybrid-buy-box">[\s\S]*?<div class="pdp-about-bullets">[\s\S]*?<div class="pdp-share-amazon" style="display: flex; gap: 15px; font-size: 1.2rem; color: #666;">/i,
    `<div class="hybrid-buy-box">
                        <div class="buy-box-price">
                            <span class="currency">Enquire for Price</span>
                        </div>

                        <div class="buy-box-actions">
                            <a href="contact-us.html" class="pdp-amazon-btn">
                                <span class="market-copy">
                                    <strong>Request Details</strong>
                                    <span>Connect with our team</span>
                                </span>
                            </a>
                        </div>
                    </div>

                    
                    {{ABOUT_BLOCK}}

                    <div class="pdp-divider"></div>

                    <div class="pdp-share-amazon" style="display: flex; gap: 15px; font-size: 1.2rem; color: #666;">`,
  );
}

function normalizeTabs(html, rows) {
  html = html.replace(
    /<button class="tab-btn active" onclick="openTab\(event, 'ingredients'\)">Information<\/button>/i,
    `<button class="tab-btn active" onclick="openTab(event, 'info')">Information</button>`,
  );
  html = html.replace(
    /\s*<button class="tab-btn" onclick="openTab\(event, 'shipping'\)">Shipping & Returns<\/button>/gi,
    "",
  );
  html = html.replace(
    /\s*<div class="tab-content" id="shipping"[\s\S]*?<\/div>\s*(?=<\/div>\s*<\/section>)/i,
    "\n",
  );

  const infoMatch = html.match(
    /<div class="tab-content" id="(?:info|ingredients)" style="display: block;">([\s\S]*?)<\/div>\s*(?=<div class="tab-content"|<\/div>\s*<\/section>)/i,
  );
  const description = infoMatch ? stripTags(infoMatch[1]) : "";
  const replacement = buildInfoTab(description, rows);
  html = html.replace(
    /<div class="tab-content" id="(?:info|ingredients)" style="display: block;">[\s\S]*?<\/div>\s*(?=<div class="tab-content"|<\/div>\s*<\/section>)/i,
    `${replacement}\n\n            `,
  );
  return html;
}

function processFile(filePath) {
  let html = fs.readFileSync(filePath, "utf8");
  const rows = extractMetaRows(html);
  if (!rows.length) return false;

  const aboutLines = extractAboutLines(html);
  const aboutBlock = buildAbout(
    aboutLines.length
      ? aboutLines
      : ["Product information available on request."],
  );

  const isCl = path.basename(filePath).startsWith("product-cl-");
  html = normalizeBuyBox(html, isCl).replace("{{ABOUT_BLOCK}}", aboutBlock);
  html = normalizeTabs(html, rows);

  fs.writeFileSync(filePath, html);
  return true;
}

const files = fs
  .readdirSync(root)
  .filter(
    (name) =>
      name.endsWith(".html") &&
      patterns.some((pattern) => name.startsWith(pattern)),
  );

let updated = 0;
for (const file of files) {
  if (processFile(path.join(root, file))) {
    updated += 1;
  }
}

console.log(`Normalized ${updated} legacy PDP files.`);
