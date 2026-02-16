//Thayne

const convertExcelToJson = require("../../../../../../config/global-setupOptimized");

const { test, expect } = require("@playwright/test");
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

// Array to store console logs

const consoleLogs = [];
let jsonData;

test.describe("Excel Conversion Pstient View Category", () => {
  test("Extract Patient Summary Details", async ({}) => {
    const excelFilePath =
      process.env.EXCEL_FILE_PATH || "./ExcelFiles/PatientView.xlsx";
    const jsonFilePath = "./TestDataWithJSON/PatientDomain/PatientView.json";

    console.log("excelFilePath:", excelFilePath);
    console.log("jsonFilePath:", jsonFilePath);
    const conversionSuccess = await convertExcelToJson(
      excelFilePath,
      jsonFilePath
    );
    if (conversionSuccess) {
      // jsonData = require("../../../TestDataWithJSON/PatientDomain/PatientDetails.json");
      jsonData = require("../../../../../../TestDataWithJSON/PatientDomain/PatientView.json");
      console.log("Excel file has been converted successfully!");
      console.log("jsonData:", jsonData); // Log the loaded JSON data
      console.log("excelFilePath after conversion:", excelFilePath);
      console.log("jsonFilePath after conversion:", jsonFilePath);
    } else {
      throw new Error("Excel to JSON conversion failed.");
    }
  });
});

test.describe("Patient View Category", () => {
    test("Check All Categories", async ({ page }) => {
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
            const SummaryPage = new ClinicalSummary(page);
            const PatientViewDetails = new ClinicalExtraDetails(page);

            const menu = new Menu(page);
            await page.goto(environment.Test);
            await loginpage.enterUsername(jsonData.loginDetails[0].username);
            logger.info("Username enter successfully");
            await loginpage.enter_Password(jsonData.loginDetails[0].password);
            logger.info("Password enter successfully");
            await loginpage.clickOnLogin();
            logger.info("Clicked on Login button successfully");
            await homepage.clickOnHomeDashboardIcon();
            await homepage.clickOnPatientIcon();
            logger.info("Clicked on Patient Icon successfully");
            await patientsearch.clickOnSearchButton();
            logger.info("Clicked on Search button successfully");
            await patientsearch.enterGivenName(data.pat_firstname);
            logger.info("Given Name entered successfully");
            await patientsearch.enterFamilyName(data.pat_surname);
            logger.info("Family Name entered successfully");
            ///await patientsearch.selectSexAtBirth(data.pat_sex);
            await patientsearch.selectBornDate(data.pat_dob);
            //await patientsearch.selectBornDate(formattedDate);
            await patientsearch.clickOnSearchButton();
            await patientsearch.clickOnSearchPatientLink();
            //await page.waitForTimeout(4000);
            //page.waitForSelector("xpath=//button[@data-testid='Confirm Existing Details']");
            await confirmexisting.btn_confirmExistingDetails.waitFor();
            await page.waitForTimeout(1000);
            await confirmexisting.clickOnConfirmExistingDetails();

            
            
            const alert = await page.getByRole('heading', { name: 'Alerts', exact: true }).isVisible()
            if (alert) {
              await PatientViewDetails.clickPopup();              
            }

            await PatientViewDetails.togglePatientView();
            let count = 0;
            console.log("\n Display Check For All Patient View Categories")

              for (let section of jsonData.PatientViewSections) {

                ////////// Checking function call
                await PatientViewDetails.checkPatientView(section.selector, section.selector2, section.popUp)

                console.log(++count);
              }            
        }
    });
});