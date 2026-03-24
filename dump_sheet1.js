const XLSX = require("xlsx");
const fs = require("fs");

const filePath =
  "c:\\Users\\idkth\\Documents\\scion\\assets\\OneDrive_2026-03-19 (2)\\2. Shared with agency folder\\Brands\\MA\\MA Amazon USA Listing.xlsx";

try {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets["Sheet1"];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Log rows for a few products to see all columns
  const selectedRows = data.slice(0, 10);
  fs.writeFileSync(
    "c:\\Users\\idkth\\Documents\\scion\\sheet1_sample.json",
    JSON.stringify(selectedRows, null, 2),
  );
} catch (error) {
  console.error("Error:", error.message);
}
