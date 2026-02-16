//Manoj

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
import CarePlanAddED from "../../../../../../Pages/ClinicalDomain/PatientSummary/Categories/CarePlan/CarePlanAddED";

import { TIMEOUT } from "dns";
import { error } from "console";
import { before } from "node:test";
import { toggleDivVisibility } from "../../../../../../UtilFiles/DynamicUtility";

// Array to store console logs

const consoleLogs = [];
let jsonData;

test.describe("Excel Conversion Care Plan Category", () => {
  test("Extract Patient Summary Details", async ({}) => {
    const excelFilePath =process.env.EXCEL_FILE_PATH || "./ExcelFiles/PatientSummary.xlsx";
    const jsonFilePath = "./TestDataWithJSON/PatientDomain/PatientSummary.json";

    console.log("excelFilePath:", excelFilePath);
    console.log("jsonFilePath:", jsonFilePath);
    const conversionSuccess = await convertExcelToJson(excelFilePath,jsonFilePath);
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

test.describe("Care Plan Category", () => {
  test("Care Plan Category", async ({ page }) => {
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
      const carePlan = new ClinicalSummary(page);
     // const overview=new 
      const carePlanExtraDetails = new ClinicalExtraDetails(page);

      const clinicalSummary = new ClinicalSummary(page);
      //const careplanadd=new CarePlanAddED(page)

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
      await homepage.clickOnSideIconPatient();
      logger.info("Clicked on Patient Icon successfully");
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
      await page.waitForTimeout(200);
      await confirmexisting.clickOnConfirmExistingDetails();
     
      //await page.pause()
      await page.waitForTimeout(3000);
     
      const alertPopup= await page.locator("xpath=//h2[text()='Alerts']").isVisible()      
      if(alertPopup==true)
        {       
          await carePlan.closePopUp()
        }
      await page.waitForTimeout(2000);
await page.waitForTimeout(2000);
      
      await page.waitForTimeout(2000);
      await contacthistory.clickOnShowFilter();
      await page.waitForTimeout(2000);
      await contacthistory.selectServiceFilter("General Medicine Automation");
      await contacthistory.selectContactReasonFilter("Assessments");
      //await contacthistory.enterContactDate("24-06-2024");
      await contacthistory.selectContactReason("Assessments");
      await contacthistory.selectContactLocation("Cardio Location");
      //await contacthistory.enterContactWith("Dr Sathya");
      //await page.pause();
      await page.waitForTimeout(2000);
      await contacthistory.clickOnAddContact();
      await carePlan.selectCategoryFromList(jsonData.AddCarePlan[index].pacr_category);
      await page.waitForTimeout(2000);

      await carePlan.clickOnViewContactItemsMenu();
      await carePlan.clickOnPinContactItemsMenu();
      await carePlan.selectCategoryFromList(jsonData.AddCarePlan[index].pacr_category);
      await page.waitForTimeout(2000);
      
      ////////REVIEW EXISTING ITEM AND DELETE/////

      if (await carePlan.checkItemOnHistoryTable(jsonData.AddCarePlan[index].pacr_que_name)
      ) {
        //await allergy.clickOnItemReview(jsonData.AddAllergy[index].pacr_que_name);
        //console.log("Item reviewed before deleting");
        await carePlan.clickOnItemEdit(jsonData.AddCarePlan[index].pacr_que_name);
        await carePlanExtraDetails.clickOnDelete();
        await carePlanExtraDetails.clickOnConfirmDelete();
        await carePlanExtraDetails.enterDeleteReason("Deleted Existing item");
        await carePlanExtraDetails.clickOnSaveDeleteReason();
        console.log("\x1bItem was deleted successfully\x1b[0m");
      }
      await page.waitForTimeout(2000);

      //////Fetch Patient Details/////////
      var sqlQuery ="select * from patient_audit where paa_use_username='" +jsonData.loginDetails[0].username + "' and paa_type='selected' order by 1 desc limit 1";
      var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
      var results = await executeQuery(sqlQuery, sqlFilePath);
      console.log("\n Patient Details stored into the database: \n", results);
      const patId = results[0].paa_pat_id;
      console.log("Patient Accessed by User:" + patId);

      ////////ADD NEW Care plan/////
      
     
      await carePlan.selectandAddClinicalItem(jsonData.AddCarePlan[index].pacr_que_name);       
     
      await carePlanExtraDetails.clickonSaveEDCarePlan();
      await expect(page.getByText('Nursing Diagnosis is required')).toHaveText('Nursing Diagnosis is required')
      await expect(page.getByText('Goal is required')).toHaveText('Goal is required')
      await expect(page.getByText('Intervention is required')).toHaveText('Intervention is required')
      await expect(page.getByText('Evaluation is required')).toHaveText('Evaluation is required')      
      await carePlanExtraDetails.searchAndSelectNursingDiagnosis(jsonData.AddCarePlan[index].carpd_que_name);
      await carePlanExtraDetails.EntersearchNursingDiagnosis0(jsonData.AddCarePlan[index].carpd_notes_nursingDiagnosis)
      await carePlanExtraDetails.searchAndSelectSearchGoals(jsonData.AddCarePlan[index].carpd_eli_text_goals);
      await carePlanExtraDetails.EntersearchGoals0(jsonData.AddCarePlan[index].carpd_notes_goals);     
      await carePlanExtraDetails.searchAndSelectInterventions(jsonData.AddCarePlan[index].carpd_eli_text_interventions);
      await carePlanExtraDetails.EnterInterventions(jsonData.AddCarePlan[index].carpd_notes_interventions);
     
      await carePlanExtraDetails.searchAndSelectsearchEvaluations(jsonData.AddCarePlan[index].carpd_eli_text_evaluations);
      await carePlanExtraDetails.EnterEvaluations(jsonData.AddCarePlan[index].carpd_notes_evaluations);
      await carePlanExtraDetails.EnterUpdateNotes(jsonData.AddCarePlan[index].carpd_type_notes);
      await carePlanExtraDetails.clickonSaveEDCarePlan();
      await expect(page.getByText('Care Plans record added successfully')).toHaveText('Care Plans record added successfully')      
           

      sqlQuery =
      " select carpd_que_name,carpd_pacr_id, carpd_eli_text, carpd_notes from care_plan_details where carpd_pat_id="+patId+" and carpd_record_status='approved';"


        // "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk,  alrg_start_date, alrg_end_date, alrg_notes" +
        // " from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join allergies on pacr_id=alrg_pacr_id where pacr_record_status='approved'" +
        // " and pacr_pat_id=" +
        // patId +
        // " and pacrd_record_status='approved' and alrg_record_status='approved' and pacr_que_name='" +
        // jsonData.AddAllergy[index].pacr_que_name +
        // "' and pacr_category='allergies' order by 1 desc limit 1";
       
      console.log(sqlQuery);
      //select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, diag_date_onset, diag_date_firstseen, diag_date_diagnosed, diag_notes from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join diagnosis on pacr_id=diag_pacr_id where pacr_record_status='approved' and pacrd_record_status='approved' and diag_record_status='approved' and pacr_pat_id='787755' and pacr_record_status='approved' and pacr_que_name='Dengue haemorrhagic fever' and pacr_category='diagnosis' order by 1 desc limit 1;

      sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
      results = await executeQuery(sqlQuery, sqlFilePath);
      const pacrId = results[0].carpd_pacr_id;
      console.log("\n Patient Clinical Records stored into the database: \n",results);
      var match = await compareJsons(sqlFilePath,null,jsonData.AddAllergy[index]);
      if (match) {
        console.log("\n Patient Clinical Records Comparision adding new Allergy: Parameters from both JSON files match!\n");
      } else {
        console.log("\n Patient Clinical Records Comparision adding new Allergy: Parameters from both JSON files do not match!\n");
      }
     
      await carePlan.toggleSearchSection(); //Close the search section

      await carePlan.clickOnItemDiv(jsonData.EditCarePlan[index].pacr_que_name);
      await carePlan.clickOnItemEdit();
      await page.waitForTimeout(1000);
      await page.locator("xpath=//button[@aria-label='cancelIcon']").click();
      await page.waitForTimeout(1000);
      await carePlan.clickOnItemEdit();
      
      await page.waitForTimeout(500);
      
      await carePlanExtraDetails.EntersearchNursingDiagnosis0(jsonData.EditCarePlan[index].carpd_notes_nursingDiagnosis)     
      await carePlanExtraDetails.EntersearchGoals0(jsonData.EditCarePlan[index].carpd_notes_goals);       
      await carePlanExtraDetails.EnterInterventions(jsonData.EditCarePlan[index].carpd_notes_interventions);
            
      await carePlanExtraDetails.EnterEvaluations(jsonData.EditCarePlan[index].carpd_notes_evaluations);
      await carePlanExtraDetails.EnterUpdateNotes(jsonData.EditCarePlan[index].carpd_type_notes);
      
      await carePlanExtraDetails.clickOnSaveEdCarePlan();
      await expect(page.getByText('Care Plans record updated successfully')).toHaveText('Care Plans record updated successfully')      
      

      ////// Database comparison - Patient Clinical Records - UPDATE Allergy/////////
      // sqlQuery =
      //   "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk,  alrg_notes" +
      //   " from patient_clinical_records join patient_clinical_records_details" +
      //   " on pacr_id=pacrd_pacr_id join allergies on pacr_id=alrg_pacr_id where pacr_record_status='approved'" +
      //   " and pacrd_record_status='approved' and alrg_record_status='approved' and pacr_id=" +
      //   pacrId +
      //   " and pacr_record_status='approved'";

      // console.log("Manoj:" + sqlQuery);
      // sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
      // results = await executeQuery(sqlQuery, sqlFilePath);

      // console.log("\n Patient Clinical Records stored into the database: \n", results);
      // var match = await compareJsons(sqlFilePath,null,jsonData.EditAllergy[index]);
      // if (match) {
      //   console.log("\n Update Patient Clinical Records Comparision Edit Allergy: Parameters from both JSON files match!\n");
      // } else {
      //   console.log("\n Update Patient Clinical Records Comparision Edit Allergy: Parameters from both JSON files do not match!\n");
      // }

      
      await carePlan.clickOnItemHighlightNone();
      await page.waitForTimeout(500);
      await carePlan.selectLowRiskLevel();
      await page.waitForTimeout(500);
      await carePlan.selectModerateRiskLevel();
      await page.waitForTimeout(500);
      await carePlan.selectHighRiskLevel();
      await page.waitForTimeout(500);
      await carePlan.selectAllRiskLevel();
      await carePlan.clickOnLevelTwoExtraDetails();
     // await carePlan.clickOnLevelThreeExtraDetails();
      await carePlan.clickOnLevelOneExtraDetails();

      ////// Database comparison - Patient Clinical Records - UPDATE Allergy RISK/////////
      // sqlQuery ="select pacr_risk from patient_clinical_records where pacr_id=" + pacrId;

      // sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
      // results = await executeQuery(sqlQuery, sqlFilePath);
      // if (results[0].pacr_risk == jsonData.EditAllergy[index].pacr_risk) {
      //   console.log("\n Patient Clinical Records Comparision for Edit Allergy Risk: RISK Updated Successfully! \n");
      // } else {
      //   console.log("\n Patient Clinical Records Comparision for Edit Allergy Risk: RISK Update Failed! \n");
      // }

      ///////// Deleting Item ////////////

      await carePlan.clickOnItemEdit();
      await carePlanExtraDetails.clickOnDelete();
      await carePlanExtraDetails.clickOnCancelDelete();
      await carePlanExtraDetails.clickOnDelete();
      await carePlanExtraDetails.clickOnConfirmDelete();
      await carePlanExtraDetails.enterDeleteReason(jsonData.DeleteAllergy[index].pacr_delete_reason);
      await carePlanExtraDetails.clickOnSaveDeleteReason();
      await page.waitForTimeout(1000);

      ////// Database comparison- Patient Clinical Records - DELETE OUTCOME/////////
      // sqlQuery ="select pacr_que_name, pacr_delete_reason from patient_clinical_records where pacr_id=" + pacrId +
      //   " and pacr_record_status='wrong'";

      // sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
      // results = await executeQuery(sqlQuery, sqlFilePath);
      // //  pacrId=results[0].pacr_id;
      // console.log("\n Patient Details stored into the database: \n", results);
      // var match = await compareJsons(sqlFilePath, null, jsonData.DeleteAllergy[index]
      // );
      // if (match) {
      //   console.log("\n  Patient Clinical Records Comparision for Delete Allergy: Parameters from both JSON files match!\n");
      // } else {
      //   console.log("\n  Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n");
      // }

       //await carePlan.clickOnCurrentItemsSection();
      //  await carePlan.showClinicalItemByStatusforCarePlan();
      // await carePlan.clickOnDeletedItemsSectionCarePlan();
      await page.waitForTimeout(1000);
      // await diagnosis.clickOnArchivedItemsSection();
      //await carePlan.clickOnAllItemsSection();
      //await allergy.toggleHistorySection(); // Close the history section

     
    }
  });
});
