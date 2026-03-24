const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const filePath =
  "c:\\Users\\idkth\\Documents\\scion\\assets\\OneDrive_2026-03-19 (2)\\2. Shared with agency folder\\Brands\\MA\\MA Amazon USA Listing.xlsx";
const outputPath = "c:\\Users\\idkth\\Documents\\scion\\excel_data.json";

try {
  const workbook = XLSX.readFile(filePath);
  const results = {
    sheetNames: workbook.SheetNames,
    sheets: {},
  };

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    results.sheets[sheetName] = XLSX.utils
      .sheet_to_json(worksheet, { header: 1 })
      .slice(0, 20);
  });

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log("Data saved to excel_data.json");
} catch (error) {
  console.error("Error:", error.message);
}
