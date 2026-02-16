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

// Array to store console logs

const consoleLogs = [];
let jsonData;
test.describe("Excel Conversion LifeStyle Category", () => {
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
test.describe("Assessment Category", () => {
  test("Add Assessment", async ({ page }) => {
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
        const assessment = new ClinicalSummary(page);
        const assessmentExtraDetails = new ClinicalExtraDetails(page);
      //  const patientsummary = new PatientSummary(page);
  
 const menu = new Menu(page);
      await page.goto(environment.Test);
      await loginpage.enterUsername(jsonData.loginDetails[0].username);
      logger.info("Username enter successfully");
      await loginpage.enter_Password(jsonData.loginDetails[0].password);
      logger.info("Password enter successfully");
      await loginpage.clickOnLogin();      
      logger.info("Clicked on Login button successfully");
     // await homepage.clickOnHomeDashboardIcon()
      //await page.pause()
      await homepage.clickOnSideIconPatient()
      logger.info("Clicked on Patient Icon successfully");
      await patientsearch.clickOnSearchButton();
      logger.info("Clicked on Search button successfully");
      await patientsearch.enterGivenName(data.pat_firstname);
      logger.info("Given Name entered successfully");
      //await page.pause()
      await patientsearch.enterFamilyName(data.pat_surname);
      logger.info("Family Name entered successfully");
      //await patientsearch.selectSex(data.pat_sex);
 
    await patientsearch.selectBornDate(jsonData.PatientDetails[index].pat_dob);
      //await patientsearch.selectBornDate(formattedDate);
      await patientsearch.clickOnSearchButton();
     
      //await page.pause()
      await patientsearch.clickOnSearchPatientLink();
      await page.waitForTimeout(2000);
      await confirmexisting.clickOnConfirmExistingDetails();  
      
      await page.waitForTimeout(5000);
      const alertPopup= await page.locator("xpath=//h2[text()='Alerts']").isVisible()      
      if(alertPopup==true)
        {       
          await assessment.closePopUp()
        }
      await page.waitForTimeout(2000);

      await page.waitForTimeout(2000); 
       await contacthistory.clickOnShowFilter()  
      await contacthistory.selectServiceFilter("General Medicine Automation");
      await contacthistory.selectContactReasonFilter("Assessments");
     // await contacthistory.enterContactDate("26/04/2024");
      await contacthistory.selectContactReason("Assessments");
      await contacthistory.selectContactLocation("Cardio Location");
      // await contacthistory.enterContactWith("Dr Sathya");
      await contacthistory.clickOnAddContact();      
        
        await assessment.clickOnViewContactItemsMenu();        
        await assessment.clickOnPinContactItemsMenu();        
        await assessment.selectCategoryFromList("Assessments");       
       
        
  //////Fetch Patient Details/////////
        // var sqlQuery =
        // "select * from patient_audit where paa_use_username='" + jsonData.loginDetails[0].username +
        // "' and paa_type='selected' order by 1 desc limit 1";
        // var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
        // var results = await executeQuery(sqlQuery, sqlFilePath);
        // console.log("\n Patient Details stored into the database: \n", results);
        // const patId = results[0].paa_pat_id;
        // console.log("Patient Accessed by User:" + patId);
  
  // Adding new Presenting Problem
  

  await assessment.selectAssessmentType('User Assessment');
  await page.waitForTimeout(2000);
  //await assessment.selectAssessmentName('User Assessment');
  await assessment.selectAssessmentName('HACU-Nurse Assessment');
  
    await page.getByRole('option', { name: 'Allergies' }).click();
  await page.getByRole('button', { name: 'Clear' }).click();
  await page.getByTestId('search').click();
  await page.getByTestId('familyDetails').click();
  await page.getByTestId('search').click();
  await page.getByRole('combobox', { name: 'All Categories' }).click();
  await page.getByRole('option', { name: 'Allergies' }).click();
  await page.getByRole('combobox', { name: 'Any Search, Item, Code,' }).click();
  await page.getByRole('combobox', { name: 'Any Search, Item, Code,' }).fill('air');
  await page.getByRole('heading', { name: 'Airflow' }).click();
  await page.getByTestId('Add').click();
  await page.getByTestId('episodes[0].id').click();
  await page.getByRole('button', { name: 'Choose date' }).first().click();
  await page.getByRole('gridcell', { name: '12' }).click();
  await page.getByRole('button', { name: 'Choose date', exact: true }).click();
  await page.getByRole('gridcell', { name: '12' }).click();
  await page.getByTestId('episodes[0].reaction').getByRole('combobox', { name: 'Reaction' }).click();
  await page.getByRole('option', { name: 'Sneezing' }).click();
  await page.getByRole('combobox', { name: 'Reaction Severity' }).click();
  await page.getByRole('option', { name: 'Mild' }).click();
  await page.getByTestId('Allergy Notes').click();
  await page.getByTestId('Allergy Notes').fill('for testing');
  await page.getByTestId('Save').click();
  await page.getByTestId('socialAndFamilyHistory').click();
  await page.getByRole('combobox', { name: 'Highest Educational Level' }).click();
  await page.getByRole('option', { name: 'Post-graduate Qualification' }).click();
  await page.getByRole('combobox', { name: 'Literacy Level Literacy Level' }).click();
  await page.getByRole('option', { name: 'Literate', exact: true }).click();
  await page.getByRole('combobox', { name: 'Annual Income Range($) Annual' }).click();
  await page.getByRole('option', { name: 'More than' }).click();
  await page.locator('[id="1631"]').getByLabel('', { exact: true }).click();
  await page.getByText('Parents', { exact: true }).click();
  await page.locator('#menu-livesWith > .MuiBackdrop-root').click();
  await page.getByRole('textbox', { name: 'notesC355NL000001' }).click();
  await page.getByRole('textbox', { name: 'notesC355NL000001' }).fill('add social history');
  await page.getByTestId('familyDetails').click();
  await page.locator('[id="1621"] #areFamilyMembersAwareOfPatientsHIVStatusC361L45582').click();
  await page.getByRole('option', { name: 'Yes' }).click();
  await page.locator('[id="1621"] #haveFamilyMembersBeenTestedForHIVC372L45583').click();
  await page.getByRole('option', { name: 'Yes' }).click();
  await page.locator('[id="1621"] #doYouHaveAnyDependentChildrenC383L45584').click();
  await page.getByRole('option', { name: 'No' }).click();
  await page.getByRole('textbox', { name: 'howManyFathersOfTheChildrenC394L45585' }).click();
  await page.getByRole('textbox', { name: 'howManyFathersOfTheChildrenC394L45585' }).fill('1');
  await page.getByRole('textbox', { name: 'howManyMothersOfTheChildrenC3105L45586' }).click();
  await page.getByRole('textbox', { name: 'howManyMothersOfTheChildrenC3105L45586' }).fill('1');
  await page.getByRole('textbox', { name: 'notesC3116NL000002' }).click();
  await page.getByRole('textbox', { name: 'notesC3116NL000002' }).fill('family details notes');
  await page.getByTestId('historyOfSTIs').click();
  await page.locator('[id="1622"] input[name="otherSTIs"]').check();
  await page.getByRole('textbox', { name: 'notesC3198NL000003' }).click();
  await page.getByRole('textbox', { name: 'notesC3198NL000003' }).fill('testing');
  await page.getByTestId('sexualHistory').click();
  await page.locator('[id="1629"] input[name="sexuallyActive"]').check();
  await page.getByRole('textbox', { name: 'notesC34526NL000004' }).click();
  await page.getByRole('textbox', { name: 'notesC34526NL000004' }).fill('notes');
  await page.getByTestId('sexualPartnerHistory').click();
  await page.locator('[id="1630"] input[name="1LifetimeSP"]').check();
  await page.getByRole('textbox', { name: 'notesC36823NL000005' }).click();
  await page.getByRole('textbox', { name: 'notesC36823NL000005' }).fill('notes');
  await page.getByTestId('hIVTestHistory').click();
  await page.locator('[id="1623"] input[name="inRelationship"]').check();
  await page.getByRole('textbox', { name: 'notesC38214NL000006' }).click();
  await page.getByRole('textbox', { name: 'notesC38214NL000006' }).fill('notes');
  await page.getByTestId('whereTested').click();
  await page.locator('[id="1633"] input[name="bloodBank"]').check();
  await page.getByRole('textbox', { name: 'notesC310826NL000007' }).click();
  await page.getByRole('textbox', { name: 'notesC310826NL000007' }).fill('notes');
  await page.getByTestId('lifestyle').click();
  await page.locator('[id="1626"] #smokingStatusC31251L98766').click();
  await page.getByRole('option', { name: 'Never Smoked' }).click();
  await page.locator('[id="1626"] #substanceAbuseStatusC31262L98767').click();
  await page.getByRole('option', { name: 'No History Substance Abuse' }).click();
  await page.locator('[id="1626"] #everAttendedRehabilitationC31273L98768').click();
  await page.getByRole('option', { name: 'No' }).click();
  await page.getByRole('textbox', { name: 'detailsYearPlaceDiagnosisOutcomeC31284L98769' }).click();
  await page.getByRole('textbox', { name: 'detailsYearPlaceDiagnosisOutcomeC31284L98769' }).fill('test');
  await page.getByRole('textbox', { name: 'notesC31306NL987708' }).click();
  await page.getByRole('textbox', { name: 'notesC31306NL987708' }).fill('notes');
  await page.getByTestId('Next').click();
  await page.getByTestId('End').click();
  await page.getByTestId('Ok').click();
  await page.getByRole('button', { name: 'You are logged in as Manoj' }).click();
  await page.getByText('Logout').click();
    




   }
});
})



