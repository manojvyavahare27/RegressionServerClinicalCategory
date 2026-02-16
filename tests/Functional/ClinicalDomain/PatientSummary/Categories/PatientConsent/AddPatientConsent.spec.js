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
import ConsentPage from "../../../../../../Pages/ClinicalDomain/PatientSummary/Categories/PatientConsent/PatientConsent";
import ExtraDetails from "../../../../../../Pages/ClinicalDomain/PatientSummary/ClinicalExtraDetails";

// Array to store console logs

const consoleLogs = [];
let jsonData;

test.describe("Excel Conversion Device Category", () => {
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

test.describe("Patient Consent Category", () => {
    test("Add, Edit, Delete New Patient Consent", async ({ page }) => {
        if (!jsonData || !jsonData.DevicePatientDetails) {
        throw new Error("JSON data is missing or invalid.");
        }
        let index = 0;
        for (const data of jsonData.DevicePatientDetails) {
            const loginpage = new LoginPage(page);
            const homepage = new Homepage(page);
            const environment = new Environment(page);
            const confirmexisting = new ConfirmExisting(page);
            const contacthistory = new ContactHistory(page);
            const patientsearch = new PatientSearch(page);
            const SummaryPage = new ClinicalSummary(page);
            const consentPage = new ConsentPage(page);
            const ExtraDetailsPage = new ExtraDetails(page);

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
           /// await patientsearch.selectSexAtBirth(data.pat_sex);
            await patientsearch.selectBornDate(data.pat_dob);
            //await patientsearch.selectBornDate(formattedDate);
            await patientsearch.clickOnSearchButton();
            await patientsearch.clickOnSearchPatientLink();
            //await page.waitForTimeout(4000);
            //page.waitForSelector("xpath=//button[@data-testid='Confirm Existing Details']");
            await confirmexisting.btn_confirmExistingDetails.waitFor();
            await page.waitForTimeout(1000);
            await confirmexisting.clickOnConfirmExistingDetails();
            await page.waitForTimeout(5000)
            
            const alert = await page.getByRole('heading', { name: 'Alerts', exact: true }).isVisible()
            if (alert) {
              await ExtraDetailsPage.clickPopup();
            }

            await SummaryPage.clickOnDropdownAddToo();
            await SummaryPage.clickOnPatientConsent();

            const isVisible = await page.locator("xpath=//button[@aria-label='editIcon']").isVisible()
            while (isVisible) {
              await consentPage.clickOnDeleteButton();
              await page.getByTestId('Ok').click();
            }

            //Document upload through playwright still does not function correctly on this page
            //Please note document upload on Cellma itself functions correctly

            // await consentPage.fillConsentGivenBy(jsonData.AddPatientConsent[index].pac_consent_given_by);
            // await consentPage.fillConsentType(jsonData.AddPatientConsent[index].pac_consent_type);
            // await consentPage.fillConsentStatus(jsonData.AddPatientConsent[index].pac_consent_status);
            // await consentPage.fillStartDate(jsonData.AddPatientConsent[index].pac_consent_start);
            // await consentPage.fillEndDate(jsonData.AddPatientConsent[index].pac_consent_end);
            // await page.pause()
            // //await consentPage.clickChooseFile();
            // //const fileInput = page.getByTestId('Choose File1');
            // //const fileInput = page.locator("xpath=//button[@aria-label='Choose File']")
            // //const fileInput = page.locator("xpath=//div[@class='MuiGrid2-root MuiGrid2-direction-xs-row css-ir5opl']//input[@aria-label='button']");
            // //const fileInput = page.locator('input[type="file"]');
            // const fileInput = page.locator("xpath=//div[@class='MuiGrid2-root MuiGrid2-direction-xs-row css-ir5opl']//h1[@class='MuiTypography-root MuiTypography-h5 css-1umivoh'][normalize-space()='No file chosen']");
            // const filePath = "../Cellma4ClinicalAuto/UploadFiles/dummy.png";        
            // await fileInput.setInputFiles(filePath);
            // await page.getByTestId('Add additional documents').click();
            // await page.getByTestId('Add additional documents').setInputFiles('dummy.pdf');
            // await consentPage.fillNotes(jsonData.AddPatientConsent[index].pac_notes);
            // await consentPage.checkCheckboxConsent();
            // await page.pause()
            // await consentPage.clickGiveConsent();

            await consentPage.clickCompleteConsent()
            await consentPage.fillConsentGivenBy(jsonData.AddPatientConsent[index].pac_consent_given_by);
            await consentPage.fillConsentType(jsonData.AddPatientConsent[index].pac_consent_type);
            await consentPage.fillConsentStatus(jsonData.AddPatientConsent[index].pac_consent_status);
            await consentPage.fillStartDate(jsonData.AddPatientConsent[index].pac_consent_start);
            await consentPage.fillEndDate(jsonData.AddPatientConsent[index].pac_consent_end);
            // Enter Patient Details Section
            await consentPage.clickPatientDetails()
            await consentPage.fillSpecialRequirements(jsonData.AddPatientConsent[index].pac_special_requirement)
            await consentPage.fillMedicalTermExplanation(jsonData.AddPatientConsent[index].pac_medical_term)
            // Enter Statement of Health Professional Section
            await consentPage.clickStatementOfHealth()
            await consentPage.fillIntendedBenefits(jsonData.AddPatientConsent[index].pac_intended_benefits)
            await consentPage.fillFrequentlyOccurringRisks(jsonData.AddPatientConsent[index].pac_frequent_risks)
            await consentPage.checkBloodTransfusion()
            await consentPage.fillBloodTransfusion(jsonData.AddPatientConsent[index].pac_blood_transfusion)
            await consentPage.checkOtherProcedures()
            await consentPage.fillProcedureDetails(jsonData.AddPatientConsent[index].pac_procedures)
            await consentPage.checkFollowingInformation()
            await consentPage.fillRiskDetails(jsonData.AddPatientConsent[index].pac_risks)


            await consentPage.clickStatementOfInterpreter()
            await consentPage.clickStatementOfParent()
            await consentPage.clickConfirmationOfConsent()            

            await consentPage.fillNotes(jsonData.AddPatientConsent[index].pac_notes);
            await consentPage.checkCheckboxConsent();
            await consentPage.clickGiveConsent(); //Enable when finished testing

            //////////////////Fetch Patient Details//////////////////
            var sqlQuery =
              "select * from patient_audit where paa_use_username='" +
              jsonData.loginDetails[0].username +
              "' and paa_type='selected' order by 1 desc limit 1";
            var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
            var results = await executeQuery(sqlQuery, sqlFilePath);
            console.log("\n Patient Details stored into the database: \n", results);
            const patId = results[0].paa_pat_id;
            console.log("Patient Accessed by User:" + patId);

            ///////// Database comparison- Patient Consent Records - ADDING NEW Consent from patient /////////
            sqlQuery =
            "SELECT pac_id, pac_consent_given_by, pac_consent_type, pac_consent_status, pac_consent_start, pac_consent_end, pac_notes, pac_consent_details_json "+
            "FROM patient_consent "+
            "WHERE pac_pat_id = " + patId +
            " and pac_record_status = 'approved' "+
            "ORDER BY 1 DESC LIMIT 1";

            console.log("Add New Patient Consent:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientConsent.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            
            console.log(
              "\n Patient Consent record stored into the database: \n",
              results
            );
            var match = await compareJsons(
              sqlFilePath,
              null,
              jsonData.AddPatientConsent[index]
            );
            if (match) {
              console.log(
                "\n Patient - Add new patient consent: Parameters from both JSON files match!\n"
              );
            } else {
              console.log(
                "\n Patient - Add new patient: Parameters from both JSON files do not match!\n"
              );
            }
            await page.waitForTimeout(5000);

            //Edit Consent
            await consentPage.clickOnEditButton()
            await consentPage.fillConsentStatus(jsonData.EditPatientConsent[index].pac_consent_status_input);
            await consentPage.fillEndDate(jsonData.EditPatientConsent[index].pac_consent_end);
            // Enter Patient Details Section
            await consentPage.clickPatientDetails()
            await consentPage.fillSpecialRequirements(jsonData.EditPatientConsent[index].pac_special_requirement)
            await consentPage.fillMedicalTermExplanation(jsonData.EditPatientConsent[index].pac_medical_term)
            // Enter Statement of Health Professional Section
            await consentPage.clickStatementOfHealth()
            await consentPage.fillIntendedBenefits(jsonData.EditPatientConsent[index].pac_intended_benefits)
            await consentPage.fillFrequentlyOccurringRisks(jsonData.EditPatientConsent[index].pac_frequent_risks)
            await consentPage.checkBloodTransfusion()
            await consentPage.fillBloodTransfusion(jsonData.EditPatientConsent[index].pac_blood_transfusion)
            await consentPage.checkOtherProcedures()
            await consentPage.fillProcedureDetails(jsonData.EditPatientConsent[index].pac_procedures)
            await consentPage.checkFollowingInformation()
            await consentPage.fillRiskDetails(jsonData.EditPatientConsent[index].pac_risks)

            await consentPage.clickStatementOfInterpreter()
            await consentPage.clickStatementOfParent()
            await consentPage.clickConfirmationOfConsent()

            await consentPage.clickWithdrawConsent()
            await consentPage.fillWithdrawDate(jsonData.EditPatientConsent[index].pac_withdraw_date)
            await consentPage.checkWithdrawConsent()

            await consentPage.fillNotes(jsonData.EditPatientConsent[index].pac_notes);
            await consentPage.checkCheckboxConsent();
            await consentPage.clickWithdrawConsentBtn();

            ///////// Database comparison- Patient Consent Records - Editing Consent from patient /////////
            sqlQuery =
            "SELECT pac_id, pac_consent_given_by, pac_consent_type, pac_consent_status, pac_consent_start, pac_consent_end, pac_withdraw_date, pac_notes, pac_consent_details_json "+
            "FROM patient_consent "+
            "WHERE pac_pat_id = " + patId +
            " and pac_record_status = 'approved'"+
            " ORDER BY 1 DESC LIMIT 1";

            console.log("Edit Patient Consent:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientConsent.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            const pacId = results[0].pac_id;
            console.log(
              "\n Patient Consent record stored into the database: \n",
              results
            );
            var match = await compareJsons(
              sqlFilePath,
              null,
              jsonData.EditPatientConsent[index]
            );
            if (match) {
              console.log(
                "\n Patient - Edit patient consent: Parameters from both JSON files match!\n"
              );
            } else {
              console.log(
                "\n Patient - Edit patient consent: Parameters from both JSON files do not match!\n"
              );
            }
            await page.waitForTimeout(5000);

            //Delete consent
            await consentPage.clickOnDeleteButton();
            await page.getByTestId('Ok').click();

            //await page.pause()
            ///////// Database comparison- Patient Consent Records - Deleting Consent from patient /////////
            sqlQuery =
            "SELECT pac_id, pac_consent_given_by, pac_consent_type, pac_consent_status, pac_consent_start, pac_consent_end, pac_withdraw_date, pac_notes, pac_record_status, pac_deleted "+
            "FROM patient_consent "+
            "WHERE pac_pat_id = " + patId +
            " and pac_record_status = 'wrong' and pac_id = " + pacId +
            " ORDER BY 1 DESC LIMIT 1";

            console.log("Delete Patient Consent:  " + sqlQuery);
            sqlFilePath = "SQLResults/ClinicalDomain/PatientConsent.json";
            results = await executeQuery(sqlQuery, sqlFilePath);
            console.log(
              "\n Patient Consent record deleted from the database: \n",
              results
            );
            var match = await compareJsons(
              sqlFilePath,
              null,
              jsonData.EditPatientConsent[index]
            );
            if (match) {
              console.log(
                "\n Patient - Delete patient consent: Parameters from both JSON files match!\n"
              );
            } else {
              console.log(
                "\n Patient - Delete patient consent: Parameters from both JSON files do not match!\n"
              );
            }
            await page.waitForTimeout(5000);
        }
    });
});