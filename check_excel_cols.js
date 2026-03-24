const xlsx = require("xlsx");
const excelPath =
  "C:\\Users\\idkth\\Documents\\scion\\assets\\2. Shared with agency folder\\Brands\\MA\\MA Amazon USA Listing.xlsx";
const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rawData = xlsx.utils.sheet_to_json(sheet);

if (rawData.length > 0) {
  console.log("Columns:", Object.keys(rawData[0]));
  console.log("First row sample:", rawData[0]);
} else {
  console.log("Sheet is empty.");
}
