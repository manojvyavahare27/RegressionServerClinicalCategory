//Manoj V.

const fs = require("fs");
const XLSX = require("xlsx");
const path = "C:/Riomed/Cellma4Automation";
const mysql = require("mysql2");
const convertExcelToJson = require("../../../config/global-setupOptimized");

const { test, expect } = require("@playwright/test");
const connectToDatabase = require("../../../manoj").default;
const { executeQuery } = require("../../../databaseFunctions"); // Update the path accordingly
import compareJsons from "../../../compareFileOrJson";

import logger from "../../../Pages/BaseClasses/logger";
import LoginPage from "../../../Pages/BaseClasses/LoginPage";
import Homepage from "../../../Pages/BaseClasses/Homepage";
import ConfirmExisting from "../../../Pages/PatientDomain/ConfirmExisting";
import ContactHistory from "../../../Pages/ClinicalDomain/PatientSummary/ContactHistory";
import PatientSearch from "../../../Pages/PatientDomain/PatientSearch";
import Environment from "../../../Pages/BaseClasses/Environment";
import Menu from "../../../Pages/BaseClasses/Menu";
import ClinicalSummary from "../../../Pages/ClinicalDomain/PatientSummary/ClinicalSummary";
import ClinicalExtraDetails from "../../../Pages/ClinicalDomain/PatientSummary/ClinicalExtraDetails";

// import ClinicalSummary from "../../../../Pages/ClinicalDomain/PatientSummary/ClinicalSummary";
// import ClinicalExtraDetails from "../../..//Pages/ClinicalDomain/MedicalCertificateExtraDetails";


import { TIMEOUT } from "dns";
import { error } from "console";
import { before } from "node:test";
import { toggleDivVisibility } from "../../../UtilFiles/DynamicUtility";

// Array to store console logs

const consoleLogs = [];
let jsonData;

test.describe("Medical Certificate Excel File", () => {
  test("Extract Medical Certificate Details", async ({}) => {
    const excelFilePath = process.env.EXCEL_FILE_PATH || "./ExcelFiles/MedicalCertificate.xlsx";
    const jsonFilePath = "./TestDataWithJSON/PatientDomain/MedicalCertificate.json";

    console.log("excelFilePath:", excelFilePath);
    console.log("jsonFilePath:", jsonFilePath);
    const conversionSuccess = await convertExcelToJson(excelFilePath, jsonFilePath);
    if (conversionSuccess) {
      // jsonData = require("../../../TestDataWithJSON/PatientDomain/PatientDetails.json");
      jsonData = require("../../../TestDataWithJSON/PatientDomain/MedicalCertificate.json");
      console.log("Excel file has been converted successfully!");
      console.log("jsonData:", jsonData); // Log the loaded JSON data
      console.log("excelFilePath after conversion:", excelFilePath);
      console.log("jsonFilePath after conversion:", jsonFilePath);
    } 
    else {
      throw new Error("Excel to JSON conversion failed.");
    }
  });
});

test.describe("Medical Certificate", () => {
  test("Add Class 2 Medical Certificate", async ({ page }) => {
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
      const MedicalCertificate = new ClinicalSummary(page);
      const MCExtraDetails = new ClinicalExtraDetails(page);

      const LimitationTypeTML="TML   Limited period of validity of the medical certificate";
      const LimitationTypeVML="VML   Valid only with correction for defective distant, intermediate and near vision";
      
      const menu = new Menu(page);
      await page.goto(environment.Test);
      await loginpage.enterUsername(jsonData.loginDetails[0].username);
      logger.info("Username enter successfully");
      await loginpage.enter_Password(jsonData.loginDetails[0].password);
      logger.info("Password enter successfully");
      await loginpage.clickOnLogin();      
      logger.info("Clicked on Login button successfully");
      await homepage.clickOnHomeDashboardIcon()
      await homepage.clickOnPatientIcon();
      logger.info("Clicked on Patient Icon successfully");
      await patientsearch.clickOnSearchButton();
      logger.info("Clicked on Search button successfully");
      await patientsearch.enterGivenName(data.pat_firstname);
      logger.info("Given Name entered successfully");
      //await page.pause()
      await patientsearch.enterFamilyName(data.pat_surname);
      logger.info("Family Name entered successfully");
      await patientsearch.selectSex(data.pat_sex);

      await patientsearch.selectBornDate(jsonData.PatientDetails[index].pat_dob);
      //await patientsearch.selectBornDate(formattedDate);
      await patientsearch.clickOnSearchButton();
      
      await patientsearch.clickOnSearchPatientLink();
      await page.waitForTimeout(1500); //wait 1.5 second
      await confirmexisting.clickOnConfirmExistingDetails();     
       await contacthistory.clickOnShowFilter()
      await contacthistory.selectServiceFilter("General Medicine Automation");
      await contacthistory.selectContactReasonFilter("Assessments");
      await contacthistory.enterContactDate("26/04/2024");
      await contacthistory.selectContactReason("Assessments");
      await contacthistory.selectContactLocation("Cardio Location");
      await contacthistory.enterContactWith("Dr Sathya");
      await contacthistory.clickOnAddContact();
      await MedicalCertificate.clickOnViewContactItemsMenu();
      await MedicalCertificate.clickOnPinContactItemsMenu();
      await MedicalCertificate.selectCategoryFromList("Medical Certificates");
      //await page.waitForTimeout(3000)
      //await page.pause()
      await page.waitForTimeout(1000)
      if(await MedicalCertificate.checkItemOnMedicationCertificateHistoryTable("Class 1 Pilots"))
      {
      //await MedicalCertificate.clickOnDelete("Class 1 Pilots");
      await MCExtraDetails.clickOnDeleteCertificate()
      //await page.pause() 
      await MCExtraDetails.clickOnConfirmDelete();
      await expect(page.getByText("Medical certificate deleted successfully")).toHaveText("Medical certificate deleted successfully");
      }        
      await page.waitForTimeout(1000)
      await MedicalCertificate.ClickOnAddMedicalCertificateButton()
      await page.waitForTimeout(1000)
      await MedicalCertificate.selectClass("Class 1 Pilots")
      await page.waitForTimeout(1000)
      await MedicalCertificate.selectLicCategory("Single pilot commercial operations carrying passengers")
      await page.waitForTimeout(1000)
      // await page.pause() 
      // await MedicalCertificate.selectModeCategory("Initial")
      // await page.waitForTimeout(1000)
     // await page.pause() 
      await MedicalCertificate.selectValidityCategory("Set Validity Dates")
      await page.waitForTimeout(1000)
      await page.pause()  
      await MCExtraDetails.clickOnSave(); 
      await page.waitForTimeout(2000)
      await MCExtraDetails.enterClinicalItemNotes("Added for testing");
      await MCExtraDetails.clickOnConfirm()
     // await expect(page.getByText("Medical certificate dates are successfully saved")).toHaveText("Medical certificate dates are successfully saved");
      await page.pause()
      await MCExtraDetails.selectLimitations("TML   Limited period of validity of the medical certificate")
      const inputValue = await page.locator("xpath=//input[@id='limitation']").inputValue();
      await page.waitForTimeout(1000)
      await page.pause()
      if(LimitationTypeTML === inputValue)
      {
        await MCExtraDetails.enterLimitationAppliedDate("21/08/2024")
        await MCExtraDetails.enterLimitationValidToDate("30/08/2024")     
        await MCExtraDetails.clickOnConsultedCAA()
        await MCExtraDetails.enterReasonForLimitation("For testing")
        await MCExtraDetails.clickOnAddLimitationButton()
        await expect(page.getByText('Limitation added successfully.')).toHaveText('Limitation added successfully.')
      }    

      await MCExtraDetails.clickOnShowLimitationLink()
      await MCExtraDetails.closeOnClosePopupButton()
      await MCExtraDetails.clickOnEditLimitationLink()
      await MCExtraDetails.closeOnClosePopupButton()


      
      await page.pause()
     
    }
  });
});
