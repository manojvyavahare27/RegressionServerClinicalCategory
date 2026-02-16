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
import PatientSummary from "../../../../../../Pages/ClinicalDomain/PatientSummary/PatientSummary";
import { TIMEOUT } from "dns";
import { error } from "console";
import { before } from "node:test";
import { toggleDivVisibility } from "../../../../../../UtilFiles/DynamicUtility";

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
test.describe("LifeStyle Category", () => {
    test("Add LifeStyle", async ({ page }) => {
  
  
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
        const lifestyle = new ClinicalSummary(page);
        const lifestyleExtraDetails = new ClinicalExtraDetails(page);
        const patientsummary = new PatientSummary(page);
  
        const menu = new Menu(page);
        await page.goto(environment.Test);
        await loginpage.enterUsername(jsonData.loginDetails[0].username);
        logger.info("Username enter successfully");
        //await page.pause()
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
        await page.pause()
        await patientsearch.enterFamilyName(data.pat_surname);
        logger.info("Family Name entered successfully");
        //await patientsearch.selectSex(data.pat_sex);
  
        await patientsearch.selectBornDate(jsonData.PatientDetails[index].pat_dob);
        //await patientsearch.selectBornDate(formattedDate);
        await patientsearch.clickOnSearchButton();
  
        await patientsearch.clickOnSearchPatientLink();
        await page.waitForTimeout(1500);
        await confirmexisting.clickOnConfirmExistingDetails();
       await page.waitForTimeout(4000);
      const alertPopup= await page.locator("xpath=//h2[text()='Alerts']").isVisible()      
      if(alertPopup==true)
        {       
          await lifestyle.closePopUp(page)
        }                 
       await page.waitForTimeout(1000)  
        //await contacthistory.enterContactDate('26/11/2024');
        await contacthistory.selectContactReason('Assessments');
        await contacthistory.selectContactLocation('Cardio Location');
        //await contacthistory.enterContactWith('Dr Sathya');
        await contacthistory.clickOnAddContact();
        
        await lifestyle.clickOnViewContactItemsMenu();        
        await lifestyle.clickOnPinContactItemsMenu();        
        await lifestyle.selectCategoryFromList("Lifestyle");

        await page.pause()
        //Review and delete
        await page.waitForTimeout(2000);
        if(await lifestyle.checkItemOnHistoryTable(jsonData.AddLifestyle[index].pacr_que_name)){
        await lifestyle.clickOnItemReview(jsonData.AddLifestyle[index].pacr_que_name);
        console.log("Item reviewed before deleting");
        await page.waitForTimeout(2000);
        await lifestyle.clickOnItemEdit(jsonData.AddLifestyle[index].pacr_que_name);
        await lifestyleExtraDetails.clickOnDelete();
        await lifestyleExtraDetails.clickOnConfirmDelete();
        await lifestyleExtraDetails.enterDeleteReason('Deleted Existing item');
        await lifestyleExtraDetails.clickOnSaveDeleteReason();
        console.log('\x1bItem was deleted successfully\x1b[0m');
        }
       
       
        await page.pause()
        //////Fetch Patient Details/////////
   var sqlQuery =
   "select * from patient_audit where paa_use_username='" + jsonData.loginDetails[0].username + 
   "' and paa_type='selected' order by 1 desc limit 1";
   var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
   var results = await executeQuery(sqlQuery, sqlFilePath);
   console.log("\n Patient Details stored into the database: \n", results);
   const patId = results[0].paa_pat_id;

   console.log("Patient Accessed by User:" + patId);

  
  // Adding new Presenting Problem
  

  await page.pause()
  await lifestyle.selectandAddClinicalItem(jsonData.AddLifestyle[index].pacr_que_name);
  await page.waitForTimeout(2000);
   await lifestyle.handleSubCategoryPopup(page) 
  await page.getByLabel('cancelIcon').click();
 // await lifestyleExtraDetails.clickOnClincialItemCollapsable();
 await lifestyle.selectandAddClinicalItem(jsonData.AddLifestyle[index].pacr_que_name);
  await page.waitForTimeout(1000);
  //await lifestyleExtraDetails.selectClinicalItemSubcategory(jsonData.AddLifestyle[index].eli_text); 
  await lifestyleExtraDetails.clickOPrivateRecord();
  await page.waitForTimeout(500);  
 
  await lifestyleExtraDetails.enterLifestyleNotes(jsonData.AddLifestyle[index].life_notes);
 
  await lifestyleExtraDetails.clickOnSaveExtraDetails();
  await page.waitForTimeout(500);
    
 sqlQuery="select * from patient_clinical_records where pacr_pat_id=" + patId
  + " and pacr_record_status='approved' and pacr_que_name='"+ jsonData.AddLifestyle[index].pacr_que_name
   +"' and pacr_category='Lifestyle' order by 1 desc limit 1;"

sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
results = await executeQuery(sqlQuery, sqlFilePath);
const pacrId = results[0].pacr_id;
console.log("\n Patient Clinical Records stored into the database: \n", results);
var match = await compareJsons(sqlFilePath, null, jsonData.AddLifestyle[index]);
if (match) {
  console.log("\n Patient Clinical Records Comparision Add lifestyle: Parameters from both JSON files match!\n");
} else {
  console.log("\n Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n");
} 
await page.pause()
  // Edit presenting lifestyle
      await page.waitForTimeout(1000);
      await lifestyle.clickOnItemEdit('Smoking: Current Smoker');
      await page.waitForTimeout(2000);
     // await lifestyleExtraDetails.clickOnClincialItemCollapsable();
     // await lifestyleExtraDetails.selectClinicalItemSubcategory(jsonData.EditLifestyle[index].eli_text);      
      await lifestyleExtraDetails.enterLifestyleNotes(jsonData.EditLifestyle[index].life_notes);
      await lifestyleExtraDetails.clickOnSaveExtraDetails();
      await page.waitForTimeout(1000); 

              ////// Database comparison - Patient Clinical Records - UPDATE Patient Scans/////////
     sqlQuery = "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, " + 
  "life_notes,pacrd_subcategory_eli_code from patient_clinical_records join patient_clinical_records_details"+
  " on pacr_id=pacrd_pacr_id join lifestyles on pacr_id=life_pacr_id where pacr_record_status='approved'"+
  " and pacrd_record_status='approved' and life_record_status='approved'and pacr_id=" + pacrId +
     " and pacr_record_status='approved'";
          
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);

   console.log("\n Patient Clinical Records stored into the database: \n", results);
   var match = await compareJsons(sqlFilePath, null, jsonData.EditLifestyle[index]);
   if (match) {
     console.log("\n Update Patient Clinical Records Comparision Update lifestyle: Parameters from both JSON files match!\n");
   } else {
     console.log("\n Update Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n");
   }

   
       // Auto update risk after updating Presenting lifestyle
      //  await lifestyle.clickOnItemHistory();
      //  await lifestyle.clickOnHistoryItemByType(jsonData.Addlifestyle[index].pacr_que_name);
      //await lifestyle.clickOnItemHistory();
    await page.getByRole('button', { name: 'patientHistoryIconButton' }).click()
      await lifestyle.clickOnHistoryItemDiv();
       await page.waitForTimeout(1000);
       await lifestyle.closeWindow();
       await page.waitForTimeout(2000);
       if (await lifestyle.checkItemOnHistoryTable(null, true)) {
         console.error('Newly added item has not been reviewed after updating the record.');
         await lifestyle.clickOnItemReview();
       } else {
         console.log('Newly added item has been reviewed after updating the record.');
       }

       await page.waitForTimeout(500);
       await lifestyle.clickOnItemHighlightNone();
       await page.waitForTimeout(500);
       await lifestyle.selectLowRiskLevel();
       await page.waitForTimeout(500);
       await lifestyle.selectModerateRiskLevel();
       await page.waitForTimeout(500);
       await lifestyle.selectHighRiskLevel();
       await page.waitForTimeout(500);
       await lifestyle.selectAllRiskLevel();
       await lifestyle.clickOnLevelTwoExtraDetails();
       await lifestyle.clickOnLevelOneExtraDetails();
       await page.waitForTimeout(1000);   
       await lifestyle.clickOnMigratedItemsSection();
       await page.waitForTimeout(1000);
       await lifestyle.clickOnDeletedItemsSection();
       await page.waitForTimeout(1000);
       await lifestyle.clickOnArchivedItemsSection();
       await page.waitForTimeout(1000);
       await lifestyle.clickOnAllItemsSection()
       await page.waitForTimeout(1000);    
       await lifestyle.clickOnLevelOneExtraDetails()
       await lifestyle.clickOnLevelTwoExtraDetails()
      
      
      //Delete presenting problem
      await lifestyle.clickOnItemEdit();
      await page.waitForTimeout(2000)
      await lifestyleExtraDetails.clickOnDelete();
      await lifestyleExtraDetails.clickOnCancelDelete();
      await lifestyleExtraDetails.clickOnDelete();
      await lifestyleExtraDetails.clickOnConfirmDelete();
      await lifestyleExtraDetails.enterDeleteReason(jsonData.DeleteLifestyle[index].pacr_delete_reason);
      await lifestyleExtraDetails.clickOnSaveDeleteReason();
      

      await page.waitForTimeout(1000);
      sqlQuery =
      "select pacr_que_name, pacr_delete_reason from patient_clinical_records where pacr_id=" +
      pacrId +
      " and pacr_record_status='wrong'";
 
    sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    results = await executeQuery(sqlQuery, sqlFilePath);
    //  pacrId=results[0].pacr_id;
    console.log("\n Patient Details stored into the database: \n", results);
    var match = await compareJsons(sqlFilePath,  null, jsonData.DeleteLifestyle[index]
    );
    if (match) {
      console.log(
        "\n  Patient Clinical Records Comparision Delete lifestyle: Parameters from both JSON files match!\n"
      );
    } else {
      console.log(
        "\n  Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n"
      );
    }
  //  await page.pause()
 
 
     if(!(await lifestyle.checkItemOnHistoryTable(jsonData.DeleteLifestyle[index].pacr_que_name)) ){
       console.log("Item removed from All Category Section");
     }


     //await lifestyle.logoutCellma()
    }
});
})