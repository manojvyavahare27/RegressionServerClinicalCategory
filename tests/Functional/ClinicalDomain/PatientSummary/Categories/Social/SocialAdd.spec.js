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

test.describe("Excel Conversion social Category", () => {
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

test.describe("social Category", () => {
  test("Add social", async ({ page }) => {
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
      const social = new ClinicalSummary(page);
      const socialExtraDetails = new ClinicalExtraDetails(page);
      

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
          await social.closePopUp()
        }
      await page.waitForTimeout(2000);
       await contacthistory.clickOnShowFilter()
      await contacthistory.selectServiceFilter("General Medicine Automation");
      await contacthistory.selectContactReasonFilter("Assessments");
     // await contacthistory.enterContactDate("26/04/2024");
      await contacthistory.selectContactReason("Assessments");
      await contacthistory.selectContactLocation("Cardio Location");
      //await contacthistory.enterContactWith("Dr Sathya");
      await contacthistory.clickOnAddContact();
      await social.clickOnViewContactItemsMenu();
      await social.clickOnPinContactItemsMenu();
      await social.selectCategoryFromList("Social Circumstances");
      await page.waitForTimeout(2000)
     // await page.pause()
       ////////REVIEW EXISTING ITEM AND DELETE/////
       if(await social.checkItemOnHistoryTable(jsonData.Addsocial[index].pacr_que_name)){
        await social.clickOnItemReview(jsonData.Addsocial[index].pacr_que_name);
        console.log("Item reviewed before deleting");
        await social.clickOnItemEdit(jsonData.Addsocial[index].pacr_que_name);
        await socialExtraDetails.clickOnDelete();
        await socialExtraDetails.clickOnConfirmDelete();
        await socialExtraDetails.enterDeleteReason('Deleted Existing item');
        await socialExtraDetails.clickOnSaveDeleteReason();
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



////////ADD NEW social/////
      await social.selectandAddClinicalItem(jsonData.Addsocial[index].pacr_que_name); //This searches item and clicks on add button
      await page.waitForTimeout(2000);     
        await social.handleSubCategoryPopup(page)   
      await page.getByLabel('cancelIcon').click();
      await social.selectandAddClinicalItem(jsonData.Addsocial[index].pacr_que_name); //This searches item and clicks on add button

     // await socialExtraDetails.clickOnClincialItemCollapsable();
      await page.waitForTimeout(1000);
      //await socialExtraDetails.selectClinicalItemSubcategory(jsonData.Editsocial[index].eli_text);                 
      await page.getByRole('checkbox', { name: 'Private record' }).click()
      await page.getByRole('checkbox', { name: 'Set as default' }).click()
      await socialExtraDetails.enterSocialNotes(jsonData.Addsocial[index].soci_notes);
      await socialExtraDetails.clickOnSaveExtraDetails();
      await page.waitForTimeout(1000);
      await page.pause()
     // await expect(page.getByText("Recommendation Record Added Successfully")).toHaveText("Recommendation Record Added Successfully");
      //await expect(page.getByText(`${clinicaCatergory} Record Added Successfully`)).toHaveText(`${clinicaCatergory} Record Added Successfully`); 
     
      ////// Database comparison- Patient Clinical Records - ADDING NEW social/////////
      sqlQuery =
      "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, soci_notes"+
      " from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join social_circumstances on pacr_id=soci_pacr_id where pacr_record_status='approved'"+
      " and pacr_pat_id=" + patId +
      " and pacr_record_status='approved' and pacr_que_name='" + jsonData.Addsocial[index].pacr_que_name +
      "' and pacr_category='Social Circumstance' order by 1 desc limit 1";


    console.log("Manoj:  "+ sqlQuery);
           
    sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    results = await executeQuery(sqlQuery, sqlFilePath);
    const pacrId = results[0].pacr_id;
    console.log("\n Patient Clinical Records stored into the database: \n", results);
    var match = await compareJsons(sqlFilePath, null, jsonData.Addsocial[index]);
    if (match) {
      console.log("\n Patient Clinical Records Comparision adding new Recommendation: Parameters from both JSON files match!\n");
    } else {
      console.log("\n Patient Clinical Records Comparision adding new Recommendation: Parameters from both JSON files do not match!\n");
    }
   
    await social.toggleSearchSection(); //Close the search section
      
      await social.clickOnItemDiv(jsonData.Editsocial[index].pacr_que_name);
      await social.clickOnItemEdit();
      //await socialExtraDetails.clickOnClincialItemCollapsable();
    //  await socialExtraDetails.selectClinicalItemSubcategory(jsonData.Editsocial[index].eli_text);
            
      await socialExtraDetails.enterSocialNotes(jsonData.Editsocial[index].soci_notes);
      await socialExtraDetails.clickOnSaveExtraDetails();
      await page.waitForTimeout(1000);

      await page.pause()
       ////// Database comparison - Patient Clinical Records - UPDATE social/////////
     sqlQuery =
     "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, soci_notes"+
     " from patient_clinical_records join patient_clinical_records_details"+
     " on pacr_id=pacrd_pacr_id join social_circumstances on pacr_id=soci_pacr_id where pacr_record_status='approved'"+
     " and pacrd_record_status='approved' and soci_record_status='approved' and pacr_id=" + pacrId +
     " and pacr_record_status='approved'";
          
     console.log("Manoj Edit query:"+sqlQuery);
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);

   console.log("\n Patient Clinical Records stored into the database: \n", results);
   var match = await compareJsons(sqlFilePath, null, jsonData.Editsocial[index]);
   if (match) {
     console.log("\n Update Patient Clinical Records Comparision Edit social: Parameters from both JSON files match!\n");
   } else {
     console.log("\n Update Patient Clinical Records Comparision Edit social: Parameters from both JSON files do not match!\n");
   }

   ////////AUTO UPDATE RISK AFTER UPDATING OUTCOME /////

     await page.pause()

      await social.clickOnItemHistory();
      await social.clickOnHistoryItemDiv();
      await page.waitForTimeout(500);
      await social.closeWindow();
      await page.waitForTimeout(500);
     
     
      // await page.waitForTimeout(500);
      await social.clickOnItemHighlightNone();
      await page.waitForTimeout(500);
      await social.selectLowRiskLevel();
      await page.waitForTimeout(500);
      await social.selectModerateRiskLevel();
      await page.waitForTimeout(500);
      await social.selectHighRiskLevel();
      await page.waitForTimeout(500);
      await social.selectAllRiskLevel();
      await social.clickOnLevelTwoExtraDetails();
      //await social.clickOnLevelThreeExtraDetails();
      await social.clickOnLevelOneExtraDetails();
await page.pause()

      ////// Database comparison - Patient Clinical Records - UPDATE social RISK/////////
     sqlQuery =
     "select pacr_risk from patient_clinical_records where pacr_id=" + pacrId;
          
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);
   if(results[0].pacr_risk == jsonData.Editsocial[index].pacr_risk){
    console.log(
      "\n Patient Clinical Records Comparision for Edit social Risk: RISK Updated Successfully! \n"
    );
   } else {
    console.log(
      "\n Patient Clinical Records Comparision for Edit social Risk: RISK Update Failed! \n"
    );
  }
await page.pause()
     ///////// Deleting Item ////////////

      await social.clickOnItemEdit();
      await socialExtraDetails.clickOnDelete();
      await socialExtraDetails.clickOnCancelDelete();
      await socialExtraDetails.clickOnDelete();
      await socialExtraDetails.clickOnConfirmDelete();
      await socialExtraDetails.enterDeleteReason(jsonData.Deletesocial[index].pacr_delete_reason);
      await socialExtraDetails.clickOnSaveDeleteReason();
      await page.waitForTimeout(1000)
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
       jsonData.Deletesocial[index]
     );
     if (match) {
       console.log(
         "\n  Patient Clinical Records Comparision for Delete social: Parameters from both JSON files match!\n"
       );
     } else {
       console.log(
         "\n  Patient Clinical Records Comparision for Delete social: Parameters from both JSON files do not match!\n"
       );
     }        
     await page.pause()
     await page.waitForTimeout(1000);
      await social.clickOnMigratedItemsSection();
      await page.waitForTimeout(1000);
      await social.clickOnDeletedItemsSection();
      await page.waitForTimeout(1000);
      await social.clickOnArchivedItemsSection();
      await page.waitForTimeout(1000);
      await social.clickOnAllItemsSection();
     // await social.toggleHistorySection(); // Close the history section

     
     // await page.pause();
    }
  });
});
