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

test.describe("Excel Conversion Interpretations Category", () => {
  test("Extract Patient Summary Details", async ({}) => {
    const excelFilePath =
      process.env.EXCEL_FILE_PATH || "./ExcelFiles/PatientSummary.xlsx";
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

test.describe("Interpretations Category", () => {
  test("Add Interpretations", async ({ page }) => {
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
      const Interpretations = new ClinicalSummary(page);
      const InterpretationsExtraDetails = new ClinicalExtraDetails(page);
      

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
     
      await patientsearch.enterFamilyName(data.pat_surname);
      logger.info("Family Name entered successfully");
      //await patientsearch.selectSex(data.pat_sex);

      await patientsearch.selectBornDate(jsonData.PatientDetails[index].pat_dob);
      await patientsearch.clickOnSearchButton();
      await patientsearch.clickOnSearchPatientLink();
      await page.waitForTimeout(1500);
      await confirmexisting.clickOnConfirmExistingDetails();  
      await page.waitForTimeout(4000);
 await page.pause()
      const alertPopup = page.locator("xpath=//h2[text()='Alerts']");
      if (await alertPopup.isVisible()) {
         const cancelButton = page.locator("xpath=//button[@aria-label='cancelIcon']");
          await cancelButton.waitFor({ state: 'visible', timeout: 5000 });
          await cancelButton.click();
        }
      await page.waitForTimeout(2000);

       await contacthistory.clickOnShowFilter()
      await contacthistory.selectServiceFilter("General Medicine Automation");
      await contacthistory.selectContactReasonFilter("Assessments");
      //await contacthistory.enterContactDate("26/04/2024");
      await contacthistory.selectContactReason("Assessments");
      await contacthistory.selectContactLocation("Cardio Location");
      //await contacthistory.enterContactWith("Dr Sathya");
      await contacthistory.clickOnAddContact();
      await Interpretations.clickOnViewContactItemsMenu();
      await Interpretations.clickOnPinContactItemsMenu();
      await Interpretations.selectCategoryFromList("Interpretations");
      await page.waitForTimeout(2000)       
       ////////REVIEW EXISTING ITEM AND DELETE/////
       if(await Interpretations.checkItemOnHistoryTable(jsonData.AddInterpretation[index].pacr_que_name)){
        await Interpretations.clickOnItemReview(jsonData.AddInterpretation[index].pacr_que_name);
        console.log("Item reviewed before deleting");
        await Interpretations.clickOnItemEdit(jsonData.AddInterpretation[index].pacr_que_name);
        await InterpretationsExtraDetails.clickOnDelete();
        await InterpretationsExtraDetails.clickOnConfirmDelete();
        await InterpretationsExtraDetails.enterDeleteReason('Deleted Existing item');
        await InterpretationsExtraDetails.clickOnSaveDeleteReason();
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

////////ADD NEW Interpretations/////
await page.pause()
      await Interpretations.selectandAddClinicalItem(jsonData.AddInterpretation[index].pacr_que_name); //This searches item and clicks on add button
      await page.waitForTimeout(2000);      
      //await InterpretationsExtraDetails.clickOnClincialItemCollapsable();
      //await page.waitForTimeout(1000);
       await Interpretations.handleSubCategoryPopup(page) 
      await page.getByLabel('cancelIcon').click();
      await Interpretations.selectandAddClinicalItem(jsonData.AddInterpretation[index].pacr_que_name); //This searches item and clicks on add button
      await page.waitForTimeout(2000);  
      //await InterpretationsExtraDetails.selectClinicalItemSubcategory(jsonData.AddInterpretation[index].eli_text);
      await InterpretationsExtraDetails.enterInterpretationOutcome(jsonData.AddInterpretation[index].inte_outcome_eli_text);
      await page.waitForTimeout(500)
      
      await page.getByRole('checkbox', { name: 'Private record' }).click()
      //await page.getByRole('checkbox', { name: 'Set as default' }).click()
    
      await InterpretationsExtraDetails.enterInterpretationNotes(jsonData.AddInterpretation[index].inte_notes);
      await page.pause()
      await InterpretationsExtraDetails.clickOnSaveExtraDetails();
      //await page.getByLabel('saveChecklist').click()
     // await page.waitForTimeout(1000);
      await expect(page.getByText("Interpretation record added successfully")).toHaveText("Interpretation record added successfully");
      //await expect(page.getByText(`${clinicaCatergory} Record Added Successfully`)).toHaveText(`${clinicaCatergory} Record Added Successfully`); 
     
      ////// Database comparison- Patient Clinical Records - ADDING NEW Interpretations/////////
      sqlQuery =
      "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk,inte_outcome_eli_text, inte_notes"+
      " from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join Interpretations on pacr_id=inte_pacr_id where pacr_record_status='approved'"+
      " and pacr_pat_id=" + patId +
      " and pacr_record_status='approved' and pacr_que_name='" + jsonData.AddInterpretation[index].pacr_que_name +
      "' and pacr_category='interpretation' order by 1 desc limit 1";


    console.log("Manoj add interpretation:  "+ sqlQuery);
           
    sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    results = await executeQuery(sqlQuery, sqlFilePath);
    const pacrId = results[0].pacr_id;
    console.log("\n Patient Clinical Records stored into the database: \n", results);
    var match = await compareJsons(sqlFilePath, null, jsonData.AddInterpretation[index]);
    if (match) {
      console.log("\n Patient Clinical Records Comparision adding new Interpretations: Parameters from both JSON files match!\n");
    } else {
      console.log("\n Patient Clinical Records Comparision adding new Interpretations: Parameters from both JSON files do not match!\n");
    }
   
    await Interpretations.toggleSearchSection(); //Close the search section
      
      await Interpretations.clickOnItemDiv(jsonData.EditInterpretation[index].pacr_que_name);
      await Interpretations.clickOnItemEdit();
      await page.waitForTimeout(2000);
     // await InterpretationsExtraDetails.clickOnClincialItemCollapsable();
     // await InterpretationsExtraDetails.selectClinicalItemSubcategory(jsonData.EditInterpretation[index].eli_text);
      await InterpretationsExtraDetails.enterInterpretationOutcome(jsonData.EditInterpretation[index].inte_outcome_eli_text);      
      await InterpretationsExtraDetails.enterInterpretationNotes(jsonData.EditInterpretation[index].inte_notes);
      await InterpretationsExtraDetails.clickOnSaveExtraDetails();
      await expect(page.getByText("Interpretation record updated successfully")).toHaveText("Interpretation record updated successfully");
      await page.waitForTimeout(1000);

       ////// Database comparison - Patient Clinical Records - UPDATE Interpretations/////////
     sqlQuery =
     "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk,inte_outcome_eli_text, inte_notes"+
     " from patient_clinical_records join patient_clinical_records_details"+
     " on pacr_id=pacrd_pacr_id join Interpretations on pacr_id=inte_pacr_id where pacr_record_status='approved'"+
     " and pacrd_record_status='approved' and inte_record_status='approved' and pacr_id=" + pacrId +
     " and pacr_record_status='approved'";
          
     console.log("Manoj Edit query:"+sqlQuery);
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);

   console.log("\n Patient Clinical Records stored into the database: \n", results);
   var match = await compareJsons(sqlFilePath, null, jsonData.EditInterpretation[index]);
   if (match) {
     console.log("\n Update Patient Clinical Records Comparision Edit Interpretations: Parameters from both JSON files match!\n");
   } else {
     console.log("\n Update Patient Clinical Records Comparision Edit Interpretations: Parameters from both JSON files do not match!\n");
   }

   ////////AUTO UPDATE RISK AFTER UPDATING OUTCOME /////
      await Interpretations.clickOnItemHistory();
      await Interpretations.clickOnHistoryItemDiv();
      await page.waitForTimeout(500);
      await Interpretations.closeWindow();
      await page.waitForTimeout(500);
     
     
      // await page.waitForTimeout(500);
      await Interpretations.clickOnItemHighlightNone();
      await page.waitForTimeout(500);
      await Interpretations.selectLowRiskLevel();
      await page.waitForTimeout(500);
      await Interpretations.selectModerateRiskLevel();
      await page.waitForTimeout(500);
      await Interpretations.selectHighRiskLevel();
      await page.waitForTimeout(500);
      await Interpretations.selectAllRiskLevel();
      await Interpretations.clickOnLevelTwoExtraDetails();
     // await Interpretations.clickOnLevelThreeExtraDetails();
      await Interpretations.clickOnLevelOneExtraDetails();


      ////// Database comparison - Patient Clinical Records - UPDATE Interpretations RISK/////////
     sqlQuery =
     "select pacr_risk from patient_clinical_records where pacr_id=" + pacrId;
          
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);
   if(results[0].pacr_risk == jsonData.EditInterpretation[index].pacr_risk){
    console.log("\n Patient Clinical Records Comparision for Edit Interpretations Risk: RISK Updated Successfully! \n");
   } else {
    console.log("\n Patient Clinical Records Comparision for Edit Interpretations Risk: RISK Update Failed! \n");
  }

     ///////// Deleting Item ////////////

      await Interpretations.clickOnItemEdit();
      await InterpretationsExtraDetails.clickOnDelete();
      await InterpretationsExtraDetails.clickOnCancelDelete();
      await InterpretationsExtraDetails.clickOnDelete();
      await InterpretationsExtraDetails.clickOnConfirmDelete();
      await InterpretationsExtraDetails.enterDeleteReason(jsonData.DeleteInterpretation[index].pacr_delete_reason);
     
      await InterpretationsExtraDetails.clickOnSaveDeleteReason();
      await expect(page.getByText('Interpretation deleted successfully')).toHaveText('Interpretation deleted successfully')

      await page.waitForTimeout(1000)    

       ////// Database comparison- Patient Clinical Records - DELETE OUTCOME/////////
       sqlQuery ="select pacr_que_name, pacr_delete_reason from patient_clinical_records where pacr_id=" +
       pacrId + " and pacr_record_status='wrong'";

     sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
     results = await executeQuery(sqlQuery, sqlFilePath);
     //  pacrId=results[0].pacr_id;
     console.log("\n Patient Details stored into the database: \n", results);
     var match = await compareJsons(sqlFilePath, null, jsonData.DeleteInterpretation[index]);
     if (match) {
       console.log("\n  Patient Clinical Records Comparision for Delete Interpretations: Parameters from both JSON files match!\n");
     } else {
       console.log("\n  Patient Clinical Records Comparision for Delete Interpretations: Parameters from both JSON files do not match!\n");
     }   
     //await page.pause();     
      await Interpretations.clickOnMigratedItemsSection();
      await Interpretations.clickOnDeletedItemsSection();
      await page.waitForTimeout(1000);
      await Interpretations.clickOnArchivedItemsSection();
      //await Interpretations.clickOnAllItemsSection();
      //await Interpretations.toggleHistorySection(); // Close the history section
   
     // await page.pause();
    }
  });
});
