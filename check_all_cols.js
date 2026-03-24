const XLSX = require("xlsx");

const filePath =
  "c:\\Users\\idkth\\Documents\\scion\\assets\\OneDrive_2026-03-19 (2)\\2. Shared with agency folder\\Brands\\MA\\MA Amazon USA Listing.xlsx";

try {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets["Sheet1"];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Check all columns for Row 2 (Eternal Oud)
  const row2 = data[1];
  row2.forEach((cell, index) => {
    console.log(`${index}: ${cell}`);
  });
} catch (error) {
  console.error("Error:", error.message);
}
