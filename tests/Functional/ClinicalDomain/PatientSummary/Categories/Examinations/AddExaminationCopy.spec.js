//Sathyanarayan

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

// Array to store console logs

const consoleLogs = [];
let jsonData;

test.describe("Excel Conversion Examination Category", () => {
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

test.describe("Examination Category", () => {
  test("Add Examination", async ({ page }) => {
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
      const examination = new ClinicalSummary(page);
      const examinationExtraDetails = new ClinicalExtraDetails(page);
      

      const menu = new Menu(page);
      await page.goto(environment.Test);
      await loginpage.enterUsername(jsonData.loginDetails[0].username);
      logger.info("Username enter successfully");
      await loginpage.enter_Password(jsonData.loginDetails[0].password);
      logger.info("Password enter successfully");
      await loginpage.clickOnLogin();
      logger.info("Clicked on Login button successfully");
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
      await page.waitForTimeout(1500);
      await confirmexisting.clickOnConfirmExistingDetails();
      // await contacthistory.clickOnMenuIcon()
      // await page.waitForTimeout(2000)
      // await contacthistory.clickOnMenuIcon()
      // await patientsummary.clickOniconExaminationsCategory()
      await page.pause();
      await contacthistory.selectServiceFilter("General Medicine Automation");
      await contacthistory.selectContactReasonFilter("Assessments");
      await contacthistory.enterContactDate("26/04/2024");
      await contacthistory.selectContactReason("Assessments");
      await contacthistory.selectContactLocation("Cardio Location");
      await contacthistory.enterContactWith("Dr Sathya");
      await contacthistory.clickOnAddContact();
      await examination.clickOnViewContactItemsMenu();
      await examination.clickOnPinContactItemsMenu();
      await examination.selectCategoryFromList("Examinations");
      await examination.selectandAddClinicalItem("Dry eye"); //This searches item and clicks on add button
      await page.waitForTimeout(2000);
      await page.pause()
      await examinationExtraDetails.clickOnClincialItemCollapsable();
      await page.waitForTimeout(1000);
      await examinationExtraDetails.selectClinicalItemSubcategory("Exm subsection");
      //await examinationExtraDetails.enterClinicDate("26/04/2024");
      await examinationExtraDetails.selectOutcome("Normal")
      await examinationExtraDetails.selectRecommendation("Rectoplasty")
     // await examinationExtraDetails.selectFrequency("1");
      await examinationExtraDetails.enterClinicalItemNotes(
        "Added Examinations Notes From Playwright"
      );
      await examinationExtraDetails.clickOnSave();
      await page.waitForTimeout(500);
      // await expect(
      //   page.getByText("Examination Record Added Successfully")
      // ).toHaveText("Examination Record Added Successfully");
      await expect(
        page.getByText(`${clinicaCatergory} Record Added Successfully`)
      ).toHaveText(`${clinicaCatergory} Record Added Successfully`);

      await outcome.toggleSearchSection(); //Close the search section
      await page.pause();

      await outcome.clickOnItemDiv("Sleep walking disorder");
      await outcome.clickOnItemEdit();
      await outcomeExtraDetails.clickOnClincialItemCollapsable();
      await outcomeExtraDetails.selectClinicalItemSubcategory("Normal Outcome");
      await outcomeExtraDetails.enterDateOfOutcome("02/05/2024");
      await outcomeExtraDetails.selectFrequency("2");
      await outcomeExtraDetails.enterClinicalItemNotes(
        "Updated Outcome Notes From Playwright"
      );
      await outcomeExtraDetails.clickOnSave();
      await page.waitForTimeout(1000);
      //await expect(page.getByText('Outcome Record Updated Successfully')).toHaveText('Outcome Record Updated Successfully')
      await outcome.clickOnItemHistory();
      await outcome.clickOnHistoryItemDiv();
      await page.waitForTimeout(500);
      await outcome.closeWindow();
      await page.waitForTimeout(500);
      await outcome.clickOnItemReview();
      await page.waitForTimeout(500);
      await outcome.clickOnItemHighlightNone();
      await page.waitForTimeout(500);
      await outcome.selectLowRiskLevel();
      await page.waitForTimeout(500);
      await outcome.selectModerateRiskLevel();
      await page.waitForTimeout(500);
      await outcome.selectHighRiskLevel();
      await page.waitForTimeout(500);
      await outcome.selectAllRiskLevel();
      await outcome.clickOnLevelTwoExtraDetails();
      await outcome.clickOnLevelThreeExtraDetails();
      await outcome.clickOnLevelOneExtraDetails();
      await outcome.clickOnItemEdit();
      await outcomeExtraDetails.clickOnDelete();
      await outcomeExtraDetails.clickOnCancelDelete();
      await outcomeExtraDetails.clickOnDelete();
      await outcomeExtraDetails.clickOnConfirmDelete();
      await outcomeExtraDetails.enterDeleteReason("Deleted from playwright");
      await outcomeExtraDetails.clickOnSaveDeleteReason();
      await outcome.clickOnNormalItemsSection();
      await outcome.clickOnMigratedItemsSection();
      await outcome.clickOnDeletedItemsSection();
      await page.waitForTimeout(1000);
      await outcome.clickOnArchivedItemsSection();
      await outcome.clickOnAllItemsSection();
      await outcome.toggleHistorySection(); // Close the history section

      //   await examinationhome.expandExaminationHistory()
      //   await examinationhome.expandExaminationHistory()
      //   await examinationhome.clickOnAllLinks();
      //  await examinationhome.clickOnHistoryIcon()
      //  await examinationhome.expandsHistoryofExaminationIcon()
      //  await examinationhome.expandsHistoryofExaminationIcon()
      //  await examinationhome.closeExaminationHistoryPopup()
      //  await page.waitForTimeout(2000)
      //  await examinationhome.clickOnReviewExaminationButton()
      //  await page.waitForTimeout(2000)
      //  await examinationhome.clickOnHighlightedNoneRisk()
      //  await page.waitForTimeout(2000)
      //  await examinationhome.clickOnLowRiskLevel()
      //  await page.waitForTimeout(2000)
      //  await examinationhome.clickOnModerateRiskLevel()
      //  await page.waitForTimeout(2000)
      //  await examinationhome.clickOnHighRiskLevel()
      //  await page.waitForTimeout(2000)
      //  await examinationhome.clickOnAllRiskLevel()
      //  await page.waitForTimeout(1000)
      //  await page.pause()
      //  await examinationhome.checkExtradetailsLevel()

      ////////To be utilized to implement pin functionality/////////////
      //   test('Verify pin functionality', async ({ page }) => {
      //     const contactItems = new ContactItems(page);

      //     // Click on the view menu to open the window
      //     await contactItems.clickOnViewMenu();

      //     // Assert that the viewMenu button is hidden and the closeMenu button is visible
      //     expect(await page.isVisible(contactItems.viewMenu)).toBeFalsy();
      //     expect(await page.isVisible(contactItems.closeMenu)).toBeTruthy();

      //     // Click the pinContactItemsMenu button
      //     await contactItems.clickOnPinContactItemsMenu();

      //     // Assert that the pinContactItemsMenu button is hidden and the closeMenu button is visible again
      //     expect(await page.isVisible(contactItems.pinContactItemsMenu)).toBeFalsy();
      //     expect(await page.isVisible(contactItems.closeMenu)).toBeTruthy();

      //     // Click the pinContactItemsMenu button again to revert the state
      //     await contactItems.clickOnPinContactItemsMenu();

      //     // Assert that the pinContactItemsMenu button is visible and the closeMenu button is hidden
      //     expect(await page.isVisible(contactItems.pinContactItemsMenu)).toBeTruthy();
      //     expect(await page.isVisible(contactItems.closeMenu)).toBeFalsy();
      // });

      await page.pause();
    }
  });
});
