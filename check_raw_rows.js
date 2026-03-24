const xlsx = require("xlsx");
const excelPath =
  "C:\\Users\\idkth\\Documents\\scion\\assets\\2. Shared with agency folder\\Brands\\MA\\MA Amazon USA Listing.xlsx";
const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rawDataRows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

console.log(JSON.stringify(rawDataRows.slice(0, 2), null, 2));
