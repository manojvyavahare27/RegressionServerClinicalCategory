//Sathyanarayan
 
const fs = require("fs");
const XLSX = require("xlsx");
const path = "C:/Riomed/Cellma4Automation";
const mysql = require("mysql");
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
import { toggleDivVisibility, clickOnRemoveCustomizableQuestion } from "../../../../../../UtilFiles/DynamicUtility";
 
 
// Array to store console logs
 
const consoleLogs = [];
let jsonData;
 
test.describe("Excel Conversion Diagnosis Category", () => {
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
 
test.describe("Diagnosis Category", () => {
  test("Add Diagnosis", async ({ page }) => {
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
      const diagnosis = new ClinicalSummary(page);
      const diagnosisExtraDetails = new ClinicalExtraDetails(page);
      const clinicalSummary=new ClinicalSummary(page)    
 
      const menu = new Menu(page);
      await page.goto(environment.Test);
      await loginpage.enterUsername(jsonData.loginDetails[0].username);
      logger.info("Username enter successfully");
      await loginpage.enter_Password(jsonData.loginDetails[0].password);
      logger.info("Password enter successfully");
      await loginpage.clickOnLogin();      
      logger.info("Clicked on Login button successfully");
      await homepage.clickOnHomeDashboardIcon()
      //await page.pause()
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
     
      await page.pause()
      await patientsearch.clickOnSearchPatientLink();
      await page.waitForTimeout(2000);
      await confirmexisting.clickOnConfirmExistingDetails();    
       await contacthistory.clickOnShowFilter()  
      await contacthistory.selectServiceFilter("General Medicine Automation");
      await contacthistory.selectContactReasonFilter("Assessments");
     // await contacthistory.enterContactDate("26/04/2024");
      await contacthistory.selectContactReason("Assessments");
      await contacthistory.selectContactLocation("Cardio Location");
      //await contacthistory.enterContactWith("Dr Sathya");
      await contacthistory.clickOnAddContact();      
      await diagnosis.selectCategoryFromList(jsonData.AddDiagnosis[index].pacr_category);
      await page.waitForTimeout(2000)
     
      //await page.pause()
 
       // await clinicalSummary.clickOnFavouritesCustView(jsonData.AddDiagnosis[index].remove_favourites)
         
      // await diagnosis.clickOnViewContactItemsMenu();
      // await diagnosis.clickOnPinContactItemsMenu();
      await diagnosis.selectCategoryFromList(jsonData.AddDiagnosis[index].pacr_category);
      await page.waitForTimeout(2000)
 
       ////////REVIEW EXISTING ITEM AND DELETE/////
 
       if(await diagnosis.checkItemOnHistoryTable(jsonData.AddDiagnosis[index].pacr_que_name)){
       // await diagnosis.clickOnItemReview(jsonData.AddDiagnosis[index].pacr_que_name);
        //console.log("Item reviewed before deleting");
        await diagnosis.clickOnItemEdit(jsonData.AddDiagnosis[index].pacr_que_name);
        await diagnosisExtraDetails.clickOnDelete();
        await diagnosisExtraDetails.clickOnConfirmDelete();
        await diagnosisExtraDetails.enterDeleteReason('Deleted Existing item');
        await diagnosisExtraDetails.clickOnSaveDeleteReason();
        await expect(page.getByText('Diagnosis deleted successfully')).toHaveText('Diagnosis deleted successfully')
 
        console.log('\x1bItem was deleted successfully\x1b[0m');
        }
 
        await page.waitForTimeout(2000)
 
 
       
       //////Fetch Patient Details/////////
      var sqlQuery =
      "select * from patient_audit where paa_use_username='" + jsonData.loginDetails[0].username +
      "' and paa_type='selected' order by 1 desc limit 1";
      var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
      var results = await executeQuery(sqlQuery, sqlFilePath);
      console.log("\n Patient Details stored into the database: \n", results);
      const patId = results[0].paa_pat_id;
      console.log("Patient Accessed by User:" + patId);
 
 
 
////////ADD NEW Diagnosis/////
 
     await page.waitForTimeout(2000);
      await diagnosis.selectandAddClinicalItem(jsonData.AddDiagnosis[index].pacr_que_name); //This searches item and clicks on add button
      await page.waitForTimeout(2000);   
      await page.getByLabel('cancelIcon').click();
      await diagnosis.selectandAddClinicalItem(jsonData.AddDiagnosis[index].pacr_que_name);
      //await diagnosisExtraDetails.clickOnClincialItemCollapsable();
      await page.waitForTimeout(1000);
 
     // await page.pause()
 
      // Customizable view
      // await contacthistory.clickOnSettingButton()      
      // await contacthistory.clickOnCustomizableView()
      // await page.pause()
      // await diagnosis.clickOnDeleteQuestion(jsonData.AddDiagnosis[index].question_name)
      // await page.waitForTimeout(1000)
      // await diagnosis.clickOnRestoreQuestion(jsonData.AddDiagnosis[index].question_name)
      // await page.waitForTimeout(1000)
      // await diagnosisExtraDetails.clickOnSave();
 
      // await page.waitForTimeout(2000)
      // await diagnosis.selectCategoryFromList(jsonData.AddDiagnosis[index].pacr_category);
      // await page.waitForTimeout(2000)
      // await diagnosis.selectandAddClinicalItem(jsonData.AddDiagnosis[index].pacr_que_name);
     //await diagnosis.checkItemOnHistoryTable(jsonData.AddDiagnosis[index].pacr_que_name)
 
 
      await diagnosisExtraDetails.selectClinicalItemSubcategory("Medical Diagnosis");
      await diagnosisExtraDetails.enterOnSetDate(jsonData.AddDiagnosis[index].diag_date_onset.toString());
      await diagnosisExtraDetails.enterDiagnosedDate(jsonData.AddDiagnosis[index].diag_date_diagnosed.toString());
      await diagnosisExtraDetails.enterDiagnosis1stSeenDate(jsonData.AddDiagnosis[index].diag_date_firstseen)
      await page.pause()
      await diagnosisExtraDetails.selectSeverity(jsonData.AddDiagnosis[index].diag_severity)
      //await diagnosisExtraDetails.selectStatus(jsonData.AddDiagnosis[index].diag_diagnosis_status)
     
     
      await diagnosisExtraDetails.selectActivity(jsonData.AddDiagnosis[index].diag_activity)
     // await diagnosisExtraDetails.searchAndSelectLinktoProcedure("Division of Left Knee Tendon, Open Approach")
      await diagnosisExtraDetails.selectCountryOfDiagnosis("India")
     // await diagnosisExtraDetails.searchAndSelectUnderlayingCause("Asthma")
      await page.waitForTimeout(1000)
      //await diagnosisExtraDetails.searchAndSelectComplicationsAndDiagnosis("Dengue haemorrhagic fever")
     // await diagnosisExtraDetails.searchAndSelectExternalCause("Abnormal findings on diagnostic imaging of other body structures")
     
      await page.getByRole('checkbox', { name: 'Private record' }).click()
      await page.getByRole('checkbox', { name: 'Set as default' }).click()
     // await diagnosisExtraDetails.selectFrequency("1");
      await diagnosisExtraDetails.enterClinicalItemNotes("Added Diagnosis Notes From Playwright");
      await diagnosisExtraDetails.clickOnSaveExtraDetails();
      //await page.pause()
      await page.waitForTimeout(500);
     // await page.getByTestId('Check All').click()
      //await page.getByLabel('saveChecklist').click()
      await expect(page.getByText("Diagnosis record added successfully")).toHaveText("Diagnosis record added successfully");
      //await expect(page.getByText(`${clinicaCatergory} Record Added Successfully`)).toHaveText(`${clinicaCatergory} Record Added Successfully`);
     
     
      ////// Database comparison- Patient Clinical Records - ADDING NEW Diagnosis/////////
      sqlQuery =
      "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, diag_date_onset, diag_date_firstseen, diag_date_diagnosed, diag_notes"+
      " from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join diagnosis on pacr_id=diag_pacr_id where pacr_record_status='approved'"+
      " and pacr_pat_id=" + patId +
      " and pacr_record_status='approved' and pacr_que_name='" + jsonData.AddDiagnosis[index].pacr_que_name +
      "' and pacr_category='diagnosis' order by 1 desc limit 1";
 
 
 
      //select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, diag_date_onset, diag_date_firstseen, diag_date_diagnosed, diag_notes from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join diagnosis on pacr_id=diag_pacr_id where pacr_record_status='approved' and pacrd_record_status='approved' and diag_record_status='approved' and pacr_pat_id='787755' and pacr_record_status='approved' and pacr_que_name='Dengue haemorrhagic fever' and pacr_category='diagnosis' order by 1 desc limit 1;
           
    sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    results = await executeQuery(sqlQuery, sqlFilePath);
    const pacrId = results[0].pacr_id;
    console.log("\n Patient Clinical Records stored into the database: \n", results);
    var match = await compareJsons(sqlFilePath, null, jsonData.AddDiagnosis[index]);
    if (match) {
      console.log("\n Patient Clinical Records Comparision adding new Diagnosis: Parameters from both JSON files match!\n");
    } else {
      console.log("\n Patient Clinical Records Comparision adding new Diagnosis: Parameters from both JSON files do not match!\n");
    }
 
    await diagnosis.toggleSearchSection(); //Close the search section
      await diagnosis.clickOnItemDiv(jsonData.EditDiagnosis[index].pacr_que_name);
      await diagnosis.clickOnItemEdit();
      //await diagnosisExtraDetails.clickOnClincialItemCollapsable();
      await diagnosisExtraDetails.selectClinicalItemSubcategory("Subsec Diagnosis");
      await diagnosisExtraDetails.enterOnSetDate(jsonData.EditDiagnosis[index].diag_date_onset.toString());
      await diagnosisExtraDetails.enterDiagnosedDate(jsonData.EditDiagnosis[index].diag_date_diagnosed.toString());
      await page.waitForTimeout(1500)
      await diagnosisExtraDetails.enterDiagnosis1stSeenDate(jsonData.EditDiagnosis[index].diag_date_firstseen)      
      //await diagnosisExtraDetails.selectStatus(jsonData.EditDiagnosis[index].diag_diagnosis_status)
      await diagnosisExtraDetails.selectSeverity(jsonData.EditDiagnosis[index].diag_severity)      
      await diagnosisExtraDetails.selectActivity(jsonData.EditDiagnosis[index].diag_activity)
 
 
      await diagnosisExtraDetails.enterClinicalItemNotes(
        "Updated Diagnosis Notes From Playwright"
      );

      await diagnosisExtraDetails.clickOnSaveExtraDetails();
      await page.waitForTimeout(500);
    //  await page.getByTestId('Check All').click()
    //  await page.getByLabel('saveChecklist').click()
      await page.waitForTimeout(1000);
      await expect(page.getByText('Diagnosis record updated successfully')).toHaveText('Diagnosis record updated successfully')
 
       ////// Database comparison - Patient Clinical Records - UPDATE Diagnosis/////////
     sqlQuery =
     "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, diag_date_firstseen, diag_date_diagnosed, diag_notes"+
     " from patient_clinical_records join patient_clinical_records_details"+
     " on pacr_id=pacrd_pacr_id join diagnosis on pacr_id=diag_pacr_id where pacr_record_status='approved'"+
     " and pacrd_record_status='approved' and diag_record_status='approved' and pacr_id=" + pacrId +
     " and pacr_record_status='approved'";
         
     console.log("Manoj:"+sqlQuery);
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);
 
   console.log("\n Patient Clinical Records stored into the database: \n", results);
   var match = await compareJsons(sqlFilePath, null, jsonData.EditDiagnosis[index]);
   if (match) {
     console.log(
       "\n Update Patient Clinical Records Comparision Edit Diagnosis: Parameters from both JSON files match!\n"
     );
   } else {
     console.log(
       "\n Update Patient Clinical Records Comparision Edit Diagnosis: Parameters from both JSON files do not match!\n"
     );
   }
 
   ////////AUTO UPDATE RISK AFTER UPDATING OUTCOME /////
      await diagnosis.clickOnItemHistory();
      await diagnosis.clickOnHistoryItemDiv();
      await page.waitForTimeout(500);
      await diagnosis.closeWindow();
      await page.waitForTimeout(500);
     
      // await diagnosis.clickOnItemReview();
      // await page.waitForTimeout(500);
      await diagnosis.clickOnItemHighlightNone();
      await page.waitForTimeout(500);
      await diagnosis.selectLowRiskLevel();
      await page.waitForTimeout(500);
      await diagnosis.selectModerateRiskLevel();
      await page.waitForTimeout(500);
      await diagnosis.selectHighRiskLevel();
      await page.waitForTimeout(500);
      await diagnosis.selectAllRiskLevel();
      await diagnosis.clickOnLevelTwoExtraDetails();
      await diagnosis.clickOnLevelThreeExtraDetails();
      await diagnosis.clickOnLevelOneExtraDetails();
 
 
      ////// Database comparison - Patient Clinical Records - UPDATE Diagnosis RISK/////////
     sqlQuery =
     "select pacr_risk from patient_clinical_records where pacr_id=" + pacrId;
         
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);
   if(results[0].pacr_risk == jsonData.EditDiagnosis[index].pacr_risk){
    console.log(
      "\n Patient Clinical Records Comparision for Edit Diagnosis Risk: RISK Updated Successfully! \n"
    );
   } else {
    console.log(
      "\n Patient Clinical Records Comparision for Edit Diagnosis Risk: RISK Update Failed! \n"
    );
  }
 
     ///////// Deleting Item ////////////
 
      await diagnosis.clickOnItemEdit();
      await diagnosisExtraDetails.clickOnDelete();
      await diagnosisExtraDetails.clickOnCancelDelete();
      await diagnosisExtraDetails.clickOnDelete();
      await diagnosisExtraDetails.clickOnConfirmDelete();
      await diagnosisExtraDetails.enterDeleteReason(jsonData.DeleteDiagnosis[index].pacr_delete_reason);
      await diagnosisExtraDetails.clickOnSaveDeleteReason();
      await page.waitForTimeout(1000)
      await expect(page.getByText('Diagnosis deleted successfully')).toHaveText('Diagnosis deleted successfully')
     // await page.pause();
 
       ////// Database comparison- Patient Clinical Records - DELETE OUTCOME/////////
       sqlQuery ="select pacr_que_name, pacr_delete_reason from patient_clinical_records where pacr_id=" +
       pacrId +
       " and pacr_record_status='wrong'";
 
     sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
     results = await executeQuery(sqlQuery, sqlFilePath);
     //  pacrId=results[0].pacr_id;
     console.log("\n Patient Details stored into the database: \n", results);
     var match = await compareJsons(
       sqlFilePath,
       null,
       jsonData.DeleteDiagnosis[index]
     );
     if (match) {
       console.log(
         "\n  Patient Clinical Records Comparision for Delete Diagnosis: Parameters from both JSON files match!\n"
       );
     } else {
       console.log(
         "\n  Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n"
       );
     }
     
 
     await page.pause();
      await diagnosis.clickOnCurrentItemsSection();
      await diagnosis.clickOnMigratedItemsSection();
      await diagnosis.clickOnDeletedItemsSection();
      await page.waitForTimeout(1000);
     await diagnosis.clickOnArchivedItemsSection();
      await diagnosis.clickOnAllItemsSection();
      //await diagnosis.toggleHistorySection(); // Close the history section
     
   
    }
  });
});
 