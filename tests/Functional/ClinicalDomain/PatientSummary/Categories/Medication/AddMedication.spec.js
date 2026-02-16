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

test.describe("Excel Conversion Medications Category", () => {
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

test.describe("Medications Category", () => {
  test("Add Medications", async ({ page }) => {
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
      const Medications = new ClinicalSummary(page);
      const MedicationsExtraDetails = new ClinicalExtraDetails(page);
      

      const menu = new Menu(page);
      await page.goto(environment.Test);
      await loginpage.enterUsername(jsonData.loginDetails[0].username);
      logger.info("Username enter successfully");
      await loginpage.enter_Password(jsonData.loginDetails[0].password);
      logger.info("Password enter successfully");
      await loginpage.clickOnLogin();      
      logger.info("Clicked on Login button successfully");
      await page.pause()
    
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
      await page.waitForTimeout(700);
      await confirmexisting.clickOnConfirmExistingDetails();    
      // const alertPopup= await page.locator("xpath=//h2[text()='Alerts']").isVisible()      
      // if(alertPopup==true)
      //   {       
      //     await Medications.closePopUp(page)
      //   } 
      
      await page.waitForTimeout(5000)
      const closeButton = page.locator("xpath=//button[@aria-label='cancelIcon']");

if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
    console.log("Popup closed");
} else {
    console.log("Close button not found");
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
      await Medications.clickOnViewContactItemsMenu();
      await Medications.clickOnPinContactItemsMenu();
      await Medications.selectCategoryFromList("Medications");
      await page.waitForTimeout(2000);
      //await page.pause();
     
       ////////REVIEW EXISTING ITEM AND DELETE/////
       if(await Medications.checkItemOnHistoryTable(jsonData.AddMedication[index].pacr_que_name)){
        //await Medications.clickOnItemReview(jsonData.AddMedication[index].pacr_que_name);
        //console.log("Item reviewed before deleting");
        await Medications.clickOnItemEdit(jsonData.AddMedication[index].pacr_que_name);
        await page.waitForTimeout(1000)
        await MedicationsExtraDetails.clickOnDelete();
        await MedicationsExtraDetails.clickOnConfirmDelete();
        await MedicationsExtraDetails.enterDeleteReason('Deleted Existing item');
        await MedicationsExtraDetails.clickOnSaveDeleteReason();
        console.log('\x1bItem was deleted successfully\x1b[0m');
        }
        await page.waitForTimeout(2000)

        //await page.pause()
       
       //////Fetch Patient Details/////////
      var sqlQuery =
      "select * from patient_audit where paa_use_username='" + jsonData.loginDetails[0].username + 
      "' and paa_type='selected' order by 1 desc limit 1";
      var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
      var results = await executeQuery(sqlQuery, sqlFilePath);
      console.log("\n Patient Details stored into the database: \n", results);
      const patId = results[0].paa_pat_id;
      console.log("Patient Accessed by User:" + patId);

      await page.pause()
      //Add Favourites
      await Medications.clickOnFavouriteQueMedication();
        await page.waitForTimeout(500);
        await Medications.clickOnFavouritemItemMedication() 
        await page.waitForTimeout(2000);
        await MedicationsExtraDetails.enterOnDose(jsonData.AddMedication[index].medi_dose)
      await MedicationsExtraDetails.enterForm(jsonData.AddMedication[index].medi_form)
      await MedicationsExtraDetails.selectFrequency(jsonData.AddMedication[index].medi_frequency)
      await MedicationsExtraDetails.selectRoute(jsonData.AddMedication[index].medi_route)
      await MedicationsExtraDetails.enterDays(jsonData.AddMedication[index].medi_duration)
      await MedicationsExtraDetails.selectSite(jsonData.AddMedication[index].meded_value)
      await MedicationsExtraDetails.selectPrescribeBy(jsonData.AddMedication[index].medi_prescribed_by)
      await MedicationsExtraDetails.enterStartDate(jsonData.AddMedication[index].medi_start_date)
      await MedicationsExtraDetails.enterReviewDate(jsonData.AddMedication[index].medi_stop_date) 
     
      await MedicationsExtraDetails.enterStopDate(jsonData.AddMedication[index].medi_stop_date)
      await MedicationsExtraDetails.selectSideEffects(jsonData.AddMedication[index].mse_text)  
      await MedicationsExtraDetails.selectIndication(jsonData.AddMedication[index].meded_value) 
      await MedicationsExtraDetails.selectStoppedReason(jsonData.AddMedication[index].medi_stopped_reason_eli_text)
      await MedicationsExtraDetails.selectPGDPSD(jsonData.AddMedication[index].meded_value_PGD) 
      //await MedicationsExtraDetails.enterMedicationGradeForAdministrator(jsonData.AddMedication[index].meded_value_Administrator)
      await MedicationsExtraDetails.selectMaxReffills(jsonData.AddMedication[index].meded_value_MaxReffills)    
      await MedicationsExtraDetails.enterUnit(jsonData.AddMedication[index].meded_value_Unit)
      await MedicationsExtraDetails.selectCurrentLocation(jsonData.AddMedication[index].pcl_location_name)     
      await MedicationsExtraDetails.selectAdherent(jsonData.AddMedication[index].meded_value_Adherent)
      await MedicationsExtraDetails.clickOnPrescribeAndSupply()
      await MedicationsExtraDetails.clickOnSuitableForDelivery()
      await MedicationsExtraDetails.clickOnAddToPrescribe()
      await MedicationsExtraDetails.clickOnSupply()
      await MedicationsExtraDetails.clickOnSetAsDefault()
      //await MedicationsExtraDetails.clickOnRepeatable()
      await MedicationsExtraDetails.clickOPrivateRecord()      
      await MedicationsExtraDetails.selectEndoserment(jsonData.AddMedication[index].paprd_endorsement)         
      await MedicationsExtraDetails.enterMedicationNotes(jsonData.AddMedication[index].medi_notes)
      await page.pause()    
      await MedicationsExtraDetails.clickOnSaveMediFavourites(); 
      
      // await Medications.clickOnCheckallCheckListcheckbox()  
      // await MedicationsExtraDetails.clickOnSaveChecklistButton()

     // await page.pause()
     // await MedicationsExtraDetails.clickOnSaveMediFavourites();  
      
      await page.waitForTimeout(1000);           

      //Delete Favourites
      await Medications.clickOnEditIconforFavouriteMedication()

      await MedicationsExtraDetails.clickOnDelete();
      await MedicationsExtraDetails.clickOnCancelDelete();
      await MedicationsExtraDetails.clickOnDelete();
      await MedicationsExtraDetails.clickOnConfirmDelete();
      await MedicationsExtraDetails.enterDeleteReason(jsonData.DeleteMedication[index].pacr_delete_reason);
      await MedicationsExtraDetails.clickOnSaveDeleteReason();

     

      
await page.pause()
        // Add New Medication
      await Medications.selectandAddClinicalItem(jsonData.AddMedication[index].pacr_que_name)
      await page.waitForTimeout(2000);      
       await Medications.handleSubCategoryPopup(page)
      await page.getByLabel('cancelIcon').click();
      //await MedicationsExtraDetails.clickOnClincialItemCollapsable();
      await Medications.selectandAddClinicalItem(jsonData.AddMedication[index].pacr_que_name)
      await page.waitForTimeout(1000);      
    
      //await MedicationsExtraDetails.selectClinicalItemSubcategory(jsonData.AddMedication[index].eli_text);
      await MedicationsExtraDetails.enterOnDose(jsonData.AddMedication[index].medi_dose)
      await page.getByTestId('Ok').click()
      await MedicationsExtraDetails.enterForm(jsonData.AddMedication[index].medi_form)
      await MedicationsExtraDetails.selectFrequency(jsonData.AddMedication[index].medi_frequency)
      await MedicationsExtraDetails.selectRoute(jsonData.AddMedication[index].medi_route)
      await MedicationsExtraDetails.enterDays(jsonData.AddMedication[index].medi_duration)
      await MedicationsExtraDetails.selectSite(jsonData.AddMedication[index].meded_value)
      await MedicationsExtraDetails.selectPrescribeBy(jsonData.AddMedication[index].medi_prescribed_by)
      await MedicationsExtraDetails.enterStartDate(jsonData.AddMedication[index].medi_start_date)
      await MedicationsExtraDetails.enterReviewDate(jsonData.AddMedication[index].medi_stop_date) 
     
      await MedicationsExtraDetails.enterStopDate(jsonData.AddMedication[index].medi_stop_date)
      await MedicationsExtraDetails.selectSideEffects(jsonData.AddMedication[index].mse_text)  
      await MedicationsExtraDetails.selectIndication(jsonData.AddMedication[index].meded_value) 
      await MedicationsExtraDetails.selectStoppedReason(jsonData.AddMedication[index].medi_stopped_reason_eli_text)
      await MedicationsExtraDetails.selectPGDPSD(jsonData.AddMedication[index].meded_value_PGD) 
    //  await MedicationsExtraDetails.enterMedicationGradeForAdministrator(jsonData.AddMedication[index].meded_value_Administrator)
      await MedicationsExtraDetails.selectMaxReffills(jsonData.AddMedication[index].meded_value_MaxReffills)       
     // await MedicationsExtraDetails.selectQuantity(jsonData.AddMedication[index].meded_value_Quantity)
     
      await MedicationsExtraDetails.enterUnit(jsonData.AddMedication[index].meded_value_Unit)
      await MedicationsExtraDetails.selectCurrentLocation(jsonData.AddMedication[index].pcl_location_name)
      //await MedicationsExtraDetails.enterLinkTiDiagnosis(jsonData.AddMedication[index].pacr_que_name_Diagnosis)
      //await MedicationsExtraDetails.selectStatus(jsonData.AddMedication[index].pacr_status)
      await MedicationsExtraDetails.selectAdherent(jsonData.AddMedication[index].meded_value_Adherent)
      await MedicationsExtraDetails.clickOnPrescribeAndSupply()
     // await MedicationsExtraDetails.clickOnSuitableForDelivery()
      await MedicationsExtraDetails.clickOnAddToPrescribe()
      await MedicationsExtraDetails.clickOnSupply()
      await MedicationsExtraDetails.clickOnSetAsDefault()
     // await MedicationsExtraDetails.clickOnRepeatable()
     // await MedicationsExtraDetails.clickOPrivateRecord()  
     

      await MedicationsExtraDetails.selectEndoserment(jsonData.AddMedication[index].paprd_endorsement) 
      
      //await MedicationsExtraDetails.selectForCondition(jsonData.AddMedication[index].que_display_text)
     // await MedicationsExtraDetails.enterPriceCheckQuantity(jsonData.AddMedication[index].meded_value_Price_check_quantity)  
      await MedicationsExtraDetails.enterMedicationNotes(jsonData.AddMedication[index].medi_notes) 
      await page.pause()

      await MedicationsExtraDetails.clickOnSaveExtraDetails();      
      await page.waitForTimeout(200);           
    //  await Medications.clickOnCheckallCheckListcheckbox()  
    //   await MedicationsExtraDetails.clickOnSaveChecklistButton()
      await expect(page.getByText("Medication record added successfully")).toHaveText("Medication record added successfully");
       
      //await expect(page.getByText(`${clinicaCatergory} Record Added Successfully`)).toHaveText(`${clinicaCatergory} Record Added Successfully`); 
     
      ////// Database comparison- Patient Clinical Records - ADDING NEW Medications/////////
      sqlQuery =
      "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, medi_notes"+
      " from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join Medications on pacr_id=medi_pacr_id where pacr_record_status='approved'"+
      " and pacr_pat_id=" + patId +
      " and pacr_record_status='approved' and pacr_que_name='" + jsonData.AddMedication[index].pacr_que_name +
      "' and pacr_category='Medication' order by 1 desc limit 1";


    console.log("Manoj add Medications:  "+ sqlQuery);           
    sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    results = await executeQuery(sqlQuery, sqlFilePath);
    const pacrId = results[0].pacr_id;
    console.log("\n Patient Clinical Records stored into the database: \n", results);
    var match = await compareJsons(sqlFilePath, null, jsonData.AddMedication[index]);
    if (match) {
      console.log("\n Patient Clinical Records Comparision adding new Medications: Parameters from both JSON files match!\n");
    } else {
      console.log("\n Patient Clinical Records Comparision adding new Medications: Parameters from both JSON files do not match!\n");
    }
   
    
      await page.pause()    
      await Medications.clickOnItemEdit();      
      await MedicationsExtraDetails.enterOnDose(jsonData.EditMedication[index].medi_dose)      
      await MedicationsExtraDetails.selectFrequency(jsonData.EditMedication[index].medi_frequency)
      await MedicationsExtraDetails.selectRoute(jsonData.EditMedication[index].medi_route)
      await MedicationsExtraDetails.enterDays(jsonData.EditMedication[index].medi_duration)
      await MedicationsExtraDetails.selectSite(jsonData.EditMedication[index].meded_value)     
      await MedicationsExtraDetails.selectPrescribeBy(jsonData.EditMedication[index].medi_prescribed_by)
      await MedicationsExtraDetails.enterStartDate(jsonData.EditMedication[index].medi_start_date)        
      await MedicationsExtraDetails.enterStopDate(jsonData.EditMedication[index].medi_stop_date)     
       await MedicationsExtraDetails.selectPGDPSD(jsonData.EditMedication[index].meded_value_PGD)
      // await MedicationsExtraDetails.enterMedicationGradeForAdministrator(jsonData.EditMedication[index].meded_value_Administrator)
       await MedicationsExtraDetails.selectMaxReffills(jsonData.EditMedication[index].meded_value_MaxReffills)     
    
     await MedicationsExtraDetails.selectCurrentLocation(jsonData.EditMedication[index].pcl_location_name)      
      await MedicationsExtraDetails.enterMedicationNotes(jsonData.EditMedication[index].medi_notes) 
await page.pause()
      await MedicationsExtraDetails.clickOnSaveExtraDetails();      
      await page.waitForTimeout(1500);     
      // await Medications.clickOnCheckallCheckListcheckbox()
      // await MedicationsExtraDetails.clickOnSaveChecklistButton()
await page.pause()
       ////// Database comparison - Patient Clinical Records - UPDATE Medications/////////
     sqlQuery =
     "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, medi_notes"+
     " from patient_clinical_records join patient_clinical_records_details"+
     " on pacr_id=pacrd_pacr_id join Medications on pacr_id=medi_pacr_id where pacr_record_status='approved'"+
     " and pacrd_record_status='approved' and medi_record_status='approved' and pacr_id=" + pacrId +
     " and pacr_record_status='approved'";
          
     console.log("Manoj Edit query Medications: "+sqlQuery);
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);

   console.log("\n Patient Clinical Records stored into the database: \n", results);
   var match = await compareJsons(sqlFilePath, null, jsonData.EditMedication[index]);
   if (match) {
     console.log("\n Update Patient Clinical Records Comparision Edit Medications: Parameters from both JSON files match!\n");
   } else {
     console.log("\n Update Patient Clinical Records Comparision Edit Medications: Parameters from both JSON files do not match!\n");
   }

   //await page.pause()
   await page.pause()
   ////////AUTO UPDATE RISK AFTER UPDATING OUTCOME /////
      await Medications.clickOnItemHistory();
      await Medications.clickOnHistoryItemDiv();
      await page.waitForTimeout(500);
      await Medications.closeWindow();
      await page.waitForTimeout(500);
     await page.pause()
     
      // await page.waitForTimeout(500);
      await Medications.clickOnItemHighlightNone();
      await page.waitForTimeout(500);
      await Medications.selectLowRiskLevel();
      await page.waitForTimeout(500);
      await Medications.selectModerateRiskLevel();
      await page.waitForTimeout(500);
      await Medications.selectHighRiskLevel();
      await page.waitForTimeout(500);
      await Medications.selectAllRiskLevel();
      await Medications.clickOnLevelTwoExtraDetails();
     // await Interpretations.clickOnLevelThreeExtraDetails();
      await Medications.clickOnLevelOneExtraDetails();
await page.pause()

      ////// Database comparison - Patient Clinical Records - UPDATE Medications RISK/////////
     sqlQuery =
     "select pacr_risk from patient_clinical_records where pacr_id=" + pacrId;
          
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);
   if(results[0].pacr_risk == jsonData.EditMedication[index].pacr_risk){
    console.log(
      "\n Patient Clinical Records Comparision for Edit Medications Risk: RISK Updated Successfully! \n"
    );
   } else {
    console.log(
      "\n Patient Clinical Records Comparision for Edit Medications Risk: RISK Update Failed! \n"
    );
  }

     ///////// Deleting Item ////////////
await page.pause()
      await Medications.clickOnItemEdit();
      await MedicationsExtraDetails.clickOnDelete();
      await MedicationsExtraDetails.clickOnCancelDelete();
      await MedicationsExtraDetails.clickOnDelete();
      await MedicationsExtraDetails.clickOnConfirmDelete();
      await MedicationsExtraDetails.enterDeleteReason(jsonData.DeleteMedication[index].pacr_delete_reason);
      await MedicationsExtraDetails.clickOnSaveDeleteReason();
      await page.waitForTimeout(1000)
      

       ////// Database comparison- Patient Clinical Records - DELETE OUTCOME/////////
       sqlQuery ="select pacr_que_name, pacr_delete_reason from patient_clinical_records where pacr_id=" +
       pacrId +  " and pacr_record_status='wrong'";

     sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
     results = await executeQuery(sqlQuery, sqlFilePath);
     //  pacrId=results[0].pacr_id;
     console.log("\n Patient Details stored into the database: \n", results);
     var match = await compareJsons(
       sqlFilePath,
       null,
       jsonData.DeleteMedication[index]
     );
     if (match) {
       console.log(
         "\n  Patient Clinical Records Comparision for Delete Medications: Parameters from both JSON files match!\n"
       );
     } else {
       console.log(
         "\n  Patient Clinical Records Comparision for Delete Medications: Parameters from both JSON files do not match!\n"
       );
     }            
     await page.pause()
      await Medications.clickOnMigratedItemsSection();
      await Medications.clickOnDeletedItemsSection();
      await page.waitForTimeout(1000);
      await Medications.clickOnArchivedItemsSection();
      //await Medications.clickOnAllItemsSection();
      //await Medications.toggleHistorySection(); // Close the history section   
    
    }
  });
});
