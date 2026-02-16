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
import ContactHistory from "../../../../../../Pages/ClinicalDomain/PatientSummary/ContactHistory";
import PatientSearch from "../../../../../../Pages/PatientDomain/PatientSearch";
import Environment from "../../../../../../Pages/BaseClasses/Environment";
import Menu from "../../../../../../Pages/BaseClasses/Menu";
import ClinicalSummary from "../../../../../../Pages/ClinicalDomain/PatientSummary/ClinicalSummary";
import ClinicalExtraDetails from "../../../../../../Pages/ClinicalDomain/PatientSummary/ClinicalExtraDetails";
import PatientSummary from "../../../../../../Pages/ClinicalDomain/PatientSummary/PatientSummary";

import { TIMEOUT } from "dns";
import { error } from "console";
import { before } from "node:test";
import { toggleDivVisibility } from "../../../../../../UtilFiles/DynamicUtility";

// Array to store console logs

const consoleLogs = [];
let jsonData;
test.describe("Excel Conversion Patient Scan Category", () => {
  test("Extract Patient Summary Details", async ({ }) => {
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
})

test.describe("PatientScan Category", () => {
  test("Add PatientScan", async ({ page }) => {


    if (!jsonData || !jsonData.PatientDetails) {
      throw new Error("JSON data is missing or invalid.");
    }
    let index = 0;
    for (const data of jsonData.PatientDetails) {
      const loginpage = new LoginPage(page);
      const homepage = new Homepage(page);
      const environment = new Environment(page);
      const confirmexisting = new ConfirmExisting(page);
      const contacthistory = new ContactHistory(page);
      const patientsearch = new PatientSearch(page);
      const patientScan = new ClinicalSummary(page);
      const patientScanExtraDetails = new ClinicalExtraDetails(page);
      const patientsummary = new PatientSummary(page);

      const menu = new Menu(page);
      await page.goto(environment.Test);
      await loginpage.enterUsername(jsonData.loginDetails[0].username);
      logger.info("Username enter successfully");
      await loginpage.enter_Password(jsonData.loginDetails[0].password);
      logger.info("Password enter successfully");
      await loginpage.clickOnLogin();      
      logger.info("Clicked on Login button successfully");
      // await homepage.redirectsToHomePage();
      // logger.info("Redirected To Home Page Successfully")
      await homepage.clickOnSideIconPatient()
      logger.info("Clicked on Patient Icon successfully");
      // await homepage.clickOnPatientIcon();
      // logger.info("Clicked on Patient Icon successfully");
      await patientsearch.clickOnSearchButton();
      logger.info("Clicked on Search button successfully");
      await patientsearch.enterGivenName(data.pat_firstname);
      logger.info("Given Name entered successfully");
      //await page.pause()
      await patientsearch.enterFamilyName(data.pat_surname);
      logger.info("Family Name entered successfully");
     // await patientsearch.selectSex(data.pat_sex);

      await patientsearch.selectBornDate(jsonData.PatientDetails[index].pat_dob);
      //await patientsearch.selectBornDate(formattedDate);
      await patientsearch.clickOnSearchButton();

      await patientsearch.clickOnSearchPatientLink();
      await page.waitForTimeout(1500);
      await confirmexisting.clickOnConfirmExistingDetails();
     await page.waitForTimeout(1000);
      const alertPopup= await page.locator("xpath=//h2[text()='Alerts']").isVisible()      
      if(alertPopup==true)
        {       
          await patientScan.closePopUp(page)
        }                 
       await page.waitForTimeout(1000)      
      
     // await contacthistory.enterContactDate('26/04/2024');
      await contacthistory.selectContactReason('Assessments');
      await contacthistory.selectContactLocation('Cardio Location');
      //await contacthistory.enterContactWith('Dr Sathya');
      await contacthistory.clickOnAddContact();
      await patientScan.clickOnViewContactItemsMenu();
      await patientScan.clickOnPinContactItemsMenu();
     
      await patientScan.selectCategoryFromList("Patient's Scans");
      //await page.locator("xpath=//input[@id='allCategory']").click()
      //await page.locator("xpath=//li[@id='allCategory-option-18']").click()
      await page.waitForTimeout(2000)

      //Review
      if(await patientScan.checkItemOnHistoryTable(jsonData.AddPatientScan[index].pacr_que_name)){
        //await patientScan.clickOnItemReview(jsonData.AddPatientScan[index].pacr_que_name);
        //console.log("Item reviewed before deleting");
        await patientScan.clickOnItemEdit(jsonData.AddPatientScan[index].pacr_que_name);
        await patientScanExtraDetails.clickOnDelete();
        await patientScanExtraDetails.clickOnConfirmDelete();
        await patientScanExtraDetails.enterDeleteReason('Deleted Existing item');
        await patientScanExtraDetails.clickOnSaveDeleteReason();
        console.log('\x1bItem was deleted successfully\x1b[0m');
        }
        await page.waitForTimeout(2000)
  
  
        console.log('\x1b[31mItem was deleted successfully\x1b[0m'); //Red
        console.log('\x1b[32mItem was deleted successfully\x1b[0m');   // Green
        console.log('\x1b[90mItem was deleted successfully\x1b[0m');    // Grey
       // await page.pause()
   //////Fetch Patient Details/////////
   var sqlQuery =
   "select * from patient_audit where paa_use_username='" + jsonData.loginDetails[0].username + 
   "' and paa_type='selected' order by 1 desc limit 1";
   var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
   var results = await executeQuery(sqlQuery, sqlFilePath);
   console.log("\n Patient Details stored into the database: \n", results);
   const patId = results[0].paa_pat_id;

   console.log("Patient Accessed by User:" + patId);

      // Adding new Patient's Scan
      await patientScan.selectandAddClinicalItem(jsonData.AddPatientScan[index].pacr_que_name);
      await page.waitForTimeout(2000);
        await patientScan.handleSubCategoryPopup(page) 
      await page.getByLabel('cancelIcon').click();
      await patientScan.selectandAddClinicalItem(jsonData.AddPatientScan[index].pacr_que_name);
      //await patientScanExtraDetails.clickOnClincialItemCollapsable();
      await page.waitForTimeout(1000);
      //await patientScanExtraDetails.selectClinicalItemSubcategory(jsonData.AddPatientScan[index].eli_text);
      await patientScanExtraDetails.selectScanType(jsonData.AddPatientScan[index].pascn_scan_type_eli_text);
     
      await patientScanExtraDetails.enterScanDate(jsonData.AddPatientScan[index].pascn_scan_date);
      await patientScanExtraDetails.selectScanArea(jsonData.AddPatientScan[index].pascn_site_name);
      await patientScanExtraDetails.enterBmdScore(jsonData.AddPatientScan[index].pascn_bmd_score);
      await patientScanExtraDetails.enterTScore(jsonData.AddPatientScan[index].pascn_t_score);
      await patientScanExtraDetails.enterZScore(jsonData.AddPatientScan[index].pascn_z_score);
      await patientScanExtraDetails.selectMachineName(jsonData.AddPatientScan[index].pascn_machine_name);

      await patientScanExtraDetails.enterPatientScanNotes(jsonData.AddPatientScan[index].pascn_notes);
      await patientScanExtraDetails.clickOnSaveExtraDetails();
      await page.waitForTimeout(500);
      //await expect(page).toHaveText("'Patient's Scans Record Added Successfully'");
      //await expect(page.getByText("'Patient's Scans Record Added Successfully'")).toHaveText("'Patient's Scans Record Added Successfully'")
      //await expect(page.getByText(`${clinicaCatergory} Record Added Successfully`)).toHaveText(`${clinicaCatergory} Record Added Successfully`)
     
     ////// Database comparison- Patient Clinical Records - ADDING NEW PATIENT SCAN/////////
     sqlQuery =
     "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, " + 
     "pascn_scan_type_eli_text,pascn_t_score,pascn_z_score,pascn_bmd_score,pascn_scan_date,pascn_site_name,pascn_machine_name from patient_clinical_records join patient_clinical_records_details"+
     " on pacr_id=pacrd_pacr_id join patient_scans on pacr_id=pascn_pacr_id where pacr_record_status='approved'"+
     " and pacrd_record_status='approved' and pascn_record_status='approved' and pacr_pat_id=" + patId +
     " and pacr_record_status='approved' and pacr_que_name='" + jsonData.AddPatientScan[index].pacr_que_name +
     "' and pacr_category='Patient Scan' order by 1 desc limit 1";
    console.log("Patient Scan query"+sqlQuery)       
    
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);
   const pacrId = results[0].pacr_id;
   console.log("\n Patient Clinical Records stored into the database: \n", results);
   var match = await compareJsons(sqlFilePath, null, jsonData.AddPatientScan[index]);
   if (match) {
     console.log(
       "\n Patient Clinical Records Comparision add Overview: Parameters from both JSON files match!\n"
     );
   } else {
     console.log(
       "\n Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n"
     );
   } 
      
   // Toggle and edit existing Patient's Scan
      //await patientScan.toggleSearchSection();
      await page.waitForTimeout(1000);
      await patientScan.clickOnItemEdit('Abdominal Ultrasound');
      await page.waitForTimeout(2000);
      //await patientScanExtraDetails.clickOnClincialItemCollapsable();
      //await patientScanExtraDetails.selectClinicalItemSubcategory(jsonData.EditPatientScan[index].eli_text);
      await patientScanExtraDetails.enterBmdScore(jsonData.EditPatientScan[index].pascn_bmd_score);
      await patientScanExtraDetails.enterTScore(jsonData.EditPatientScan[index].pascn_t_score);
      await patientScanExtraDetails.enterZScore(jsonData.EditPatientScan[index].pascn_z_score);
      await patientScanExtraDetails.enterPatientScanNotes(jsonData.EditPatientScan[index].pascn_notes);
      await patientScanExtraDetails.clickOnSaveExtraDetails();
      await page.waitForTimeout(1000);
     
        ////// Database comparison - Patient Clinical Records - UPDATE Patient Scans/////////
     sqlQuery =
     "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date," + 
     "pascn_scan_type_eli_text,pascn_t_score,pascn_z_score,pascn_bmd_score,pascn_scan_date,pascn_site_name,pascn_machine_name from patient_clinical_records join patient_clinical_records_details"+
     " on pacr_id=pacrd_pacr_id join patient_scans on pacr_id=pascn_pacr_id where pacr_record_status='approved'"+
     " and pacrd_record_status='approved' and pascn_record_status='approved' and pacr_id=" + pacrId +
     " and pacr_record_status='approved'";
          
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);

   console.log("\n Patient Clinical Records stored into the database: \n", results);
   var match = await compareJsons(sqlFilePath, null, jsonData.EditPatientScan[index]);
   if (match) {
     console.log(
       "\n Update Patient Clinical Records Comparision Update PatientScan: Parameters from both JSON files match!\n"
     );
   } else {
     console.log(
       "\n Update Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n"
     );
   }
   

      // Auto update risk after updating Patient Scans
      // await patientScan.clickOnItemHistory();
      // await patientScan.clickOnHistoryItemDiv(jsonData.AddPatientScan[index].pascn_scan_type_eli_text);

      // await patientScan.clickOnItemHistory();
      // await patientScan.clickOnHistoryItemDiv();
      //await page.waitForTimeout(1000);
      //await patientScan.closeWindow();
      await page.waitForTimeout(2000);
      if (await patientScan.checkItemOnHistoryTable(null, true)) {
        console.error('Newly added item has not been reviewed after updating the record.');
        await patientScan.clickOnItemReview();
      } else {
        console.log('Newly added item has been reviewed after updating the record.');
      }
      await page.waitForTimeout(500);
      await patientScan.clickOnItemHighlightNone();
      await page.waitForTimeout(500);
      await patientScan.selectLowRiskLevel();
      await page.waitForTimeout(500);
      await patientScan.selectModerateRiskLevel();
      await page.waitForTimeout(500);
      await patientScan.selectHighRiskLevel();
      await page.waitForTimeout(500);
      await patientScan.selectAllRiskLevel();
      await patientScan.clickOnLevelTwoExtraDetails();
      await patientScan.clickOnLevelOneExtraDetails();
      await page.waitForTimeout(1000);


      ///////// Deleting Item ////////////

      await patientScan.clickOnItemEdit('Abdominal Ultrasound');
      await page.waitForTimeout(2000);
      await patientScanExtraDetails.clickOnDelete();
      await patientScanExtraDetails.clickOnCancelDelete();
      await patientScanExtraDetails.clickOnDelete();
      await patientScanExtraDetails.clickOnConfirmDelete();
      await patientScanExtraDetails.enterDeleteReason(jsonData.DeletePatientScan[index].pacr_delete_reason);
      await patientScanExtraDetails.clickOnSaveDeleteReason();
      

      await page.waitForTimeout(1000);
    }
  });
})