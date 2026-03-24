const xlsx = require("xlsx");
const fs = require("fs");
const excelPath =
  "C:\\Users\\idkth\\Documents\\scion\\assets\\2. Shared with agency folder\\Brands\\MA\\MA Amazon USA Listing.xlsx";
const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rawDataRows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

if (rawDataRows.length > 1) {
  const row = rawDataRows[1];
  let output = "";
  row.forEach((cell, idx) => {
    output += `${idx}: [${cell}]\n`;
  });
  fs.writeFileSync("C:\\Users\\idkth\\Documents\\scion\\row1_dump.txt", output);
}
