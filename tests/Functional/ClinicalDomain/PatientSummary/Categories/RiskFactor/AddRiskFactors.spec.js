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

test.describe("Excel Conversion riskFactor Category", () => {
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

test.describe("riskFactor Category", () => {
  test("Add riskFactor", async ({ page }) => {
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
      const riskFactor = new ClinicalSummary(page);
      const riskFactorExtraDetails = new ClinicalExtraDetails(page);
      

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
      //  await page.waitForTimeout(1000);
      // const alertPopup= await page.locator("xpath=//h2[text()='Alerts']").isVisible()      
      // if(alertPopup==true)
      //   {       
      //     await riskFactor.closePopUp(page)
      //   }                 
      //  await page.waitForTimeout(1000)

      await page.waitForTimeout(5000);
      const alertPopup= await page.locator("xpath=//h2[text()='Alerts']").isVisible()      
      if(alertPopup==true)
        {                
          await riskFactor.closePopUp()
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
      await riskFactor.clickOnViewContactItemsMenu();
      await riskFactor.clickOnPinContactItemsMenu();
      await riskFactor.selectCategoryFromList("Risk Factors");
      await page.waitForTimeout(2000)

      //await page.pause()
       ////////REVIEW EXISTING ITEM AND DELETE/////
       if(await riskFactor.checkItemOnHistoryTable(jsonData.AddRiskFactor[index].pacr_que_name)){
        //await riskFactor.clickOnItemReview(jsonData.AddRiskFactor[index].pacr_que_name);
       // console.log("Item reviewed before deleting");
        await riskFactor.clickOnItemEdit(jsonData.AddRiskFactor[index].pacr_que_name);
        await riskFactorExtraDetails.clickOnDelete();
        await riskFactorExtraDetails.clickOnConfirmDelete();
        await riskFactorExtraDetails.enterDeleteReason('Deleted Existing item');
        await riskFactorExtraDetails.clickOnSaveDeleteReason();
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



////////ADD NEW riskFactor/////
      await riskFactor.selectandAddClinicalItem(jsonData.AddRiskFactor[index].pacr_que_name); //This searches item and clicks on add button
      await page.waitForTimeout(2000);    
       await riskFactor.handleSubCategoryPopup(page)   
      await page.getByLabel('cancelIcon').click();
      await riskFactor.selectandAddClinicalItem(jsonData.AddRiskFactor[index].pacr_que_name);
      //await riskFactorExtraDetails.clickOnClincialItemCollapsable();
      await page.waitForTimeout(1000);
      
      //await riskFactorExtraDetails.selectClinicalItemSubcategory(jsonData.EditRiskFactor[index].eli_text);                 
      await page.getByRole('checkbox', { name: 'Private record' }).click()
      await page.getByRole('checkbox', { name: 'Set as default' }).click()
      await riskFactorExtraDetails.enterRiskFactorNotes(jsonData.AddRiskFactor[index].risk_notes);
      await riskFactorExtraDetails.clickOnSaveExtraDetails();
      await page.waitForTimeout(1000);
     // await expect(page.getByText("Recommendation Record Added Successfully")).toHaveText("Recommendation Record Added Successfully");
      //await expect(page.getByText(`${clinicaCatergory} Record Added Successfully`)).toHaveText(`${clinicaCatergory} Record Added Successfully`); 
     
      ////// Database comparison- Patient Clinical Records - ADDING NEW riskFactor/////////
      sqlQuery =
      "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, risk_notes"+
      " from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join risk_factors on pacr_id=risk_pacr_id where pacr_record_status='approved'"+
      " and pacr_pat_id=" + patId +
      " and pacr_record_status='approved' and pacr_que_name='" + jsonData.AddRiskFactor[index].pacr_que_name +
      "' and pacr_category='Risk Factor' order by 1 desc limit 1";


    console.log("Manoj:  "+ sqlQuery);
           
    sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    results = await executeQuery(sqlQuery, sqlFilePath);
    const pacrId = results[0].pacr_id;
    console.log("\n Patient Clinical Records stored into the database: \n", results);
    var match = await compareJsons(sqlFilePath, null, jsonData.AddRiskFactor[index]);
    if (match) {
      console.log("\n Patient Clinical Records Comparision adding new Recommendation: Parameters from both JSON files match!\n");
    } else {
      console.log("\n Patient Clinical Records Comparision adding new Recommendation: Parameters from both JSON files do not match!\n");
    }
   
    await riskFactor.toggleSearchSection(); //Close the search section
      
      await riskFactor.clickOnItemDiv(jsonData.EditRiskFactor[index].pacr_que_name);
      await riskFactor.clickOnItemEdit();
     // await riskFactorExtraDetails.clickOnClincialItemCollapsable();
      //await riskFactorExtraDetails.selectClinicalItemSubcategory(jsonData.EditRiskFactor[index].eli_text);
            
      await riskFactorExtraDetails.enterRiskFactorNotes(jsonData.EditRiskFactor[index].risk_notes);
      await riskFactorExtraDetails.clickOnSaveExtraDetails();
      await page.waitForTimeout(1000);

       ////// Database comparison - Patient Clinical Records - UPDATE riskFactor/////////
     sqlQuery =
     "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, risk_notes"+
     " from patient_clinical_records join patient_clinical_records_details"+
     " on pacr_id=pacrd_pacr_id join risk_factors on pacr_id=risk_pacr_id where pacr_record_status='approved'"+
     " and pacrd_record_status='approved' and risk_record_status='approved' and pacr_id=" + pacrId +
     " and pacr_record_status='approved'";
          
     console.log("Manoj Edit query:"+sqlQuery);
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);

   console.log("\n Patient Clinical Records stored into the database: \n", results);
   var match = await compareJsons(sqlFilePath, null, jsonData.EditRiskFactor[index]);
   if (match) {
     console.log("\n Update Patient Clinical Records Comparision Edit riskFactor: Parameters from both JSON files match!\n");
   } else {
     console.log("\n Update Patient Clinical Records Comparision Edit riskFactor: Parameters from both JSON files do not match!\n");
   }

   ////////AUTO UPDATE RISK AFTER UPDATING OUTCOME /////
  
      // await riskFactor.clickOnItemHistory();
      // await riskFactor.clickOnHistoryItemDiv();
      await riskFactor.clickOnItemHistory();
      //await page.getByLabel('patientHistoryIconButton').click();
      await page.locator("xpath=//button[@aria-label='expandRowIcon2-4 lifetime SP']").nth(1).click();
      await page.waitForTimeout(1000);
      await page.locator("xpath=//button[@aria-label='expandRowIcon2-4 lifetime SP']").nth(1).click();
      //await riskFactor.clickOnHistoryItemDiv();
      await page.waitForTimeout(500);
      await riskFactor.closeWindow();
      await page.waitForTimeout(500);
     
     
      // await page.waitForTimeout(500);
      await riskFactor.clickOnItemHighlightNone();
      await page.waitForTimeout(500);
      await riskFactor.selectLowRiskLevel();
      await page.waitForTimeout(500);
      await riskFactor.selectModerateRiskLevel();
      await page.waitForTimeout(500);
      await riskFactor.selectHighRiskLevel();
      await page.waitForTimeout(500);
      await riskFactor.selectAllRiskLevel();
      await riskFactor.clickOnLevelTwoExtraDetails();
      await riskFactor.clickOnLevelThreeExtraDetails();
      await riskFactor.clickOnLevelOneExtraDetails();


      ////// Database comparison - Patient Clinical Records - UPDATE riskFactor RISK/////////
     sqlQuery =
     "select pacr_risk from patient_clinical_records where pacr_id=" + pacrId;
          
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);
   if(results[0].pacr_risk == jsonData.EditRiskFactor[index].pacr_risk){
    console.log(
      "\n Patient Clinical Records Comparision for Edit riskFactor Risk: RISK Updated Successfully! \n"
    );
   } else {
    console.log(
      "\n Patient Clinical Records Comparision for Edit riskFactor Risk: RISK Update Failed! \n"
    );
  }

     ///////// Deleting Item ////////////

      await riskFactor.clickOnItemEdit();
      await riskFactorExtraDetails.clickOnDelete();
      await riskFactorExtraDetails.clickOnCancelDelete();
      await riskFactorExtraDetails.clickOnDelete();
      await riskFactorExtraDetails.clickOnConfirmDelete();
      await riskFactorExtraDetails.enterDeleteReason(jsonData.DeleteRiskFactor[index].pacr_delete_reason);
      await riskFactorExtraDetails.clickOnSaveDeleteReason();
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
       jsonData.DeleteRiskFactor[index]
     );
     if (match) {
       console.log(
         "\n  Patient Clinical Records Comparision for Delete riskFactor: Parameters from both JSON files match!\n"
       );
     } else {
       console.log(
         "\n  Patient Clinical Records Comparision for Delete riskFactor: Parameters from both JSON files do not match!\n"
       );
     }        
     await page.waitForTimeout(1000);
      await riskFactor.clickOnMigratedItemsSection();
      await page.waitForTimeout(1000);
      await riskFactor.clickOnDeletedItemsSection();
      await page.waitForTimeout(1000);
      await riskFactor.clickOnArchivedItemsSection();
      await page.waitForTimeout(1000);
      // await riskFactor.clickOnAllItemsSection();
      // await riskFactor.toggleHistorySection(); // Close the history section

     
     // await page.pause();
    }
  });
});
