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


import { TIMEOUT } from "dns";
import { error } from "console";
import { before } from "node:test";
import { toggleDivVisibility } from "../../../../../../UtilFiles/DynamicUtility";

// Array to store console logs

const consoleLogs = [];
let jsonData;

test.describe("Excel Conversion condition Category", () => {
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


test.describe("condition Category", () => {
  test("Add condition", async ({ page }) => {
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
      const condition = new ClinicalSummary(page);
      const conditionExtraDetails = new ClinicalExtraDetails(page);
      const clinicalSummary=new ClinicalSummary(page)
      

      const menu = new Menu(page);
      await page.goto(environment.Test);
      await loginpage.enterUsername(jsonData.loginDetails[0].username);
      logger.info("Username enter successfully");
      await loginpage.enter_Password(jsonData.loginDetails[0].password);
      logger.info("Password enter successfully");
      await loginpage.clickOnLogin();      
      logger.info("Clicked on Login button successfully");
     // await homepage.clickOnHomeDashboardIcon()
     
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
         
      await patientsearch.clickOnSearchPatientLink();
      await page.waitForTimeout(1500);
      await confirmexisting.clickOnConfirmExistingDetails();   

      await page.waitForTimeout(5000);
      const alertPopup= await page.locator("xpath=//h2[text()='Alerts']").isVisible()      
      if(alertPopup==true)
        {       
          await condition.closePopUp()
        }
      await page.waitForTimeout(2000);
      
       await contacthistory.clickOnShowFilter()  
      await contacthistory.selectServiceFilter("General Medicine Automation");
      await contacthistory.selectContactReasonFilter("Assessments");     
      await contacthistory.selectContactReason("Assessments");
      await contacthistory.selectContactLocation("Cardio Location");     
    
      await contacthistory.clickOnAddContact();      
       await condition.selectCategoryFromList(jsonData.AddCondition[index].pacr_category);
       await page.waitForTimeout(2000)       

      await condition.clickOnViewContactItemsMenu();
      await condition.clickOnPinContactItemsMenu();
    
      await condition.selectCategoryFromList(jsonData.AddCondition[index].pacr_category);
      await page.waitForTimeout(2000)
      
       ////////REVIEW EXISTING ITEM AND DELETE/////
       if(await condition.checkItemOnHistoryTable(jsonData.AddCondition[index].pacr_que_name)){
        //await condition.clickOnItemReview(jsonData.Addcondition[index].pacr_que_name);
        //console.log("Item reviewed before deleting");
        await condition.clickOnItemEdit(jsonData.AddCondition[index].pacr_que_name);
        await conditionExtraDetails.clickOnDelete();
        await conditionExtraDetails.clickOnConfirmDelete();
        await conditionExtraDetails.enterDeleteReason('Deleted Existing item');
        await conditionExtraDetails.clickOnSaveDeleteReason();
        console.log('\x1bItem was deleted successfully\x1b[0m');
        }
        await page.waitForTimeout(2000)

      
       
       //////Fetch Patient Details/////////
      var sqlQuery =
      "select * from patient_audit where paa_use_username='" + jsonData.loginDetails[0].username + 
      "' and paa_type='selected' order by 1 desc limit 1";

      console.log(sqlQuery);
      
      var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
      var results = await executeQuery(sqlQuery, sqlFilePath);
      console.log("\n Patient Details stored into the database: \n", results);
      const patId = results[0].paa_pat_id;
      console.log("Patient Accessed by User:" + patId);

////////ADD NEW condition/////

 await page.waitForTimeout(2000);
 //
     await condition.selectandAddClinicalItem(jsonData.AddCondition[index].pacr_que_name); //This searches item and clicks on add button
      await page.waitForTimeout(2000);   
      await page.getByLabel('cancelIcon').click();
      await condition.selectandAddClinicalItem(jsonData.AddCondition[index].pacr_que_name);      
      await page.waitForTimeout(1000);         
              
      await page.getByRole('checkbox', { name: 'Private record' }).click()  
      
      await conditionExtraDetails.enterDateOfCondition(jsonData.AddCondition[index].cond_date_diagnosed)
      await conditionExtraDetails.enterPreviousCondition()
      await conditionExtraDetails.enterCoditionNotes(jsonData.AddCondition[index].cond_notes)
      //await page.locator("xpath=//button[@aria-label='saveExtraDetails']").click()     
      await conditionExtraDetails.clickOnSaveExtraDetails();      
      //await expect(page.getByText("Condition record added successfully")).toHaveText("Condition record added successfully");     
       
      sqlQuery=
       "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, cond_date_diagnosed, cond_notes "+
       " from patient_clinical_records join patient_clinical_records_details "+
       " on pacr_id=pacrd_pacr_id join conditions on pacr_id=cond_pacr_id where pacr_record_status='approved' and "+
       " pacr_pat_id='"+patId+"' and pacrd_record_status='approved' and cond_record_status='approved' and "+
       "pacr_que_name='Erythematous condition' and pacr_category='Condition' order by 1 desc limit 1"

    console.log(sqlQuery)       
    sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    results = await executeQuery(sqlQuery, sqlFilePath);
    const pacrId = results[0].pacr_id;
    console.log("\n Patient Clinical Records stored into the database: \n", results);
    var match = await compareJsons(sqlFilePath, null, jsonData.AddCondition[index]);
    if (match) {
      console.log("\n Patient Clinical Records Comparision adding new condition: Parameters from both JSON files match!\n");
    } else {
      console.log("\n Patient Clinical Records Comparision adding new condition: Parameters from both JSON files do not match!\n");
    }
    
  
    await condition.toggleSearchSection(); //Close the search section
      await condition.clickOnItemDiv(jsonData.EditCondition[index].pacr_que_name);
      await condition.clickOnItemEdit();
      await page.waitForTimeout(1000);
      await page.locator("xpath=//button[@aria-label='cancelIcon']").click()
      await page.waitForTimeout(1000);
      await condition.clickOnItemEdit();
      //await page.locator("xpath=//div[@data-testid='allergies']").click()
      await page.waitForTimeout(500);
        
         
    await conditionExtraDetails.enterCoditionNotes(jsonData.EditCondition[0].cond_notes);    
      await conditionExtraDetails.clickOnSaveExtraDetails();
      
      //await expect(page.getByText('condition record updated successfully')).toHaveText('condition record updated successfully')
      
       ////// Database comparison - Patient Clinical Records - UPDATE condition/////////
    sqlQuery =
      "select pacr_id, pacr_category, pacr_que_name, cond_date_diagnosed, cond_notes from patient_clinical_records "
      +" join patient_clinical_records_details on pacr_id=pacrd_pacr_id join conditions on pacr_id=cond_pacr_id "
      +"where pacr_record_status='approved' "
      +"and pacr_pat_id= " + patId +" "
      +"and pacr_record_status='approved' and pacr_que_name='"+jsonData.AddCondition[index].pacr_que_name +"' "
      +"and pacr_category='condition' order by 1 desc limit 1;"
          
     console.log("Manoj:"+sqlQuery);
   sqlFilePath = "SQLResults/ClinicalDomain/AddCondition.json";
   results = await executeQuery(sqlQuery, sqlFilePath);

   console.log("\n Patient Clinical Records stored into the database: \n", results);
   var match = await compareJsons(sqlFilePath, null, jsonData.EditCondition[index]);
   if (match) {
     console.log(
       "\n Update Patient Clinical Records Comparision Edit condition: Parameters from both JSON files match!\n"
     );
   } else {
     console.log(
       "\n Update Patient Clinical Records Comparision Edit condition: Parameters from both JSON files do not match!\n"
     );
   }

  
   ////////AUTO UPDATE RISK AFTER UPDATING OUTCOME /////
      
      await condition.clickOnItemHighlightNone();
      await page.waitForTimeout(500);
      await condition.selectLowRiskLevel();
      await page.waitForTimeout(500);
      await condition.selectModerateRiskLevel();
      await page.waitForTimeout(500);
      await condition.selectHighRiskLevel();
      await page.waitForTimeout(500);
      await condition.selectAllRiskLevel();
      await condition.clickOnLevelTwoExtraDetails();
      await condition.clickOnLevelThreeExtraDetails();
      await condition.clickOnLevelOneExtraDetails();


      ////// Database comparison - Patient Clinical Records - UPDATE condition RISK/////////
     sqlQuery =
     "select pacr_risk from patient_clinical_records where pacr_id=" + pacrId;
          
   sqlFilePath = "SQLResults/ClinicalDomain/AddCondition.json";
   results = await executeQuery(sqlQuery, sqlFilePath);
   if(results[0].pacr_risk == jsonData.EditCondition[index].pacr_risk){
    console.log(
      "\n Patient Clinical Records Comparision for Edit condition Risk: RISK Updated Successfully! \n"
    );
   } else {
    console.log(
      "\n Patient Clinical Records Comparision for Edit condition Risk: RISK Update Failed! \n"
    );
  }

     ///////// Deleting Item ////////////

      
      await condition.clickOnItemEdit();
      await conditionExtraDetails.clickOnDelete();
      await conditionExtraDetails.clickOnCancelDelete();
      await conditionExtraDetails.clickOnDelete();
      await conditionExtraDetails.clickOnConfirmDelete();
      await conditionExtraDetails.enterDeleteReason(jsonData.DeleteCondition[index].pacr_delete_reason);
      await conditionExtraDetails.clickOnSaveDeleteReason();
//await expect(page.getByText("Condition deleted successfully")).toHaveText("Condition deleted successfully");
          
      await page.waitForTimeout(1000)   

       ////// Database comparison- Patient Clinical Records - DELETE OUTCOME/////////
       sqlQuery ="select pacr_que_name, pacr_delete_reason from patient_clinical_records where pacr_id=" +
       pacrId +" and pacr_record_status='wrong'";

     sqlFilePath = "SQLResults/ClinicalDomain/AddCondition.json";
     results = await executeQuery(sqlQuery, sqlFilePath);
     //  pacrId=results[0].pacr_id;
     console.log("\n Patient Details stored into the database: \n", results);
     var match = await compareJsons(
       sqlFilePath,
       null,
       jsonData.DeleteCondition[index]
     );
     if (match) {
       console.log(
         "\n  Patient Clinical Records Comparision for Delete condition: Parameters from both JSON files match!\n"
       );
     } else {
       console.log(
         "\n  Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n"
       );
     }       
     
    }
  });
});
