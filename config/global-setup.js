const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// ✅ Use __dirname to make the path absolute and safe
const excelFilePath = path.join(__dirname, '../ExcelFiles/PatientDomain.xlsx');

module.exports = async () => {
  // ✅ Use the safe path here
  const workbook = XLSX.readFile(excelFilePath);
  const jsonData = {};

  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    jsonData[sheetName] = XLSX.utils.sheet_to_json(worksheet);
  });

  const outputDir = path.join(__dirname, '../TestDataWithJSON/PatientDomain');
  const outputFilePath = path.join(outputDir, 'PatientDetails.json');

  // ✅ Ensure the output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  // ✅ Now safely write the file
  fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2));
  console.log('Excel data has been converted and saved to PatientDetails.json');
};
