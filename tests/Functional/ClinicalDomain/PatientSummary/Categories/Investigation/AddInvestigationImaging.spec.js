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
import { toggleDivVisibility } from "../../../../../../UtilFiles/DynamicUtility";
import { invalid } from "moment";

// Array to store console logs

const consoleLogs = [];
let jsonData;

test.describe("Excel Conversion Investigations Category", () => {
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

test.describe("Investigations Category", () => {
  test("Add Investigations", async ({ page }) => {
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
      const Investigations = new ClinicalSummary(page);
      const InvestigationsExtraDetails = new ClinicalExtraDetails(page);
      

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
      await patientsearch.selectSex(data.pat_sex);

    await patientsearch.selectBornDate(jsonData.PatientDetails[index].pat_dob);
      //await patientsearch.selectBornDate(formattedDate);
      await patientsearch.clickOnSearchButton();
      await patientsearch.clickOnSearchPatientLink();
      await page.waitForTimeout(1500);
      await confirmexisting.clickOnConfirmExistingDetails();  
         
       await contacthistory.clickOnShowFilter()
      await contacthistory.selectServiceFilter("General Medicine Automation");
      await contacthistory.selectContactReasonFilter("Assessments");
      await contacthistory.enterContactDate("26/04/2024");
      await contacthistory.selectContactReason("Assessments");
      await contacthistory.selectContactLocation("Cardio Location");
      //await contacthistory.enterContactWith("Dr Sathya");
      await contacthistory.clickOnAddContact();
      await Investigations.clickOnViewContactItemsMenu();
      await Investigations.clickOnPinContactItemsMenu();
      await Investigations.selectCategoryFromList("Investigations");
      await page.waitForTimeout(2000)
       await page.pause()
       ////////REVIEW EXISTING ITEM AND DELETE/////
       if(await Investigations.checkItemOnHistoryTable(jsonData.AddInvestigationImaging[index].pacr_que_name)){
       // await Investigations.clickOnItemReview(jsonData.AddInvestigationImaging[index].pacr_que_name);
       // console.log("Item reviewed before deleting");
        await Investigations.clickOnItemEdit(jsonData.AddInvestigationImaging[index].pacr_que_name);
        await InvestigationsExtraDetails.clickOnDelete();
        await InvestigationsExtraDetails.clickOnConfirmDelete();
        await InvestigationsExtraDetails.enterDeleteReason('Deleted Existing item');
        await InvestigationsExtraDetails.clickOnSaveDeleteReason();
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

////////ADD NEW Investigations- Imaging/////
      await Investigations.selectandAddInvestigation(jsonData.AddInvestigationImaging[index].pacr_que_name); //This searches item and clicks on add button
      await page.waitForTimeout(2000);      
      await InvestigationsExtraDetails.clickOnClincialItemCollapsable();
      await page.waitForTimeout(1000);
      await InvestigationsExtraDetails.selectClinicalItemSubcategory(jsonData.AddInvestigationImaging[index].eli_text);
      await InvestigationsExtraDetails.selectInvStatus(jsonData.AddInvestigationImaging[index].status);
      await page.waitForTimeout(500)
      await page.getByRole('checkbox', { name: 'Private record' }).click()
     // await //page.getByRole('checkbox', { name: 'Set as default' }).click()
      //await InvestigationsExtraDetails.selectInvOutstanding(jsonData.AddInvestigation[index].outstanding);
      await InvestigationsExtraDetails.selectInvReason(jsonData.AddInvestigationImaging[index].reason);
      await InvestigationsExtraDetails.enterInvResult(jsonData.AddInvestigationImaging[index].result);
      //await InvestigationsExtraDetails.selectInvOutcome(jsonData.AddInvestigationImaging[index].outcome);
      await InvestigationsExtraDetails.selectInvCritical(jsonData.AddInvestigationImaging[index].critical);
      await InvestigationsExtraDetails.enterInvDateOfUpload(jsonData.AddInvestigationImaging[index].date);
      await InvestigationsExtraDetails.selectInvPatLocation(jsonData.AddInvestigationImaging[index].location);
     // await InvestigationsExtraDetails.enterInvCompletedDate(jsonData.AddInvestigation[index].dateCompleted);
      await InvestigationsExtraDetails.enterInvReviewDate(jsonData.AddInvestigationImaging[index].dateReview);
      await InvestigationsExtraDetails.selectInvPriority(jsonData.AddInvestigationImaging[index].priority);
      await InvestigationsExtraDetails.selectRequestedBy(jsonData.AddInvestigationImaging[index].requested_by);
      await InvestigationsExtraDetails.selectInvSendTo(jsonData.AddInvestigationImaging[index].sendTo);
      await InvestigationsExtraDetails.selectInvExtLocation(jsonData.AddInvestigationImaging[index].extLocation);
     // await InvestigationsExtraDetails.selectInvExtLocation(jsonData.AddInvestigation[index].extLocation);
     await page.pause() 
     await page.getByRole('checkbox', { name: 'For Imaging Request' }).click()
    await InvestigationsExtraDetails.selectForImagingRequest()
      //await page.waitForTimeout(500)
      //await InvestigationsExtraDetails.deselectForImagingRequest()
      await page.waitForTimeout(500)
  //await InvestigationsExtraDetails.selectForLabRequest()
   //   await page.waitForTimeout(500)
     // await InvestigationsExtraDetails.deselectForLabRequest()
      //await page.waitForTimeout(500)
      await InvestigationsExtraDetails.selectShareOnPortal()
      await page.waitForTimeout(500)
      await InvestigationsExtraDetails.deselectShareOnPortal()
      await page.waitForTimeout(500)
      await InvestigationsExtraDetails.selectShareOnPortal()
      await InvestigationsExtraDetails.clickOPrivateRecord()
      await InvestigationsExtraDetails.clickOnSetAsDefault()
      await InvestigationsExtraDetails.enterInvNotes(jsonData.AddInvestigationImaging[index].notes);
      await InvestigationsExtraDetails.clickOnSaveExtraDetails();
      await page.waitForTimeout(1000);
      await InvestigationsExtraDetails.selectlinks()
      await page.waitForTimeout(1000);
      await InvestigationsExtraDetails.ImagingRequestLink()
      await page.waitForTimeout(1000);
      await InvestigationsExtraDetails.selectLabRequestCheckbox()
      await page.waitForTimeout(1000);
      await InvestigationsExtraDetails.createImagingRequest()
      await page.waitForTimeout(1000);
      await InvestigationsExtraDetails.selectClosePopUp()
 
      //await expect(page.getByText("Investigation record added successfully")).toHaveText("Investigation record added successfully");
      //await expect(page.getByText(`${clinicaCatergory} Record Added Successfully`)).toHaveText(`${clinicaCatergory} Record Added Successfully`); 
      await page.pause()
    //   ////// Database comparison- Patient Clinical Records - ADDING NEW Investigations/////////
    //   sqlQuery =
    //   "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk,inte_outcome_eli_text, inte_notes"+
    //   " from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join Investigations on pacr_id=inte_pacr_id where pacr_record_status='approved'"+
    //   " and pacr_pat_id=" + patId +
    //   " and pacr_record_status='approved' and pacr_que_name='" + jsonData.AddInvestigation[index].pacr_que_name +
    //   "' and pacr_category='interpretation' order by 1 desc limit 1";


    // console.log("Manoj add interpretation:  "+ sqlQuery);
           
    // sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    // results = await executeQuery(sqlQuery, sqlFilePath);
    // const pacrId = results[0].pacr_id;
    // console.log("\n Patient Clinical Records stored into the database: \n", results);
    // var match = await compareJsons(sqlFilePath, null, jsonData.AddInvestigation[index]);
    // if (match) {
    //   console.log("\n Patient Clinical Records Comparision adding new Investigations: Parameters from both JSON files match!\n");
    // } else {
    //   console.log("\n Patient Clinical Records Comparision adding new Investigations: Parameters from both JSON files do not match!\n");
    // }
   
    await Investigations.toggleSearchSection(); //Close the search section
      
      //await Investigations.clickOnItemDiv(jsonData.EditInvestigation[index].pacr_que_name);
      await Investigations.clickOnItemEdit();
      await InvestigationsExtraDetails.clickOnClincialItemCollapsable();
      await InvestigationsExtraDetails.selectInvStatus(jsonData.EditInvestigation[index].status);
      await InvestigationsExtraDetails.enterInvResult(jsonData.EditInvestigation[index].result);      
      await InvestigationsExtraDetails.enterInvCompletedDate(jsonData.EditInvestigation[index].dateCompleted);
      await InvestigationsExtraDetails.enterInvNotes(jsonData.EditInvestigation[index].notes);
      await InvestigationsExtraDetails.clickShowSubtest()
      await page.getByTestId('Show Sub-Tests').click();
      await page.getByRole('textbox', { name: 'valueundefinedsubTest0' }).click();
      await page.getByRole('textbox', { name: 'valueundefinedsubTest0' }).fill('12');
      await page.getByRole('textbox', { name: 'targetnullsubTest0' }).click();
      await page.getByRole('textbox', { name: 'targetnullsubTest0' }).fill('13');
      await page.getByRole('textbox', { name: 'valueundefinedsubTest1' }).click();
      await page.getByRole('textbox', { name: 'valueundefinedsubTest1' }).fill('10');
      await page.getByRole('textbox', { name: 'targetnullsubTest1' }).click();
      await page.getByRole('textbox', { name: 'targetnullsubTest1' }).fill('9');
      // await InvestigationsExtraDetails.enterCreatineValue(jsonData.EditInvestigation[index].value1);
      // await InvestigationsExtraDetails.enterCreatineTarget(jsonData.EditInvestigation[index].target1);
      // await InvestigationsExtraDetails.enterUreaValue(jsonData.EditInvestigation[index].value2);
      // await InvestigationsExtraDetails.enterUreaTarget(jsonData.EditInvestigation[index].target2);
      await InvestigationsExtraDetails.clickOnSaveExtraDetails();
      //await expect(page.getByText("Investigation record updated successfully")).toHaveText("Investigation record updated successfully");
      await page.waitForTimeout(1000);

       ////// Database comparison - Patient Clinical Records - UPDATE Investigations/////////
  //    sqlQuery =
  //    "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk,inte_outcome_eli_text, inte_notes"+
  //    " from patient_clinical_records join patient_clinical_records_details"+
  //    " on pacr_id=pacrd_pacr_id join Investigations on pacr_id=inte_pacr_id where pacr_record_status='approved'"+
  //    " and pacrd_record_status='approved' and inte_record_status='approved' and pacr_id=" + pacrId +
  //    " and pacr_record_status='approved'";
          
  //    console.log("Manoj Edit query:"+sqlQuery);
  //  sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
  //  results = await executeQuery(sqlQuery, sqlFilePath);

  //  console.log("\n Patient Clinical Records stored into the database: \n", results);
  //  var match = await compareJsons(sqlFilePath, null, jsonData.EditInvestigation[index]);
  //  if (match) {
  //    console.log("\n Update Patient Clinical Records Comparision Edit Investigations: Parameters from both JSON files match!\n");
  //  } else {
  //    console.log("\n Update Patient Clinical Records Comparision Edit Investigations: Parameters from both JSON files do not match!\n");
  //  }

   ////////AUTO UPDATE RISK AFTER UPDATING OUTCOME /////
      await Investigations.clickOnItemHistory();
      await Investigations.clickOnHistoryItemDiv();
      await page.waitForTimeout(500);
      await Investigations.closeWindow();
      await page.waitForTimeout(500);
     
     
      // await page.waitForTimeout(500);
      await Investigations.clickOnItemHighlightNone();
      await page.waitForTimeout(500);
      await Investigations.selectLowRiskLevel();
      await page.waitForTimeout(500);
      await Investigations.selectModerateRiskLevel();
      await page.waitForTimeout(500);
      await Investigations.selectHighRiskLevel();
      await page.waitForTimeout(500);
      await Investigations.selectAllRiskLevel();
      await Investigations.clickOnLevelTwoExtraDetails();
     // await Investigations.clickOnLevelThreeExtraDetails();
      await Investigations.clickOnLevelOneExtraDetails();


  //     ////// Database comparison - Patient Clinical Records - UPDATE Investigations RISK/////////
  //    sqlQuery =
  //    "select pacr_risk from patient_clinical_records where pacr_id=" + pacrId;
          
  //  sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
  //  results = await executeQuery(sqlQuery, sqlFilePath);
  //  if(results[0].pacr_risk == jsonData.EditInvestigation[index].pacr_risk){
  //   console.log("\n Patient Clinical Records Comparision for Edit Investigations Risk: RISK Updated Successfully! \n");
  //  } else {
  //   console.log("\n Patient Clinical Records Comparision for Edit Investigations Risk: RISK Update Failed! \n");
  // }

     ///////// Deleting Item ////////////

      await Investigations.clickOnItemEdit();
      await InvestigationsExtraDetails.clickOnDelete();
      await InvestigationsExtraDetails.clickOnCancelDelete();
      await InvestigationsExtraDetails.clickOnDelete();
      await InvestigationsExtraDetails.clickOnConfirmDelete();
      await InvestigationsExtraDetails.enterDeleteReason(jsonData.DeleteInvestigation[index].pacr_delete_reason);
      await page.pause()
      await InvestigationsExtraDetails.clickOnSaveDeleteReason();
    //  await expect(page.getByText('Investigation deleted successfully')).toHaveText('Investigation deleted successfully')

      await page.waitForTimeout(1000)    

    //    ////// Database comparison- Patient Clinical Records - DELETE OUTCOME/////////
    //    sqlQuery ="select pacr_que_name, pacr_delete_reason from patient_clinical_records where pacr_id=" +
    //    pacrId + " and pacr_record_status='wrong'";

    //  sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    //  results = await executeQuery(sqlQuery, sqlFilePath);
    //  //  pacrId=results[0].pacr_id;
    //  console.log("\n Patient Details stored into the database: \n", results);
    //  var match = await compareJsons(sqlFilePath, null, jsonData.DeleteInterpretation[index]);
    //  if (match) {
    //    console.log("\n  Patient Clinical Records Comparision for Delete Investigations: Parameters from both JSON files match!\n");
    //  } else {
    //    console.log("\n  Patient Clinical Records Comparision for Delete Investigations: Parameters from both JSON files do not match!\n");
    //  }        
    //   await Investigations.clickOnMigratedItemsSection();
    //   await Investigations.clickOnDeletedItemsSection();
    //   await page.waitForTimeout(1000);
    //   await Investigations.clickOnArchivedItemsSection();
    //   await Investigations.clickOnAllItemsSection();
    //   await Investigations.toggleHistorySection(); // Close the history section
   
     // await page.pause();
    }
  
  

})
});
