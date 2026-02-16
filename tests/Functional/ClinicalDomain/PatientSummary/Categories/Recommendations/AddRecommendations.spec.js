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
import RecommendationED from "../../../../../../Pages/ClinicalDomain/PatientSummary/Categories/Recommendations/RecommendationAddED";
import ClinicalSummary from "../../../../../../Pages/ClinicalDomain/PatientSummary/ClinicalSummary";
import ClinicalExtraDetails from "../../../../../../Pages/ClinicalDomain/PatientSummary/ClinicalExtraDetails";


import { TIMEOUT } from "dns";
import { error } from "console";
import { before } from "node:test";
import { toggleDivVisibility } from "../../../../../../UtilFiles/DynamicUtility";

// Array to store console logs

const consoleLogs = [];
let jsonData;

test.describe("Excel Conversion Recommendations Category", () => {
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

test.describe("Recommendations Category", () => {
  test("Add Recommendations", async ({ page }) => {
    if (!jsonData || !jsonData.PatientDetails) {
      throw new Error("JSON data is missing or invalid.");
    }
    let index = 0;
    for (const data of jsonData.PatientDetails) {
      const loginpage = new LoginPage(page);
      const homepage = new Homepage(page);
      const environment = new Environment(page);
      const confirmexisting = new ConfirmExisting(page);
      const recommendationEd = new RecommendationED(page);
      const contacthistory = new ContactHistory(page);
      const patientsearch = new PatientSearch(page);
      const Recommendations = new ClinicalSummary(page);
      const RecommendationsExtraDetails = new ClinicalExtraDetails(page);
      

      const menu = new Menu(page);
      await page.goto(environment.Test);
      await loginpage.enterUsername(jsonData.loginDetails[0].username);
      logger.info("Username enter successfully");
      await loginpage.enter_Password(jsonData.loginDetails[0].password);
      logger.info("Password enter successfully");
      await loginpage.clickOnLogin();      
      logger.info("Clicked on Login button successfully");
      //await homepage.clickOnHomeDashboardIcon()
      await homepage.clickOnPatientIcon();
      logger.info("Clicked on Patient Icon successfully");
      await patientsearch.clickOnSearchButton();
      logger.info("Clicked on Search button successfully");
      await patientsearch.enterGivenName(data.pat_firstname);
      logger.info("Given Name entered successfully");
      //await page.pause()
      await patientsearch.enterFamilyName(data.pat_surname);
      logger.info("Family Name entered successfully");
     // await patientsearch.selectSex(data.pat_sex);

      //await page.pause()
    await patientsearch.selectBornDate(jsonData.PatientDetails[index].pat_dob);
      //await patientsearch.selectBornDate(formattedDate);
      await patientsearch.clickOnSearchButton();
      await patientsearch.clickOnSearchPatientLink();
      await page.waitForTimeout(1500);
      await confirmexisting.clickOnConfirmExistingDetails(); 
      await page.waitForTimeout(1000);
      await page.pause()
      const alertPopup= await page.locator("xpath=//h2[text()='Alerts']").isVisible()      
      if(alertPopup==true)
        {       
          await Recommendations.closePopUp(page)
        }                 
       await page.waitForTimeout(1000)
       await contacthistory.clickOnShowFilter()
      await contacthistory.selectServiceFilter("General Medicine Automation");
      await contacthistory.selectContactReasonFilter("Assessments");
      //await contacthistory.enterContactDate("26/04/2024");
      await contacthistory.selectContactReason("Assessments");
      await contacthistory.selectContactLocation("Cardio Location");
      //await contacthistory.enterContactWith("Dr Sathya");
      await contacthistory.clickOnAddContact();
      await Recommendations.clickOnViewContactItemsMenu();
      await Recommendations.clickOnPinContactItemsMenu();
      await Recommendations.selectCategoryFromList("Recommendations");
      await page.waitForTimeout(5000)

       ////////REVIEW EXISTING ITEM AND DELETE/////
       if(await Recommendations.checkItemOnHistoryTable(jsonData.AddRecommendations[index].pacr_que_name)){
        await Recommendations.clickOnItemReview(jsonData.AddRecommendations[index].pacr_que_name);
        console.log("Item reviewed before deleting");
        await Recommendations.clickOnItemEdit(jsonData.AddRecommendations[index].pacr_que_name);
        await RecommendationsExtraDetails.clickOnDelete();
        await RecommendationsExtraDetails.clickOnConfirmDelete();
        await RecommendationsExtraDetails.enterDeleteReason('Deleted Existing item');
        await RecommendationsExtraDetails.clickOnSaveDeleteReason();
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



////////ADD NEW Recommendations/////
      await Recommendations.selectandAddClinicalItem(jsonData.AddRecommendations[index].pacr_que_name); //This searches item and clicks on add button
      await page.waitForTimeout(5000);
      await Recommendations.handleSubCategoryPopup(page) 
      await page.getByLabel('cancelIcon').click();
      await Recommendations.selectandAddClinicalItem(jsonData.AddRecommendations[index].pacr_que_name);  
      //await RecommendationsExtraDetails.clickOnClincialItemCollapsable();
      await page.waitForTimeout(3000);
      //await page.pause()
      //await RecommendationsExtraDetails.selectClinicalItemSubcategory(jsonData.EditRecommendations[index].eli_text);
      await RecommendationsExtraDetails.enterReviewDate(jsonData.AddRecommendations[index].recom_review_date.toString());
           
      await page.getByRole('checkbox', { name: 'Private record' }).click()
      await page.getByRole('checkbox', { name: 'Set as default' }).click()
      //await RecommendationsExtraDetails.enterClinicalItemNotes(jsonData.AddRecommendations[index].recom_notes);
      await recommendationEd.enterNotes();
      await RecommendationsExtraDetails.clickOnSaveExtraDetails();
      //await page.getByLabel('saveChecklist').click()
      await page.waitForTimeout(1000);
      await expect(page.getByText("Recommendation record added successfully")).toHaveText("Recommendation record added successfully");
      //await expect(page.getByText(`${clinicaCatergory} Record Added Successfully`)).toHaveText(`${clinicaCatergory} Record Added Successfully`); 
     
      ////// Database comparison- Patient Clinical Records - ADDING NEW Recommendations/////////
      sqlQuery =
      "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, recom_review_date, recom_notes"+
      " from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join recommendations on pacr_id=recom_pacr_id where pacr_record_status='approved'"+
      " and pacr_pat_id=" + patId +
      " and pacr_record_status='approved' and pacr_que_name='" + jsonData.AddRecommendations[index].pacr_que_name +
      "' and pacr_category='recommendation' order by 1 desc limit 1";


    console.log("Manoj:  "+ sqlQuery);
           
    sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    results = await executeQuery(sqlQuery, sqlFilePath);
    const pacrId = results[0].pacr_id;
    console.log("\n Patient Clinical Records stored into the database: \n", results);
    var match = await compareJsons(sqlFilePath, null, jsonData.AddRecommendations[index]);
    if (match) {
      console.log("\n Patient Clinical Records Comparision adding new Recommendation: Parameters from both JSON files match!\n");
    } else {
      console.log("\n Patient Clinical Records Comparision adding new Recommendation: Parameters from both JSON files do not match!\n");
    }
   
    await Recommendations.toggleSearchSection(); //Close the search section
      
      await Recommendations.clickOnItemDiv(jsonData.EditRecommendations[index].pacr_que_name);
      await Recommendations.clickOnItemEdit();
      //await RecommendationsExtraDetails.clickOnClincialItemCollapsable();
     // await RecommendationsExtraDetails.selectClinicalItemSubcategory(jsonData.EditRecommendations[index].eli_text);
      await RecommendationsExtraDetails.enterReviewDate(jsonData.EditRecommendations[index].recom_review_date.toString());      
      //await RecommendationsExtraDetails.enterClinicalItemNotes(jsonData.EditRecommendations[index].recom_notes);
      await recommendationEd.enterNotes();
      await RecommendationsExtraDetails.clickOnSaveExtraDetails();
      await page.waitForTimeout(1000);

       ////// Database comparison - Patient Clinical Records - UPDATE Recommendations/////////
     sqlQuery =
     "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, recom_review_date, recom_notes"+
     " from patient_clinical_records join patient_clinical_records_details"+
     " on pacr_id=pacrd_pacr_id join recommendations on pacr_id=recom_pacr_id where pacr_record_status='approved'"+
     " and pacrd_record_status='approved' and recom_record_status='approved' and pacr_id=" + pacrId +
     " and pacr_record_status='approved'";
          
     console.log("Manoj Edit query:"+sqlQuery);
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);

   console.log("\n Patient Clinical Records stored into the database: \n", results);
   var match = await compareJsons(sqlFilePath, null, jsonData.EditRecommendations[index]);
   if (match) {
     console.log("\n Update Patient Clinical Records Comparision Edit Recommendations: Parameters from both JSON files match!\n");
   } else {
     console.log("\n Update Patient Clinical Records Comparision Edit Recommendations: Parameters from both JSON files do not match!\n");
   }

   ////////AUTO UPDATE RISK AFTER UPDATING OUTCOME /////
      await Recommendations.clickOnItemHistory();
      await Recommendations.clickOnHistoryItemDiv();
      await page.waitForTimeout(500);
      await Recommendations.closeWindow();
      await page.waitForTimeout(500);
     
     
      // await page.waitForTimeout(500);
      await Recommendations.clickOnItemHighlightNone();
      await page.waitForTimeout(500);
      await Recommendations.selectLowRiskLevel();
      await page.waitForTimeout(500);
      await Recommendations.selectModerateRiskLevel();
      await page.waitForTimeout(500);
      await Recommendations.selectHighRiskLevel();
      await page.waitForTimeout(500);
      await Recommendations.selectAllRiskLevel();
      await Recommendations.clickOnLevelTwoExtraDetails();
      await Recommendations.clickOnLevelThreeExtraDetails();
      await Recommendations.clickOnLevelOneExtraDetails();


      ////// Database comparison - Patient Clinical Records - UPDATE Recommendations RISK/////////
     sqlQuery =
     "select pacr_risk from patient_clinical_records where pacr_id=" + pacrId;
          
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);
   if(results[0].pacr_risk == jsonData.EditRecommendations[index].pacr_risk){
    console.log(
      "\n Patient Clinical Records Comparision for Edit Recommendations Risk: RISK Updated Successfully! \n"
    );
   } else {
    console.log(
      "\n Patient Clinical Records Comparision for Edit Recommendations Risk: RISK Update Failed! \n"
    );
  }

     ///////// Deleting Item ////////////

      await Recommendations.clickOnItemEdit();
      await RecommendationsExtraDetails.clickOnDelete();
      await RecommendationsExtraDetails.clickOnCancelDelete();
      await RecommendationsExtraDetails.clickOnDelete();
      await RecommendationsExtraDetails.clickOnConfirmDelete();
      await RecommendationsExtraDetails.enterDeleteReason(jsonData.DeleteRecommendations[index].pacr_delete_reason);
      await RecommendationsExtraDetails.clickOnSaveDeleteReason();
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
       jsonData.DeleteRecommendations[index]
     );
     if (match) {
       console.log(
         "\n  Patient Clinical Records Comparision for Delete Recommendations: Parameters from both JSON files match!\n"
       );
     } else {
       console.log(
         "\n  Patient Clinical Records Comparision for Delete Recommendations: Parameters from both JSON files do not match!\n"
       );
     }        

     //await page.pause()
      await Recommendations.clickOnMigratedItemsSection();
      await Recommendations.clickOnDeletedItemsSection();
      await page.waitForTimeout(1000);
      await Recommendations.clickOnArchivedItemsSection();
      //await Recommendations.clickOnAllItemsSection();
      //await Recommendations.toggleHistorySection(); // Close the history section

     
     // await page.pause();
    }
  });
});
