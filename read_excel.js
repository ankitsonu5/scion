const XLSX = require("xlsx");
const path = require("path");

const filePath =
  "c:\\Users\\idkth\\Documents\\scion\\assets\\OneDrive_2026-03-19 (2)\\2. Shared with agency folder\\Brands\\MA\\MA Amazon USA Listing.xlsx";

try {
  const workbook = XLSX.readFile(filePath);
  console.log("Sheet Names:", workbook.SheetNames);

  workbook.SheetNames.forEach((sheetName) => {
    console.log(`\n--- Sheet: ${sheetName} ---`);
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log(JSON.stringify(data.slice(0, 5), null, 2));
  });
} catch (error) {
  console.error("Error reading file:", error.message);
}
