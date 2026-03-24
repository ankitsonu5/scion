const XLSX = require("xlsx");

const filePath =
  "c:\\Users\\idkth\\Documents\\scion\\assets\\OneDrive_2026-03-19 (2)\\2. Shared with agency folder\\Brands\\MA\\MA Amazon USA Listing.xlsx";

try {
  const workbook = XLSX.readFile(filePath);
  let found = false;
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    data.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (
          cell &&
          typeof cell === "string" &&
          cell.toLowerCase().includes("amazon.ae")
        ) {
          console.log(
            `Found in Sheet: ${sheetName}, Row: ${rowIndex + 1}, Col: ${cellIndex}, Value: ${cell}`,
          );
          found = true;
        }
      });
    });
  });
  if (!found) console.log("No amazon.ae found in the workbook.");
} catch (error) {
  console.error("Error:", error.message);
}
