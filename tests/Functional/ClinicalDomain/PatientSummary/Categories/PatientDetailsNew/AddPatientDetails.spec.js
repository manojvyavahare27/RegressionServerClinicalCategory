//Saurabh
const fs = require("fs");
const XLSX = require("xlsx");
const path = "C:/Riomed/Cellma4Automation";
const mysql = require("mysql2");
const convertExcelToJson = require("../../../../../../config/global-setupOptimized");

const { test, expect } = require("@playwright/test");
const connectToDatabase = require("../../../../../../manoj").default;
const { executeQuery } = require("../../../../../../databaseWriteFile"); // Update the path accordingly
import compareJsons from "../../../../../../compareFileOrJson";

import logger from "../../../../../../Pages/BaseClasses/logger";
import LoginPage from "../../../../../../Pages/BaseClasses/LoginPage";
import Homepage from "../../../../../../Pages/BaseClasses/Homepage";
import ConfirmExisting from "../../../../../../Pages/PatientDomain/ConfirmExisting";
//import ContactHistory from "../../../../../../Pages/PatientDomain/ContactHistory";
import PatientSearch from "../../../../../../Pages/PatientDomain/PatientSearch";
import Environment from "../../../../../../Pages/BaseClasses/Environment";
import Menu from "../../../../../../Pages/BaseClasses/Menu";
import PatientDetailsHomePage from "../../../../../../Pages/ClinicalDomain/PatientSummary/Categories/PatientDetails/PatientDetailsHomePage";
import PatientDetailsAddED from "../../../../../../Pages/ClinicalDomain/PatientSummary/Categories/PatientDetails/PatientDetailsAddEd";
//import RecommendationHomePage from "../../../../../../Pages/ClinicalDomain/PatientSummary/Categories/Recommendations/RecommendationsHomepage";
//import RecommendationED from "../../../../../../Pages/ClinicalDomain/PatientSummary/Categories/Recommendations/RecommendationAddED";
import PatientSummary from "../../../../../../Pages/ClinicalDomain/PatientSummary/PatientSummary";
import ClinicalSummary from "../../../../../../Pages/ClinicalDomain/PatientSummary/ClinicalSummary";

import { TIMEOUT } from "dns";
import { error } from "console";
import { before } from "node:test";

// Array to store console logs

const consoleLogs = [];
let jsonData;


test.describe("Excel Conversion Patient Details Category", () => {
  test("Extract Patient Summary Details", async ({}) => {
    const excelFilePath =
      process.env.EXCEL_FILE_PATH || "./ExcelFiles/PatientSummary.xlsx";
    const jsonFilePath = "./TestDataWithJSON/PatientDomain/PatientSummary.json";

    console.log("excelFilePath:", excelFilePath);
    console.log("jsonFilePath:", jsonFilePath);
    const conversionSuccess = await convertExcelToJson(
      excelFilePath,
      jsonFilePath
    );
    if (conversionSuccess) {
      // jsonData = require("../../../TestDataWithJSON/PatientDomain/PatientDetails.json");
      jsonData = require("../../../../../../TestDataWithJSON/PatientDomain/PatientSummary.json");
      console.log("Excel file has been converted successfully!");
      console.log("jsonData:", jsonData); // Log the loaded JSON data
      console.log("excelFilePath after conversion:", excelFilePath);
      console.log("jsonFilePath after conversion:", jsonFilePath);
    } else {
      throw new Error("Excel to JSON conversion failed.");
    }
  });
});
  test.describe("Patient Details Category", () => {
    test("Add Patient Details", async ({ page }) =>{ 
      if (!jsonData || !jsonData.PatientDetails) {
        throw new Error("JSON data is missing or invalid.");
      }
      let index = 0;
      for (const data of jsonData.PatientDetails) {
  
        const loginpage = new LoginPage(page);
        const homepage = new Homepage(page);
        const environment = new Environment(page);
        const confirmexisting = new ConfirmExisting(page);
        //const contacthistory = new ContactHistory(page);
        const patientsearch = new PatientSearch(page);
        const patientDetailshome = new PatientDetailsHomePage(page);
        const patientDetailsED = new PatientDetailsAddED(page);
        // const recommendationhome = new RecommendationHomePage(page);
        // const recommendationEd = new RecommendationED(page);
        const patientsummary = new PatientSummary(page);
        const patientDetails = new ClinicalSummary(page);
        const menu = new Menu(page);
        await page.goto(environment.Test);
      await loginpage.enterUsername(jsonData.loginDetails[0].username);
      logger.info("Username enter successfully");
      await loginpage.enter_Password(jsonData.loginDetails[0].password);
      logger.info("Password enter successfully");
      await loginpage.clickOnLogin();      
      logger.info("Clicked on Login button successfully");
      await homepage.redirectsToHomePage();
      logger.info("Redirected To Home Page Successfully")
      await homepage.clickOnPatientIcon();
      logger.info("Clicked on Patient Icon successfully");
      await patientsearch.clickOnSearchButton();
      logger.info("Clicked on Search button successfully");
      await patientsearch.enterGivenName(data.pat_firstname);
      logger.info("Given Name entered successfully");
      
      await patientsearch.enterFamilyName(data.pat_surname);
      logger.info("Family Name entered successfully");
      //await patientsearch.selectSex(data.pat_sex);

      await patientsearch.selectBornDate(data.pat_dob.toString());
      //await page.pause()
      //await patientsearch.selectBornDate(formattedDate);
      await patientsearch.clickOnSearchButton();
      await patientsearch.clickOnSearchPatientLink();
      await page.waitForTimeout(1000);
      await confirmexisting.clickOnConfirmExistingDetails();
      //await contacthistory.clickOnMenuIcon();
      await page.waitForTimeout(2000);
      await patientDetails.clickOnSavePopup() 
     
      await patientDetailshome.addContact();
      await patientDetailshome.clickOnAddContact()

       //Add Patient Details
     //await patientsummary.clickOniconPatientDetailsCategory();
     //const addedLifestylelocator = page.getByRole("heading", {name: "Smoking Status"});      
     //await page.waitForTimeout(2000)

      //Contact History page


                  //////Fetch Patient Details/////////
      var sqlQuery =
      "select * from patient_audit where paa_use_username='" + jsonData.loginDetails[0].username + 
      "' and paa_type='selected' order by 1 desc limit 1";
      var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
      var results = await executeQuery(sqlQuery, sqlFilePath);
      console.log("\n Patient Details stored into the database: \n", results);
      const patId = results[0].paa_pat_id;

      console.log("Patient Accessed by User:" + patId);

       //////////REVIEW EXISTING ITEM AND DELETE/////

     await patientsummary.clickOniconPatientDetailsCategory();
     const addedPatientDetailsocator = page.getByRole("heading", {name: "Lives on boat"});      
     await page.waitForTimeout(2000)
     if (await addedPatientDetailsocator.isVisible()) {
      await page.waitForTimeout(2000)
      //await Rectoplastylocator.click();
      //await page.waitForTimeout(500)
      await patientDetailshome.clickonEditPatientDetailsIcon();
      await patientDetailsED.clickOnDeleteButton()
      await patientDetailsED.clickOnOkDeletePatientDetails()
      await patientDetailsED.enterDeletePatientDetailsReason("Not required.")
      await page.waitForTimeout(500)
      await patientDetailsED.clickOnSaveForReason();
    } 
    else {
      await patientsummary.clickOniconPatientDetailsCategory();
    }

     
      //Add Patient Details
      await patientsummary.clickOniconPatientDetailsCategory();
      await page.waitForTimeout(1000);
      await page.pause()
      await patientDetailshome.searchPatientDetails(jsonData.AddPatientDetails[index].pacr_que_name);
      //await page.pause()
      await patientDetailshome.clickonAddPatientDetailsButton();
      //await patientDetailsED.clickOnExpandPatientDetails();
      //await examinationEd.selectSubCategory(jsonData.AddExamination[index].pacr_category)
      await page.getByLabel('cancelIcon').click();
      await patientDetailshome.searchPatientDetails(jsonData.AddPatientDetails[index].pacr_que_name);
      await patientDetailshome.clickonAddPatientDetailsButton();
      await page.waitForTimeout(2000);
      //await patientDetailsED.selectSubCategory(jsonData.AddPatientDetails[index].eli_text);
      await patientDetailsED.selectCheckboxes();
      await patientDetailsED.EnterDate();
      await patientDetailsED.EnterNotes(jsonData.AddPatientDetails[index].pad_notes);
      await patientDetailsED.clickOnSaveButton();
      await page.waitForTimeout(1000);
     // await expect(page.getByText("Patient detail Record Added Successfully")).toHaveText("Patient detail Record Added Successfully");
      await patientDetailshome.expandLevels();
      await patientDetailshome.reviewRecords();
      await page.waitForTimeout(1000);
      await patientDetailshome.riskFilters1();
      await page.waitForTimeout(1000);
      await patientDetailshome.riskFilters2();
      await page.waitForTimeout(1000);
      await patientDetailshome.riskFilters3();
      await page.waitForTimeout(1000);
      await patientDetailshome.riskFilters4();
      await page.pause()
 ////// Database comparison- Patient Clinical Records - ADDING NEW Patient details/////////

 sqlQuery="select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, " +
 "pad_notes,pad_updated from patient_clinical_records join patient_clinical_records_details"+
 " on pacr_id=pacrd_pacr_id join patient_details on pacr_id=pad_pacr_id where pacr_record_status='approved'"+
 " and pacrd_record_status='approved' and pad_record_status='approved' and pacr_pat_id=" + patId +
 " and pacr_record_status='approved' and pacr_que_name='" + jsonData.AddPatientDetails[index].pacr_que_name +
 "' and pacr_category='Patient Detail' order by 1 desc limit 1";
      
sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
results = await executeQuery(sqlQuery, sqlFilePath);
//const pacrId = results[0].pacr_id;
console.log("\n Patient Clinical Records stored into the database: \n", results);
var match = await compareJsons(sqlFilePath, null, jsonData.AddPatientDetails[index]);
if (match) {
 console.log(
   "\n Patient Clinical Records Comparision: Parameters from both JSON files match!\n"
 );
} else {
 console.log(
   "\n Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n"
 );
}
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const day = String(currentDate.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;
const dbTimestamp = results[0].pad_updated; 
const dbTimestampString = dbTimestamp.toISOString();
const dbDate = dbTimestampString.split('T')[0];
const pacrId= results[0].pacr_id;
//const dbDate = dbTimestamp.split('T')[0];
// Example timestamp from the databaseconst 
if (formattedDate==dbDate){
  console.log(
    "\n Patient Clinical Date Comparision: Parameters from both JSON files match!\n"
  );
 } else {
  console.log(
    "\n Patient Clinical Date Comparision: Parameters from both JSON files do not match!\n"
  );
 }; 
 console.log(formattedDate)
 console.log(dbDate)// Example: "2024-05-21"

await page.pause()

       //Edit PatientDetails
      await patientDetailshome.clickonEditPatientDetailsIcon();
      //await patientDetailsED.edPopUp();
      await page.waitForTimeout(1000);
     // await patientDetailsED.clickOnExpandPatientDetails();
      await patientDetailsED.EnterNotes(jsonData.EditPatientDetails[index].pad_notes);
      await patientDetailsED.clickOnSaveButton();
      await page.waitForTimeout(500);
      //await expect(page.getByText("Patient detail record updated successfully")).toHaveText("Patient detail record updated successfully");
     
      //Switch Patient Details sections
      await patientDetailshome.clickOnAllLinks();
      //Switch Patient Details record history
      await patientDetailshome.recordHistory()
 ////// Database comparison - Patient Clinical Records - Edit Patient Details/////////
 sqlQuery =
 "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date," + 
 " pad_notes from patient_clinical_records join patient_clinical_records_details"+
 " on pacr_id=pacrd_pacr_id join patient_details on pacr_id=pad_pacr_id where pacr_record_status='approved'"+
 " and pacrd_record_status='approved' and pad_record_status='approved' and pacr_id=" + pacrId +
 " and pacr_record_status='approved'";
      
sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
results = await executeQuery(sqlQuery, sqlFilePath);

console.log("\n Patient Clinical Records stored into the database: \n", results);
var match = await compareJsons(sqlFilePath, null, jsonData.EditPatientDetails[index]);
if (match) {
 console.log(
   "\n Update Patient Clinical Records Comparision: Parameters from both JSON files match!\n"
 );
} else {
 console.log(
   "\n Update Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n"
 );
}
await page.pause()
  
      
     //Delete records
      await patientDetailshome.clickonEditPatientDetailsIcon();
      await patientDetailsED.clickOnDeleteButton()
      await patientDetailsED.clickOnCancelPatientDetails()
      await page.waitForTimeout(500);
      await patientDetailsED.clickOnDeleteButton()
      await patientDetailsED.clickOnOkDeletePatientDetails()
      await page.waitForTimeout(500);
      await patientDetailsED.enterDeletePatientDetailsReason(jsonData.DeletePatientDetails[index].pacr_delete_reason)
      await patientDetailsED.clickOnSaveForReason();

      ////// Database comparison- Delete Patient Clinical Records/////////
 sqlQuery =
 "select pacr_que_name, pacr_delete_reason from patient_clinical_records where pacr_id=" +
 pacrId +
 " and pacr_record_status='wrong'";
await page.pause()
 console.log(sqlQuery);
 
sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
results = await executeQuery(sqlQuery, sqlFilePath);
//  pacrId=results[0].pacr_id;
console.log("\n Patient Details stored into the database: \n", results);
var match = await compareJsons(
 sqlFilePath,
 null,
 jsonData.EditExamination[index]
);
if (match) {
 console.log(
   "\n  Patient Clinical Records Comparision: Parameters from both JSON files match!\n"
 );
} else {
 console.log(
   "\n  Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n"
 );
}

      //patient details home page icons
      await patientDetailshome.homepageOverviewIcon()
      await page.waitForTimeout(1000)
      await patientDetailshome.homepageIcons()
      await page.waitForTimeout(1000)

     //logout
      await patientDetailshome.logoutCellma()
      }

    });
  });


