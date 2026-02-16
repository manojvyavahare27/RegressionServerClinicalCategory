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
test.describe("Assessment Category", () => {
  test("Add Assessment", async ({ page }) => {
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
        const assessment = new ClinicalSummary(page);
        const assessmentExtraDetails = new ClinicalExtraDetails(page);
      //  const patientsummary = new PatientSummary(page);
  
 const menu = new Menu(page);
      await page.goto(environment.Test);
      await loginpage.enterUsername(jsonData.loginDetails[0].username);
      logger.info("Username enter successfully");
      await loginpage.enter_Password(jsonData.loginDetails[0].password);
      logger.info("Password enter successfully");
      await loginpage.clickOnLogin();      
      logger.info("Clicked on Login button successfully");
     // await homepage.clickOnHomeDashboardIcon()
      //await page.pause()
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
     
      //await page.pause()
      await patientsearch.clickOnSearchPatientLink();
      await page.waitForTimeout(2000);
      await confirmexisting.clickOnConfirmExistingDetails();  
      
      await page.waitForTimeout(5000);
      const alertPopup= await page.locator("xpath=//h2[text()='Alerts']").isVisible()      
      if(alertPopup==true)
        {       
          await assessment.closePopUp()
        }
      await page.waitForTimeout(2000);

      await page.waitForTimeout(2000); 
       await contacthistory.clickOnShowFilter()  
      await contacthistory.selectServiceFilter("General Medicine Automation");
      await contacthistory.selectContactReasonFilter("Assessments");
     // await contacthistory.enterContactDate("26/04/2024");
      await contacthistory.selectContactReason("Assessments");
      await contacthistory.selectContactLocation("Cardio Location");
      // await contacthistory.enterContactWith("Dr Sathya");
      await contacthistory.clickOnAddContact();      
        
        await assessment.clickOnViewContactItemsMenu();        
        await assessment.clickOnPinContactItemsMenu();        
        await assessment.selectCategoryFromList("Assessments");       
       
        
  //////Fetch Patient Details/////////
        // var sqlQuery =
        // "select * from patient_audit where paa_use_username='" + jsonData.loginDetails[0].username +
        // "' and paa_type='selected' order by 1 desc limit 1";
        // var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
        // var results = await executeQuery(sqlQuery, sqlFilePath);
        // console.log("\n Patient Details stored into the database: \n", results);
        // const patId = results[0].paa_pat_id;
        // console.log("Patient Accessed by User:" + patId);
  
  // Adding new Presenting Problem
  

  await assessment.selectAssessmentType('User Assessment');
  await page.waitForTimeout(2000);
  //await assessment.selectAssessmentName('User Assessment');
  await assessment.selectAssessmentName('HACU-Nurse Assessment');
  
  await page.waitForTimeout(5000);
  await assessment.ClickOnAssessmentSelectBtn(); 
 await page.pause()
      
      await page.waitForTimeout(3000);
      await assessment.clickDivPatientDetails()
      await page.waitForTimeout(2000);
      await assessment.selectAssessmentCheckbox()
      await page.waitForTimeout(2000);
      await assessment.clickDivAllergies()
      await page.waitForTimeout(2000);
      await assessment.selectAssessmentCheckbox()
      await page.waitForTimeout(2000);
      await assessment.clickDivPresProblems()
      await page.waitForTimeout(2000);
      await assessment.selectAssessmentCheckbox()
      await page.waitForTimeout(2000);
      await assessment.clickDivConditions()
      await page.waitForTimeout(2000);
      await assessment.selectAssessmentCheckbox()
      await page.waitForTimeout(2000);
      await assessment.clickDivLifestyle()
      await page.waitForTimeout(2000);
      await assessment.selectExSmokerCheckbox()
      await page.waitForTimeout(2000);
      await assessment.ClickOnbtnNext()
  // Add Diagnosis
  await assessment.clickDivDiagnosis()
  await page.waitForTimeout(2000);
  await assessment.selectAsthma();
   await assessmentExtraDetails.enterOnSetDate(jsonData.EditDiagnosis[index].diag_date_onset.toString());
   await assessmentExtraDetails.enterDiagnosedDate(jsonData.EditDiagnosis[index].diag_date_diagnosed.toString());
   await page.waitForTimeout(1500)
   await assessmentExtraDetails.enterDiagnosis1stSeenDate(jsonData.EditDiagnosis[index].diag_date_firstseen)      
   //await diagnosisExtraDetails.selectStatus(jsonData.EditDiagnosis[index].diag_diagnosis_status)
   await assessmentExtraDetails.selectSeverity(jsonData.EditDiagnosis[index].diag_severity)      
   await assessmentExtraDetails.selectActivity(jsonData.EditDiagnosis[index].diag_activity)
   await assessmentExtraDetails.enterDiagnosisNotes(jsonData.EditDiagnosis[index].diag_notes);
      //await page.pause()
    await assessmentExtraDetails.clickOnSaveExtraDetails();

     ////// Database comparison- Patient Clinical Records - ADDING NEW Diagnosis/////////
    //   sqlQuery =
    //   "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, diag_date_onset, diag_date_firstseen, diag_date_diagnosed, diag_notes"+
    //   " from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join diagnosis on pacr_id=diag_pacr_id where pacr_record_status='approved'"+
    //   " and pacr_pat_id=" + patId +
    //   " and pacr_record_status='approved' and pacr_que_name='" + jsonData.AddDiagnosis[index].pacr_que_name +
    //   "' and pacr_category='diagnosis' order by 1 desc limit 1";
 
 
 
    //   //select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, diag_date_onset, diag_date_firstseen, diag_date_diagnosed, diag_notes from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join diagnosis on pacr_id=diag_pacr_id where pacr_record_status='approved' and pacrd_record_status='approved' and diag_record_status='approved' and pacr_pat_id='787755' and pacr_record_status='approved' and pacr_que_name='Dengue haemorrhagic fever' and pacr_category='diagnosis' order by 1 desc limit 1;
           
    // sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    // results = await executeQuery(sqlQuery, sqlFilePath);
    // const pacrId = results[0].pacr_id;
    // console.log("\n Patient Clinical Records stored into the database: \n", results);
    // var match = await compareJsons(sqlFilePath, null, jsonData.AddDiagnosis[index]);
    // if (match) {
    //   console.log("\n Patient Clinical Records Comparision adding new Diagnosis: Parameters from both JSON files match!\n");
    // } else {
    //   console.log("\n Patient Clinical Records Comparision adding new Diagnosis: Parameters from both JSON files do not match!\n");
    // }

 // Add Examination
    await assessment.clickDivExamination()
  await page.waitForTimeout(2000);
  await assessment.selectDryEye();
  await assessmentExtraDetails.SelectOutcome(jsonData.AddExamination[index].exam_outcome);
  await assessmentExtraDetails.EnterNotes(jsonData.AddExamination[index].exam_notes);
  await assessmentExtraDetails.clickOnSaveExtraDetails();
  
   // Add Investigation
   await assessment.ClickOnDivInvestigation()
   await page.waitForTimeout(2000);
   await assessment.selectCBCBtn();
   await assessmentExtraDetails.clickOnSaveExtraDetails();

 // Add Medication
      await assessment.clickDivMedication()
      await page.waitForTimeout(2000);
      await assessment.selectMetforminBtn()
      await assessmentExtraDetails.enterOnDose(jsonData.AddMedication[index].medi_dose)
      await assessmentExtraDetails.selectFrequency(jsonData.AddMedication[index].medi_frequency)
      await assessmentExtraDetails.selectRoute(jsonData.AddMedication[index].medi_route)
      await assessmentExtraDetails.enterDays(jsonData.AddMedication[index].medi_duration)
      await assessmentExtraDetails.selectSite(jsonData.AddMedication[index].meded_value)
      await assessmentExtraDetails.selectPrescribeBy(jsonData.AddMedication[index].medi_prescribed_by)
      await assessmentExtraDetails.enterStartDate(jsonData.AddMedication[index].medi_start_date)
      await assessmentExtraDetails.enterReviewDate(jsonData.AddMedication[index].medi_stop_date) 
     // await page.pause() 
      await assessmentExtraDetails.enterStopDate(jsonData.AddMedication[index].medi_stop_date)
      await assessmentExtraDetails.selectSideEffects(jsonData.AddMedication[index].mse_text)  
      await assessmentExtraDetails.selectIndication(jsonData.AddMedication[index].meded_value) 
      await assessmentExtraDetails.selectStoppedReason(jsonData.AddMedication[index].medi_stopped_reason_eli_text)
      await assessmentExtraDetails.selectPGDPSD(jsonData.AddMedication[index].meded_value_PGD)
      
       
    //  await page.pause()
      await assessmentExtraDetails.enterUnit(jsonData.AddMedication[index].meded_value_Unit)
      await assessmentExtraDetails.selectCurrentLocation(jsonData.AddMedication[index].pcl_location_name)
      //await assessmentExtraDetails.enterLinkTiDiagnosis(jsonData.AddMedication[index].pacr_que_name_Diagnosis)
      //await assessmentExtraDetails.selectStatus(jsonData.AddMedication[index].pacr_status)
      await assessmentExtraDetails.selectAdherent(jsonData.AddMedication[index].meded_value_Adherent)
      await assessmentExtraDetails.clickOnPrescribeAndSupply()
      await assessmentExtraDetails.clickOnSuitableForDelivery()
      await assessmentExtraDetails.clickOnAddToPrescribe()
      await assessmentExtraDetails.clickOnSupply()
      await assessmentExtraDetails.clickOnSetAsDefault()
      //await assessmentExtraDetails.clickOnRepeatable()
      //await assessmentExtraDetails.clickOPrivateRecord()  
      await page.pause() 

      await assessmentExtraDetails.selectEndoserment(jsonData.AddMedication[index].paprd_endorsement) 
      //await page.pause() 

      //await assessmentExtraDetails.selectForCondition(jsonData.AddMedication[index].que_display_text)
      //await assessmentExtraDetails.enterPriceCheckQuantity(jsonData.AddMedication[index].meded_value_Price_check_quantity)  
      await assessmentExtraDetails.enterMedicationNotes(jsonData.AddMedication[index].medi_notes) 
      //await page.pause()
      await assessmentExtraDetails.clickOnSaveExtraDetails();
      await page.waitForTimeout(2000);
      await assessmentExtraDetails.clickOnSaveCheckList()
      
      //Add Risk Factors
      await assessment.clickDivRiskFactos()
      await page.waitForTimeout(2000);
      await assessment.selectAssessmentCheckbox()
      await page.waitForTimeout(2000);
      await assessment.ClickOnbtnNext()
      await page.waitForTimeout(5000);
      await assessment.ClickOndivRecommendations()
      await page.waitForTimeout(2000);
      await assessment.selectAssessmentCheckbox()
      await page.waitForTimeout(2000);
      await assessment.clickDivSocialCircum()
      await page.waitForTimeout(2000);
      await assessment.selectAssessmentCheckbox()
      await page.waitForTimeout(2000);
      await assessment.clickDivInterpretations()
      await page.waitForTimeout(2000);
      await assessment.selectAssessmentCheckbox()
      await page.waitForTimeout(2000);
      await assessment.clickDivOverview()
      await assessment.enterOverviewNotes('Overview_notes')
      await page.waitForTimeout(2000);

      await assessment.clickOnEndButton()
      await page.pause()
      await assessment.cancelAssessmentBtn()
      await page.waitForTimeout(2000);
      await assessment.clickOnEndButton()
      await page.waitForTimeout(2000);
      await assessment.okBtnForEndAssessment()
      await page.waitForTimeout(5000)
      await assessment.clickViewPrintLink()
      await page.waitForTimeout(5000)
      await assessmentExtraDetails.clickPopup()
      await page.waitForTimeout(5000)
      await assessment.clickViewPrintLink()
      await assessment.DiagnosisLink()
      await page.waitForTimeout(2000);

      //Delete Diagnosis
      await assessmentExtraDetails.clickOnDelete();
      await assessmentExtraDetails.clickOnConfirmDelete();
      await assessmentExtraDetails.enterDeleteReason('Deleted Existing item');
      await assessmentExtraDetails.clickOnSaveDeleteReason();

      //Delete Examination
      await page.waitForTimeout(4000);
      await assessment.examinationLink()
      await page.waitForTimeout(2000);
      await assessmentExtraDetails.clickOnDelete();
      await assessmentExtraDetails.clickOnConfirmDelete();
      await assessmentExtraDetails.enterDeleteReason('Deleted Existing item');
      await assessmentExtraDetails.clickOnSaveDeleteReason();
 
      //Delete Investigation
      await page.waitForTimeout(4000);
      await assessment.investigationLink()
      await page.waitForTimeout(2000);
      await assessmentExtraDetails.clickOnDelete();
      await assessmentExtraDetails.clickOnConfirmDelete();
      await assessmentExtraDetails.enterDeleteReason('Deleted Existing item');
      await assessmentExtraDetails.clickOnSaveDeleteReason();
      
      //Delete Medication
      await page.waitForTimeout(4000);
      await assessment.clickMedicationLink()
      await page.waitForTimeout(2000);
      await assessmentExtraDetails.clickOnDelete();
      await assessmentExtraDetails.clickOnConfirmDelete();
      await assessmentExtraDetails.enterDeleteReason('Deleted Existing item');
      await assessmentExtraDetails.clickOnSaveDeleteReason();








   }
});
})



