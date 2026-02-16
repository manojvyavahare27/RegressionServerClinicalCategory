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
test.describe("Excel Conversion Overview Category", () => {
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

test.describe("Overview Category", () => {
    test("Add Overview", async ({ page }) => {
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
        const overview = new ClinicalSummary(page);
        const overviewExtraDetails = new ClinicalExtraDetails(page);
        const patientsummary = new PatientSummary(page);
  
        const menu = new Menu(page);
        await page.goto(environment.Test);
      await loginpage.enterUsername(jsonData.loginDetails[0].username);
      logger.info("Username enter successfully");
      await loginpage.enter_Password(jsonData.loginDetails[0].password);
      logger.info("Password enter successfully");
      await loginpage.clickOnLogin();      
      logger.info("Clicked on Login button successfully");
      await homepage.clickOnHomeDashboardIcon()      
      await homepage.clickOnPatientIcon();
      logger.info("Clicked on Patient Icon successfully");
      await patientsearch.clickOnSearchButton();
        logger.info("Clicked on Search button successfully");
        await patientsearch.enterGivenName(data.pat_firstname);
        logger.info("Given Name entered successfully");
       
        await patientsearch.enterFamilyName(data.pat_surname);
        logger.info("Family Name entered successfully");
        //await patientsearch.selectSex(data.pat_sex);
  
        await patientsearch.selectBornDate(
          jsonData.PatientDetails[index].pat_dob
        );
        //await patientsearch.selectBornDate(formattedDate);
        await patientsearch.clickOnSearchButton();
        
        await patientsearch.clickOnSearchPatientLink();
        await page.waitForTimeout(1500);
        await confirmexisting.clickOnConfirmExistingDetails();        
        // await page.pause()
      const alertPopup= await page.locator("xpath=//h2[text()='Alerts']").isVisible()      
      if(alertPopup==true)
        {       
          await overview.closePopUp(page)
        }                 
       await page.waitForTimeout(1000)  
       // await contacthistory.enterContactDate('26/04/2024');
        await contacthistory.selectContactReason('Assessments');
        await contacthistory.selectContactLocation('Cardio Location');
        //await contacthistory.enterContactWith('Dr Sathya');
        await contacthistory.clickOnAddContact();
       
        await overview.clickOnViewContactItemsMenu();
        await overview.clickOnPinContactItemsMenu();
        await overview.selectCategoryFromList("Overview"); 
        await page.waitForTimeout(2000)
        await page.pause()
  
        //    ////////REVIEW EXISTING ITEM AND DELETE/////
        // if(await overview.checkItemOnHistoryTable(jsonData.AddOverview[index].pacr_que_name)){
        // await overview.clickOnItemReview(jsonData.AddOverview[index].pacr_que_name);
        // console.log("Item reviewed before deleting");
        // await overview.clickOnItemEdit(jsonData.AddOverview[index].pacr_que_name);
        // await overviewExtraDetails.clickOnDelete();
        // //await page.waitForTimeout(1000)
        // await overviewExtraDetails.clickOnConfirmDelete();
        // await overviewExtraDetails.enterDeleteReason('Deleted Existing item');
        // await overviewExtraDetails.clickOnSaveDeleteReason();
        // console.log('\x1bItem was deleted successfully\x1b[0m');
        // }
        // await page.waitForTimeout(2000)
  
      
       //////Fetch Patient Details/////////
       var sqlQuery =
       "select * from patient_audit where paa_use_username='" + jsonData.loginDetails[0].username + 
       "' and paa_type='selected' order by 1 desc limit 1";
       var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
       var results = await executeQuery(sqlQuery, sqlFilePath);
       console.log("\n Patient Details stored into the database: \n", results);
       const patId = results[0].paa_pat_id;

       console.log("Patient Accessed by User:" + patId);

           ////////ADD NEW OVERVIEW/////
        await overview.selectandAddOverview();//This searches item and clicks on add button
        await page.waitForTimeout(2000)
         await overview.handleSubCategoryPopup(page)
        await page.getByLabel('cancelIcon').click();
        await overview.selectandAddOverview();
        //await overviewExtraDetails.clickOnClincialItemCollapsable();
        await page.waitForTimeout(1000)
        await page.pause()
      //  await overviewExtraDetails.selectClinicalItemSubcategory(jsonData.AddOverview[index].eli_text);
        //await outcomeExtraDetails.enterDateOfOutcome(jsonData.AddOutcome[index].outc_date);
        //await outcomeExtraDetails.selectFrequency(jsonData.AddOutcome[index].outc_frequency);
        await overviewExtraDetails.enterOverviewNotes(jsonData.AddOverview[index].over_notes);
        await overviewExtraDetails.clickOnSaveExtraDetails();
        //await page.getByLabel('saveChecklist').click()
        await page.waitForTimeout(500)
        await expect(page.getByText('Overview record added successfully')).toHaveText('Overview record added successfully')
        //await expect(page.getByText(`${clinicaCatergory} Record Added Successfully`)).toHaveText(`${clinicaCatergory} Record Added Successfully`)
         ////// Database comparison- Patient Clinical Records - ADDING NEW OUTCOME/////////
         sqlQuery =
         "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, " + 
         "over_notes from patient_clinical_records join patient_clinical_records_details"+
         " on pacr_id=pacrd_pacr_id join overview on pacr_id=over_pacr_id where pacr_record_status='approved'"+
         " and pacrd_record_status='approved' and over_record_status='approved' and pacr_pat_id=" + patId +
         " and pacr_record_status='approved' and pacr_que_name='" + jsonData.AddOverview[index].pacr_que_name +
         "' and pacr_category='overview' order by 1 desc limit 1";
        console.log("Overview_query"+sqlQuery)       
        
       sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
       results = await executeQuery(sqlQuery, sqlFilePath);
       const pacrId = results[0].pacr_id;
       console.log("\n Patient Clinical Records stored into the database: \n", results);
       var match = await compareJsons(sqlFilePath, null, jsonData.AddOverview[index]);
       if (match) {
         console.log(
           "\n Patient Clinical Records Comparision add Overview: Parameters from both JSON files match!\n"
         );
       } else {
         console.log(
           "\n Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n"
         );
       } 
       //await page.pause()
      //  await overview.toggleSearchSection();//Close the search section 
      //  await page.waitForTimeout(1000)
       

       /*if(await overview.checkItemOnHistoryTable()){
        await overview.clickOnItemDiv()
        if(await outcome.checkItemOnHistoryTable( null, true)){
          console.log("Newly added item is not reviewed before updating the record");
        }
        else{
          console.error("Newly added item is reviewed before updating the record.");
        }*/
        await overview.clickOnItemEdit('Overview');
        await page.waitForTimeout(2000)
       await overview.handleSubCategoryPopup(page)
        //await overviewExtraDetails.clickOnClincialItemCollapsable();
        //await overviewExtraDetails.selectClinicalItemSubcategory(jsonData.EditOverview[index].eli_text);
        await overviewExtraDetails.enterOverviewNotes(jsonData.EditOverview[index].over_notes);
        await overviewExtraDetails.clickOnSaveExtraDetails();
        await page.waitForTimeout(1000)
        await expect(page.getByText('Overview record updated successfully')).toHaveText('Overview record updated successfully')

         ////// Database comparison - Patient Clinical Records - UPDATE Overview/////////
     sqlQuery =
     "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, " + 
     "over_notes from patient_clinical_records join patient_clinical_records_details"+
     " on pacr_id=pacrd_pacr_id join overview on pacr_id=over_pacr_id where pacr_record_status='approved'"+
     " and pacrd_record_status='approved' and over_record_status='approved' and pacr_id=" + pacrId +
     " and pacr_record_status='approved'";
          
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);

   console.log("\n Patient Clinical Records stored into the database: \n", results);
   var match = await compareJsons(sqlFilePath, null, jsonData.EditOverview[index]);
   if (match) {
     console.log(
       "\n Update Patient Clinical Records Comparision Update Overview: Parameters from both JSON files match!\n"
     );
   } else {
     console.log(
       "\n Update Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n"
     );
   }
   //await page.pause()

  
        ////////AUTO UPDATE RISK AFTER UPDATING OUTCOME /////
      
        //await expect(page.getByText('Outcome Record Updated Successfully')).toHaveText('Outcome Record Updated Successfully')
        await overview.clickOnItemHistory();
       await overview.clickOnHistoryItemDiv();
        await page.waitForTimeout(1000)
        await overview.closeWindow();
        await page.waitForTimeout(2000)
        if(await overview.checkItemOnHistoryTable(null, true)){
          console.error('Newly added item has not been reviewed after updating the record.');
          await overview.clickOnItemReview();
        }
        else{
          console.log('Newly added item has been reviewed after updating the record.');
        }
        await page.waitForTimeout(500)
        await overview.clickOnItemHighlightNone();
        await page.waitForTimeout(500)
        await overview.selectLowRiskLevel();
       
        await page.waitForTimeout(500)
        await overview.selectModerateRiskLevel();
        await page.waitForTimeout(500)
        await overview.selectHighRiskLevel();
        await page.waitForTimeout(500)
        await overview.selectAllRiskLevel();
        await overview.clickOnLevelTwoExtraDetails();
       // await overview.clickOnLevelThreeExtraDetails();
        await overview.clickOnLevelOneExtraDetails();
  
        await page.waitForTimeout(1000)
        

         ////// Database comparison - Patient Clinical Records - UPDATE Overview/////////
     sqlQuery =
     "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date," + 
     "over_notes from patient_clinical_records join patient_clinical_records_details"+
     " on pacr_id=pacrd_pacr_id join overview on pacr_id=over_pacr_id where pacr_record_status='approved'"+
     " and pacrd_record_status='approved' and over_record_status='approved' and pacr_id=" + pacrId +
     " and pacr_record_status='approved'";
          
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);

   console.log("\n Patient Clinical Records stored into the database: \n", results);
   var match = await compareJsons(sqlFilePath, null, jsonData.EditOverview[index]);
   if (match) {
     console.log(
       "\n Update Patient Clinical Records Comparision Update Overview: Parameters from both JSON files match!\n"
     );
   } else {
     console.log(
       "\n Update Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n"
     );
   }
   //await page.pause()
       ///////// Deleting Item ////////////
  
        await overview.clickOnItemEdit('Overview');
        await page.waitForTimeout(2000)
        await overviewExtraDetails.clickOnDelete();
        await overviewExtraDetails.clickOnCancelDelete();
        await overviewExtraDetails.clickOnDelete();
        await overviewExtraDetails.clickOnConfirmDelete();
        await overviewExtraDetails.enterDeleteReason(jsonData.DeleteOverview[index].pacr_delete_reason);
        await overviewExtraDetails.clickOnSaveDeleteReason();
        await page.waitForTimeout(1000)
    
     ////// Database comparison- Patient Clinical Records - DELETE Overview/////////
     sqlQuery =
     "select pacr_que_name, pacr_delete_reason from patient_clinical_records where pacr_id=" +
     pacrId +
     " and pacr_record_status='wrong'";

   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);
   //  pacrId=results[0].pacr_id;
   console.log("\n Patient Details stored into the database: \n", results);
   var match = await compareJsons(
     sqlFilePath,
     null,
     jsonData.EditOverview[index]
   );
   if (match) {
     console.log(
       "\n  Patient Clinical Records Comparision Delete Overview: Parameters from both JSON files match!\n"
     );
   } else {
     console.log(
       "\n  Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n"
     );
   }
   //await page.pause()


    if(!(await overview.checkItemOnHistoryTable(jsonData.EditOverview[index].pacr_que_name)) ){
      console.log("Item removed from All Category Section");
    }
  
        /*
        if(!(await outcome.checkItemOnHistoryTable(jsonData.EditOutcome[index].pacr_que_name)) ){
          console.log("Item removed from All Category Section");
        }
        await outcome.clickOnNormalItemsSection();
        await page.waitForTimeout(1000)
        // if((await outcome.checkItemOnHistoryTable('Sleep walking disorder')) ){
        //   console.log("Item Present in Normal Section");
        // }
        await outcome.clickOnMigratedItemsSection();
        // if((await outcome.checkItemOnHistoryTable('Sleep walking disorder')) ){
        //   console.log("Item Present in Migrated Section");
        // }
        await outcome.clickOnDeletedItemsSection();
        await page.waitForTimeout(1000)
        if((await outcome.checkItemOnHistoryTable(jsonData.DeleteOutcome[index].pacr_que_name)) ){
          console.log("Item Present in Deleted Section");
        }
        await page.waitForTimeout(1000);
        // await outcome.clickOnArchivedItemsSection();
        // if((await outcome.checkItemOnHistoryTable('Sleep walking disorder')) ){
        //   console.log("Item Present in Archived Section");
        // }
        await outcome.clickOnAllItemsSection();
        // if((await outcome.checkItemOnHistoryTable('Sleep walking disorder')) ){
        //   console.log("Item Present in All Section");
        // }
        await outcome.toggleHistorySection(); // Close the history section*/
  
      }
    });
});
 
});