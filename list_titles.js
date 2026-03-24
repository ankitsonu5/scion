const xlsx = require("xlsx");
const excelPath =
  "C:\\Users\\idkth\\Documents\\scion\\assets\\2. Shared with agency folder\\Brands\\MA\\MA Amazon USA Listing.xlsx";
const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rawData = xlsx.utils.sheet_to_json(sheet);

console.log(rawData.map((row) => row["Amazon Product Title"]).filter(Boolean));
