const fs = require("fs");
const audit = JSON.parse(fs.readFileSync("full_image_audit.json", "utf8"));
const missing = audit.filter((a) => !a.exists);
console.log(JSON.stringify(missing, null, 2));
