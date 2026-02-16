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
 
 
import { TIMEOUT } from "dns";
import { error } from "console";
import { before } from "node:test";
import { toggleDivVisibility } from "../../../../../../UtilFiles/DynamicUtility";
import PatientSummary from "../../../../../../Pages/ClinicalDomain/PatientSummary/PatientSummary";
 
// Array to store console logs
 
const consoleLogs = [];
let jsonData;
 
test.describe("Excel Conversion Recommendations Category", () => {
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
 
test.describe("Recommendations Category", () => {
  test("Add Recommendations", async ({ page }) => {
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
      const Communications = new ClinicalSummary(page);
      const CommunicationExtraDetails = new PatientSummary(page);
     
 
      const menu = new Menu(page);
      await page.goto(environment.Test);
      await loginpage.enterUsername(jsonData.loginDetails[0].username);
      logger.info("Username enter successfully");
      await loginpage.enter_Password(jsonData.loginDetails[0].password);
      logger.info("Password enter successfully");
      await loginpage.clickOnLogin();      
      logger.info("Clicked on Login button successfully");
      await homepage.clickOnHomeDashboardIcon()
      await homepage.clickOnSideIconPatient();
      logger.info("Clicked on Patient Icon successfully");
      await patientsearch.clickOnSearchButton();
      logger.info("Clicked on Search button successfully");
      await patientsearch.enterGivenName(data.pat_firstname);
      logger.info("Given Name entered successfully");
      //await page.pause()
      await patientsearch.enterFamilyName(data.pat_surname);
      logger.info("Family Name entered successfully");
      //await patientsearch.selectSex(data.pat_sex);
 
      await page.pause()
    await patientsearch.selectBornDate(jsonData.PatientDetails[index].pat_dob);
      //await patientsearch.selectBornDate(formattedDate);
      await patientsearch.clickOnSearchButton();
      await patientsearch.clickOnSearchPatientLink();
      await page.waitForTimeout(1500);
      await confirmexisting.clickOnConfirmExistingDetails();    
       await contacthistory.clickOnShowFilter()
      await contacthistory.selectServiceFilter("General Medicine Automation");
      await contacthistory.selectContactReasonFilter("Assessments");
      //await contacthistory.enterContactDate("26/04/2024");
      await contacthistory.selectContactReason("Assessments");
      await contacthistory.selectContactLocation("Cardio Location");
      //await contacthistory.enterContactWith("Dr Sathya");
      await contacthistory.clickOnAddContact();
      await Communications.clickOnViewContactItemsMenu();
      await Communications.clickOnPinContactItemsMenu();
      await Communications.selectCategoryFromList("Communication");
     
      await page.pause()
 
         
       //////Fetch Patient Details/////////
    //   var sqlQuery =
    //   "select * from patient_audit where paa_use_username='" + jsonData.loginDetails[0].username +
    //   "' and paa_type='selected' order by 1 desc limit 1";
    //   var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
    //   var results = await executeQuery(sqlQuery, sqlFilePath);
    //   console.log("\n Patient Details stored into the database: \n", results);
    //   const patId = results[0].paa_pat_id;
    //   console.log("Patient Accessed by User:" + patId);
 
 
 
//ADD NEW Recommendations/////
      await CommunicationExtraDetails.clickOnTextEmailBtn()
      await page.waitForTimeout(5000)
      await CommunicationExtraDetails.selectTypeOfCom('Text')
      //await CommunicationExtraDetails.enterEmailHeader('Test Text')
      await CommunicationExtraDetails.selectStdContent('This is an Appointment Email from Cellma')
      await CommunicationExtraDetails.enterContent('Test Communication text')
      await CommunicationExtraDetails.sendToPatientCheckbox()
      await CommunicationExtraDetails.clickOnSendComm()
      await page.waitForTimeout(5000)
      await CommunicationExtraDetails.clickOnTextEmailBtn()
      await page.waitForTimeout(5000)
      await CommunicationExtraDetails.selectTypeOfCom('Email')
      await CommunicationExtraDetails.enterEmailHeader('Test Email')
      await CommunicationExtraDetails.selectStdContent('This is an Appointment Email from Cellma')
      await CommunicationExtraDetails.enterContent('Test Communication email')
      await CommunicationExtraDetails.sendToPatientCheckbox()
      await CommunicationExtraDetails.clickOnSendComm()
      await page.waitForTimeout(2000)
      await CommunicationExtraDetails.clickOnEmailSection()
      await page.waitForTimeout(2000)
      await CommunicationExtraDetails.clickOnTextSection()
      await page.waitForTimeout(2000)
      await CommunicationExtraDetails.clickOnAllCommSection()
      await page.waitForTimeout(2000)
      await CommunicationExtraDetails.clickOnFirstShowLink()
      await page.waitForTimeout(2000)
      await CommunicationExtraDetails.closePopUp()
      await page.waitForTimeout(2000)
      await CommunicationExtraDetails.clickOnSecondShowLink()
      await page.waitForTimeout(2000)
      await CommunicationExtraDetails.closePopUp()
      await page.waitForTimeout(2000)
      await CommunicationExtraDetails.clickOnCellma()
      await page.waitForTimeout(3000)
      await CommunicationExtraDetails.clickOnCommunicationDiv()
      await page.waitForTimeout(3000)
      // await CommunicationExtraDetails.clickOnFirstShowLink()
      // await page.waitForTimeout(2000)
      // await CommunicationExtraDetails.closePopUp()
      // await page.waitForTimeout(2000)
      // await CommunicationExtraDetails.clickOnSecondShowLink()
      await page.waitForTimeout(2000)
      await CommunicationExtraDetails.clickOnCommunicationIcon()
      await page.waitForTimeout(2000)
      await CommunicationExtraDetails.clickOnSearchButton()
      await page.waitForTimeout(2000)
      await CommunicationExtraDetails.expandFisrtCom()
      await CommunicationExtraDetails.expandSecondCom()
      await page.pause()
 
      await page.getByLabel('profileIcon').click();
      await page.getByText('Logout').click();
 
    //   sqlQuery =
    //   "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, recom_review_date, recom_notes"+
    //   " from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join recommendations on pacr_id=recom_pacr_id where pacr_record_status='approved'"+
    //   " and pacr_pat_id=" + patId +
    //   " and pacr_record_status='approved' and pacr_que_name='" + jsonData.AddRecommendations[index].pacr_que_name +
    //   "' and pacr_category='recommendation' order by 1 desc limit 1";
 
 
    // console.log("Manoj:  "+ sqlQuery);
           
    // sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    // results = await executeQuery(sqlQuery, sqlFilePath);
    // const pacrId = results[0].pacr_id;
    // console.log("\n Patient Clinical Records stored into the database: \n", results);
    // var match = await compareJsons(sqlFilePath, null, jsonData.AddRecommendations[index]);
    // if (match) {
    //   console.log("\n Patient Clinical Records Comparision adding new Recommendation: Parameters from both JSON files match!\n");
    // } else {
    //   console.log("\n Patient Clinical Records Comparision adding new Recommendation: Parameters from both JSON files do not match!\n");
    // }
   
   
     
     // await page.pause();
    }
  });
});