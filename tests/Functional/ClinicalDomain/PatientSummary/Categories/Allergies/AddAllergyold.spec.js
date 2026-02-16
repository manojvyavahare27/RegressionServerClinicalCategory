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

test.describe("Excel Conversion Allergy Category", () => {
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


test.describe("Allergy Category", () => {
  test("Add Allergy", async ({ page }) => {
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
      const allergy = new ClinicalSummary(page);
      const allergyExtraDetails = new ClinicalExtraDetails(page);
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
     
      //await page.pause()
      await patientsearch.clickOnSearchPatientLink();
      await page.waitForTimeout(1500);
      await confirmexisting.clickOnConfirmExistingDetails();     
       await contacthistory.clickOnShowFilter()  
      await contacthistory.selectServiceFilter("General Medicine Automation");
      await contacthistory.selectContactReasonFilter("Assessments");
      //await contacthistory.enterContactDate("24-06-2024");
      await contacthistory.selectContactReason("Assessments");
      await contacthistory.selectContactLocation("Cardio Location");
      //  await contacthistory.enterContactWith("Dr Sathya");
      //await page.pause()
      await contacthistory.clickOnAddContact();      
       await allergy.selectCategoryFromList(jsonData.AddAllergy[index].pacr_category);
       await page.waitForTimeout(2000)
    //    await contacthistory.clickOnSettingButton()
    //    await contacthistory.clickOnCustomizableView()
       

      await allergy.clickOnViewContactItemsMenu();
      await allergy.clickOnPinContactItemsMenu();
      await allergy.selectCategoryFromList(jsonData.AddAllergy[index].pacr_category);
      await page.waitForTimeout(2000)
      await page.pause()
       ////////REVIEW EXISTING ITEM AND DELETE/////

       if(await allergy.checkItemOnHistoryTable(jsonData.AddAllergy[index].pacr_que_name)){
        //await allergy.clickOnItemReview(jsonData.AddAllergy[index].pacr_que_name);
        //console.log("Item reviewed before deleting");
        await allergy.clickOnItemEdit(jsonData.AddAllergy[index].pacr_que_name);
        await allergyExtraDetails.clickOnDelete();
        await allergyExtraDetails.clickOnConfirmDelete();
        await allergyExtraDetails.enterDeleteReason('Deleted Existing item');
        await allergyExtraDetails.clickOnSaveDeleteReason();
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

     

////////ADD NEW Allergy/////

       await allergy.selectandAddClinicalItem(jsonData.AddAllergy[index].pacr_que_name); //This searches item and clicks on add button
       await page.waitForTimeout(2000);  
     // await page.pause()
      //await allergyExtraDetails.clickOnClincialItemCollapsableAllergy1();

      await page.waitForTimeout(1000);
     // await page.locator("xpath=//div[@data-testid='allergies']").click()
      await page.waitForTimeout(500);
      await allergyExtraDetails.clickOnclinicalSubcategoryAllergy();
      await allergyExtraDetails.clickOnSpecificAllergyName()           
      await page.getByRole('checkbox', { name: 'Private record' }).click()     
      await page.getByTestId('episodes[0].id').getByLabel('cellmaAccordionIcon').click()
      await page.waitForTimeout(1000);
     //await page.pause()
      await allergyExtraDetails.enterAllergyStartDate(jsonData.AddAllergy[index].alrg_start_date)

      await allergyExtraDetails.enterAllergyEndDate(jsonData.AddAllergy[index].alrg_end_date)
      await allergyExtraDetails.selectReaction(jsonData.AddAllergy[index].eli_text)
      await allergyExtraDetails.selectReactionSevirity(jsonData.AddAllergy[index].alrg_reaction_severity)
      await allergyExtraDetails.enterallergyTextArea(jsonData.AddAllergy[index].alrg_notes)
      //await page.locator("xpath=//button[@aria-label='saveExtraDetails']").click()
      //await page.pause()
      await allergyExtraDetails.clickOnSaveExtraDetails();
     // await page.getByLabel('saveChecklist').click()
     await page.getByRole('button', { name: 'cancelIcon' }).click()
      await page.waitForTimeout(500);
      await expect(page.getByText("Allergy record added successfully")).toHaveText("Allergy record added successfully");
      //await expect(page.getByText(`${clinicaCatergory} Record Added Successfully`)).toHaveText(`${clinicaCatergory} Record Added Successfully`); 
     // await page.pause()
    
sqlQuery="select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk,  alrg_start_date, alrg_end_date, alrg_notes"+
" from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join allergies on pacr_id=alrg_pacr_id where pacr_record_status='approved'"+
" and pacr_pat_id=" + patId + " and pacrd_record_status='approved' and alrg_record_status='approved' and pacr_que_name='" + jsonData.AddAllergy[index].pacr_que_name +
      "' and pacr_category='allergies' order by 1 desc limit 1";

    console.log(sqlQuery)
      //select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, diag_date_onset, diag_date_firstseen, diag_date_diagnosed, diag_notes from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join diagnosis on pacr_id=diag_pacr_id where pacr_record_status='approved' and pacrd_record_status='approved' and diag_record_status='approved' and pacr_pat_id='787755' and pacr_record_status='approved' and pacr_que_name='Dengue haemorrhagic fever' and pacr_category='diagnosis' order by 1 desc limit 1;
           
    sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    results = await executeQuery(sqlQuery, sqlFilePath);
    const pacrId = results[0].pacr_id;
    console.log("\n Patient Clinical Records stored into the database: \n", results);
    var match = await compareJsons(sqlFilePath, null, jsonData.AddAllergy[index]);
    if (match) {
      console.log("\n Patient Clinical Records Comparision adding new Allergy: Parameters from both JSON files match!\n");
    } else {
      console.log("\n Patient Clinical Records Comparision adding new Allergy: Parameters from both JSON files do not match!\n");
    }

    await allergy.toggleSearchSection(); //Close the search section
      await allergy.clickOnItemDiv(jsonData.EditAllergy[index].pacr_que_name);
      await allergy.clickOnItemEdit();
      await page.waitForTimeout(1000);
      await page.locator("xpath=//button[@aria-label='cancelIcon']").click()
      await page.waitForTimeout(1000);
      await allergy.clickOnItemEdit();
      //await page.locator("xpath=//div[@data-testid='allergies']").click()
      await page.waitForTimeout(500);
      await page.locator("xpath=//div[@data-testid='episodes[0].id']").click()
      await page.waitForTimeout(500);
      await allergyExtraDetails.clickOnclinicalSubcategoryAllergy();
      await allergyExtraDetails.clickOnSpecificAllergyName()           
      await page.getByRole('checkbox', { name: 'Private record' }).click()   

     // await allergyExtraDetails.selectFrequency("1");
     //await page.pause()
     await allergyExtraDetails.enterAllergyStartDate(jsonData.EditAllergy[index].alrg_start_date)
     await allergyExtraDetails.enterAllergyEndDate(jsonData.EditAllergy[index].alrg_end_date)
     //await allergyExtraDetails.selectReaction(jsonData.EditAllergy[index].eli_text)
     //await allergyExtraDetails.selectReactionSevirity(jsonData.EditAllergy[index].alrg_reaction_severity)
     await allergyExtraDetails.enterallergyTextArea(jsonData.EditAllergy[index].alrg_notes)

      //await allergyExtraDetails.enterClinicalItemNotes("Updated Allergy Notes From Playwright");
     // await page.pause()
      //await page.locator("xpath=//button[@aria-label='saveExtraDetails']").click()
      await allergyExtraDetails.clickOnSaveExtraDetails();
     // await page.getByLabel('saveChecklist').click()
      await page.waitForTimeout(1000);
      await expect(page.getByText('Allergy record updated successfully')).toHaveText('Allergy record updated successfully')

       ////// Database comparison - Patient Clinical Records - UPDATE Allergy/////////
     sqlQuery =
     "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk,  alrg_notes"+
     " from patient_clinical_records join patient_clinical_records_details"+
     " on pacr_id=pacrd_pacr_id join allergies on pacr_id=alrg_pacr_id where pacr_record_status='approved'"+
     " and pacrd_record_status='approved' and alrg_record_status='approved' and pacr_id=" + pacrId +
     " and pacr_record_status='approved'";
          
     console.log("Manoj:"+sqlQuery);
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);

   console.log("\n Patient Clinical Records stored into the database: \n", results);
   var match = await compareJsons(sqlFilePath, null, jsonData.EditAllergy[index]);
   if (match) {
     console.log(
       "\n Update Patient Clinical Records Comparision Edit Allergy: Parameters from both JSON files match!\n"
     );
   } else {
     console.log(
       "\n Update Patient Clinical Records Comparision Edit Allergy: Parameters from both JSON files do not match!\n"
     );
   }

   //await page.pause()
   ////////AUTO UPDATE RISK AFTER UPDATING OUTCOME /////
      // await allergy.clickOnItemHistory();
      // await allergy.clickOnHistoryItemDiv();
      // await page.waitForTimeout(500);
      // await allergy.closeWindow();
      // await page.waitForTimeout(500);
     
      // await diagnosis.clickOnItemReview();
      // await page.waitForTimeout(500);
      await allergy.clickOnItemHighlightNone();
      await page.waitForTimeout(500);
      await allergy.selectLowRiskLevel();
      await page.waitForTimeout(500);
      await allergy.selectModerateRiskLevel();
      await page.waitForTimeout(500);
      await allergy.selectHighRiskLevel();
      await page.waitForTimeout(500);
      await allergy.selectAllRiskLevel();
      await allergy.clickOnLevelTwoExtraDetails();
      await allergy.clickOnLevelThreeExtraDetails();
      await allergy.clickOnLevelOneExtraDetails();


      ////// Database comparison - Patient Clinical Records - UPDATE Allergy RISK/////////
     sqlQuery =
     "select pacr_risk from patient_clinical_records where pacr_id=" + pacrId;
          
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);
   if(results[0].pacr_risk == jsonData.EditAllergy[index].pacr_risk){
    console.log(
      "\n Patient Clinical Records Comparision for Edit Allergy Risk: RISK Updated Successfully! \n"
    );
   } else {
    console.log(
      "\n Patient Clinical Records Comparision for Edit Allergy Risk: RISK Update Failed! \n"
    );
  }

     ///////// Deleting Item ////////////

      //await page.pause()
      await allergy.clickOnItemEdit();
      await allergyExtraDetails.clickOnDelete();
      await allergyExtraDetails.clickOnCancelDelete();
      await allergyExtraDetails.clickOnDelete();
      await allergyExtraDetails.clickOnConfirmDelete();
      await allergyExtraDetails.enterDeleteReason(jsonData.DeleteAllergy[index].pacr_delete_reason);
      await allergyExtraDetails.clickOnSaveDeleteReason();
      await page.waitForTimeout(1000)
    

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
       jsonData.DeleteAllergy[index]
     );
     if (match) {
       console.log(
         "\n  Patient Clinical Records Comparision for Delete Allergy: Parameters from both JSON files match!\n"
       );
     } else {
       console.log(
         "\n  Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n"
       );
     }
     

     await page.pause();
      // await allergy.clickOnCurrentItemsSection();
      // await allergy.clickOnMigratedItemsSection();
      // await allergy.clickOnDeletedItemsSection();
      await page.waitForTimeout(1000);
     // await diagnosis.clickOnArchivedItemsSection();
      await allergy.clickOnAllItemsSection();
      await allergy.toggleHistorySection(); // Close the history section

     
     // await page.pause();
    }
  });
});
