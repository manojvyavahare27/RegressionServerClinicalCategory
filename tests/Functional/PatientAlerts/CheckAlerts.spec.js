//Manoj

const fs = require("fs");
const XLSX = require("xlsx");
const path = "C:/Riomed/Cellma4Automation";
const mysql = require("mysql2");
const convertExcelToJson = require("../../../config/global-setupOptimized");

const { test, expect } = require("@playwright/test");
const connectToDatabase = require("../../../manoj").default;
const { executeQuery } = require("../../../databaseWriteFile"); // Update the path accordingly
//import compareJsons from "../../../../../../compareFileOrJson";
import compareJsons from "../../../compareFileOrJson";

// import logger from "../../../../../../Pages/BaseClasses/logger";
import PatientAlert from "../../../Pages/PatientAlert/PatientAlertPage";
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
import CarePlanAddED from "../../../Pages/ClinicalDomain/PatientSummary/Categories/CarePlan/CarePlanAddED";

import { TIMEOUT } from "dns";
import { error } from "console";
import { before } from "node:test";
import { toggleDivVisibility } from "../../../UtilFiles/DynamicUtility";

// Array to store console logs

const consoleLogs = [];
let jsonData;

test.describe("Excel Conversion Alert Category", () => {
  test("Extract Patient Summary Details", async ({}) => {
    const excelFilePath =
      process.env.EXCEL_FILE_PATH || "./ExcelFiles/PatientSummary.xlsx";
    const jsonFilePath = "./TestDataWithJSON/PatientDomain/PatientDetails.json";

    console.log("excelFilePath:", excelFilePath);
    console.log("jsonFilePath:", jsonFilePath);
    const conversionSuccess = await convertExcelToJson(
      excelFilePath,
      jsonFilePath
    );
    if (conversionSuccess) {
      // jsonData = require("../../../TestDataWithJSON/PatientDomain/PatientDetails.json");
      jsonData = require("../../../TestDataWithJSON/PatientDomain/PatientDetails.json");
      console.log("Excel file has been converted successfully!");
      console.log("jsonData:", jsonData); // Log the loaded JSON data
      console.log("excelFilePath after conversion:", excelFilePath);
      console.log("jsonFilePath after conversion:", jsonFilePath);
    } else {
      throw new Error("Excel to JSON conversion failed.");
    }
  });
}); 

test.describe("Alerts Category", () => {
  test("Alerts Category", async ({ page }) => {
    if (!jsonData || !jsonData.PatientDetails) {
      throw new Error("JSON data is missing or invalid.");
    }
    let index = 0;
    for (const data of jsonData.PatientDetails) {
      const loginpage = new LoginPage(page);
      const patientAlert=new PatientAlert(page)
      const homepage = new Homepage(page);
      const environment = new Environment(page);
      const confirmexisting = new ConfirmExisting(page);
      const contacthistory = new ContactHistory(page);
      const patientsearch = new PatientSearch(page);
      const carePlan = new ClinicalSummary(page);
      const AlertDetails = new ClinicalExtraDetails(page);

      const clinicalSummary = new ClinicalSummary(page);
      //const careplanadd=new CarePlanAddED(page)

      const menu = new Menu(page);

      await page.goto(environment.Test);
      await loginpage.enterUsername(jsonData.loginDetails[0].username);
      logger.info("Username enter successfully");
      await loginpage.enter_Password(jsonData.loginDetails[0].password);
      logger.info("Password enter successfully");
      await loginpage.clickOnLogin();
       await page.pause()
      logger.info("Clicked on Login button successfully");
      
      await homepage.clickOnSideIconAlerts();
      logger.info("Clicked on Alerts Icon successfully");
      await page.pause()
      await patientsearch.clickOnSearchButton();
      logger.info("Clicked on Search button successfully");
      
      await page.pause()
      await patientAlert.clickOnSidebarDrawer()
      await patientAlert.clickOnSidebarDrawer()
      await page.pause()
      await patientAlert.clickOnLinksLink()
      await patientAlert.clickOnMyTaskLink()
      await AlertDetails.clickPopup()

      await patientAlert.clickOnServiceAppReminder()
      await AlertDetails.clickPopup()
      
      await AlertDetails.selectAlertsDaysDropdown()
      await AlertDetails.enterAlertsStartdate(jsonData.Alerts[index].Alert_Start_Date)
      await AlertDetails.enterAlertsEnddate(jsonData.Alerts[index].Alert_End_Date)
      await patientsearch.clickOnSearchButton();
      await page.waitForTimeout(2000)
      await AlertDetails.selectAnyPriorityDropdown(jsonData.Alerts[index].Priority_Any_Priority)
      await patientsearch.clickOnSearchButton();
      await page.waitForTimeout(2000)
      await AlertDetails.selectAnyHighDropdown(jsonData.Alerts[index].Priority_Very_High)
      await patientsearch.clickOnSearchButton();
      await page.waitForTimeout(2000)

      //Display
      await AlertDetails.selectAllDisplayDropdown(jsonData.Alerts[index].Display_All)
      await patientsearch.clickOnSearchButton();
      await page.waitForTimeout(2000)
      await AlertDetails.selectMyAlertsDisplayDropdown(jsonData.Alerts[index].Display_My_Alerts)
      await patientsearch.clickOnSearchButton();
      await page.pause()
      await AlertDetails.selectForUser(jsonData.Alerts[index].For_User)
      await patientsearch.clickOnSearchButton();
      await page.waitForTimeout(2000)
      await page.pause()
      

    }
  });
});
