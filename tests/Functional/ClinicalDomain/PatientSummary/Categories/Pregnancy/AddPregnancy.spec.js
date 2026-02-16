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

test.describe("Excel Conversion pregnancy Category", () => {
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

test.describe("Pregnancy Category", () => {
  test("Add Pregnancy", async ({ page }) => {
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
      const pregnancy = new ClinicalSummary(page);
      const pregnancyExtraDetails = new ClinicalExtraDetails(page);
      

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
      await patientsearch.enterGivenName(jsonData.PatientDetails2[index].pat_firstname);
      logger.info("Given Name entered successfully");
      //await page.pause()
      await patientsearch.enterFamilyName(jsonData.PatientDetails2[index].pat_surname);
      logger.info("Family Name entered successfully");
      //await patientsearch.selectSex(data.pat_sex);

    await patientsearch.selectBornDate(jsonData.PatientDetails2[index].pat_dob);
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
      await pregnancy.clickOnViewContactItemsMenu();
      await pregnancy.clickOnPinContactItemsMenu();
      await pregnancy.selectCategoryFromList("Pregnancies");
      await page.waitForTimeout(2000)

      await page.pause()
      // a ////////REVIEW EXISTING ITEM AND DELETE/////
       if(await pregnancy.checkItemOnHistoryTable(jsonData.AddPregnancy1[index].pacr_que_name)){
        await pregnancy.clickOnItemReview(jsonData.AddPregnancy1[index].pacr_que_name);
        console.log("Item reviewed before deleting");
        await pregnancy.clickOnItemEdit(jsonData.AddPregnancy1[index].pacr_que_name);
        await pregnancyExtraDetails.clickOnDelete();
        await pregnancyExtraDetails.clickOnConfirmDelete();
        await pregnancyExtraDetails.enterDeleteReason('Deleted Existing item');
        await pregnancyExtraDetails.clickOnSaveDeleteReason();
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



////////ADD NEW pregnancy/////
      
      await pregnancy.clickAddPregnancy(); //This searches item and clicks on add button
      await page.waitForTimeout(2000);    
      await pregnancyExtraDetails.enterPregGravida(jsonData.AddPregnancy1[index].preg_gravida);  
      await pregnancyExtraDetails.selectNoOfFetus(jsonData.AddPregnancy1[index].fetus_no)
      await page.waitForTimeout(1000);
      await pregnancyExtraDetails.expandFetusDrawer();
      await page.waitForTimeout(1000);
      await pregnancyExtraDetails.selectPregOutcome(jsonData.AddPregnancy1[index].preg_outcome);
      await pregnancyExtraDetails.enterPregWeek(jsonData.AddPregnancy1[index].preg_week);
      await pregnancyExtraDetails.enterGestationDays(jsonData.AddPregnancy1[index].gestation_days);
      await pregnancyExtraDetails.selectDeliveryMethod(jsonData.AddPregnancy1[index].delivery_method);
      await pregnancyExtraDetails.enterDateOfDelivery(jsonData.AddPregnancy1[index].date)
      await pregnancyExtraDetails.enterTimeOfDelivery(jsonData.AddPregnancy1[index].time)
      await pregnancyExtraDetails.enterweightOfBaby(jsonData.AddPregnancy1[index].weight)
      //await pregnancyExtraDetails.selectSexOfBaby('Male')
      await pregnancyExtraDetails.selectSexOfBaby(jsonData.AddPregnancy1[index].sex)
      //await pregnancyExtraDetails.enterBabyName('Lokam')
       await pregnancyExtraDetails.enterBabyName(jsonData.AddPregnancy1[index].name)
       await pregnancyExtraDetails.enterBirthPlace(jsonData.AddPregnancy1[index].birthplace)
      //await pregnancyExtraDetails.enterBirthPlace('Satara')
      //await pregnancyExtraDetails.selectFeedingMethod('Breast')
      await pregnancyExtraDetails.selectFeedingMethod(jsonData.AddPregnancy1[index].feeding_method)
      await pregnancyExtraDetails.selectSocialWorkerAssigned('Yes');
      await pregnancyExtraDetails.selectComplications('No');
      //await pregnancyExtraDetails.enterPregnancyNotes('1st Pregnancy details added')
      await pregnancyExtraDetails.enterPregnancyNotes(jsonData.AddPregnancy1[index].notes);

      await pregnancyExtraDetails.expandFetusDrawerSecond();
      await page.waitForTimeout(1000);
      await pregnancyExtraDetails.selectPregOutcome1(jsonData.AddPregnancy1[index].preg_outcome1);
      await pregnancyExtraDetails.enterPregWeek1(jsonData.AddPregnancy1[index].preg_week1);
      await pregnancyExtraDetails.enterGestationDays1(jsonData.AddPregnancy1[index].gestation_days1);
      await pregnancyExtraDetails.selectDeliveryMethod1(jsonData.AddPregnancy1[index].delivery_method1);
      await pregnancyExtraDetails.enterDateOfDelivery1(jsonData.AddPregnancy1[index].date1)
      await pregnancyExtraDetails.enterTimeOfDelivery1(jsonData.AddPregnancy1[index].time1)
      await pregnancyExtraDetails.enterweightOfBaby1(jsonData.AddPregnancy1[index].weight1)
      //await pregnancyExtraDetails.selectSexOfBaby('Male')
      await pregnancyExtraDetails.selectSexOfBaby1(jsonData.AddPregnancy1[index].sex1)
      //await pregnancyExtraDetails.enterBabyName('Lokam')
       await pregnancyExtraDetails.enterBabyName1(jsonData.AddPregnancy1[index].name1)
       await pregnancyExtraDetails.enterBirthPlace1(jsonData.AddPregnancy1[index].birthplace1)
      //await pregnancyExtraDetails.enterBirthPlace('Satara')
      //await pregnancyExtraDetails.selectFeedingMethod('Breast')
      await pregnancyExtraDetails.selectFeedingMethod1(jsonData.AddPregnancy1[index].feeding_method1)
      await pregnancyExtraDetails.selectSocialWorkerAssigned1('Yes');
      await pregnancyExtraDetails.selectComplications1('No');
      //await pregnancyExtraDetails.enterPregnancyNotes('1st Pregnancy details added')
      await pregnancyExtraDetails.enterPregnancyNotes1(jsonData.AddPregnancy1[index].notes1);
      await pregnancyExtraDetails.savePregnancy();
      


      //await pregnancyExtraDetails.selectClinicalItemSubcategory(jsonData.Editpregnancy[index].eli_text);                 
      //await page.getByRole('checkbox', { name: 'Private record' }).click()
      //await page.getByRole('checkbox', { name: 'Set as default' }).click()
      //await pregnancyExtraDetails.enterClinicalItemNotes(jsonData.AddPregnancy1[index].soci_notes);
      //await pregnancyExtraDetails.clickOnSaveExtraDetails();
      //await page.waitForTimeout(1000);
     // await expect(page.getByText("Recommendation Record Added Successfully")).toHaveText("Recommendation Record Added Successfully");
      //await expect(page.getByText(`${clinicaCatergory} Record Added Successfully`)).toHaveText(`${clinicaCatergory} Record Added Successfully`); 
      //// Database comparison- Patient Clinical Records - ADDING NEW pregnancy/////////
      sqlQuery =
      "SELECT pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, preg_no_of_fetus, preg_outcome, " +
      "preg_gestation_weeks, preg_gestation_plus_days, preg_delivery_method, preg_date_of_delivery, preg_time_of_delivery, " +
      "preg_weight, CASE WHEN preg_sex = 'M' THEN 'Male' WHEN preg_sex = 'F' THEN 'Female' ELSE 'Unknown' END AS preg_sex, preg_baby_name, preg_birth_place, preg_feeding_method, preg_social_worker_assigned, " +
      "preg_complications, preg_notes " +
      "FROM patient_clinical_records " +
      "JOIN patient_clinical_records_details ON pacr_id = pacrd_pacr_id " +
      "JOIN pregnancy ON pacr_id = preg_pacr_id " +
      "WHERE pacr_record_status = 'approved' " +
      "AND pacr_pat_id = " + patId + " " +
      "AND pacr_que_name = '" + jsonData.AddPregnancy[index].pacr_que_name + "' " +
      "AND pacr_category = 'pregnancy' " +
      "ORDER BY pacr_id DESC " +
      "LIMIT 1";

    console.log("Manoj:  "+ sqlQuery);
           
    sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    results = await executeQuery(sqlQuery, sqlFilePath);
    const pacrId = results[0].pacr_id;
    console.log("\n Patient Clinical Records stored into the database: \n", results);
    var match = await compareJsons(sqlFilePath, null, jsonData.AddPregnancy[index]);
    if (match) {
      console.log("\n Patient Clinical Records Comparision adding new Recommendation: Parameters from both JSON files match!\n");
    } else {
      console.log("\n Patient Clinical Records Comparision adding new Recommendation: Parameters from both JSON files do not match!\n");
    }
      
      // sqlQuery =
      // "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, soci_notes"+
      // " from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join pregnancy on pacr_id=soci_pacr_id where pacr_record_status='approved'"+
      // " and pacr_pat_id=" + patId +
      // " and pacr_record_status='approved' and pacr_que_name='" + jsonData.AddPregnancy1[index].pacr_que_name +
      // "' and pacr_category='pregnancy' order by 1 desc limit 1";


    // console.log("Manoj:  "+ sqlQuery);
           
    // sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
    // results = await executeQuery(sqlQuery, sqlFilePath);
    // const pacrId = results[0].pacr_id;
    // console.log("\n Patient Clinical Records stored into the database: \n", results);
    // var match = await compareJsons(sqlFilePath, null, jsonData.AddPregnancy1[index]);
    // if (match) {
    //   console.log("\n Patient Clinical Records Comparision adding new Recommendation: Parameters from both JSON files match!\n");
    // } else {
    //   console.log("\n Patient Clinical Records Comparision adding new Recommendation: Parameters from both JSON files do not match!\n");
    // }
   
    //  await pregnancy.toggleSearchSection(); //Close the search section
      
      //await pregnancy.clickOnItemDiv(jsonData.Editpregnancy[index].pacr_que_name);
      await pregnancy.clickOnItemEdit('Pregnancy 1');
      await page.pause()
      await page.waitForTimeout(1000);
      await pregnancyExtraDetails.expandFetusDrawer();
      //await pregnancyExtraDetails.clickOnClincialItemCollapsable();
      await pregnancyExtraDetails.selectPregOutcome(jsonData.EditPregnancy1[index].preg_outcome);
      await pregnancyExtraDetails.enterPregWeek(jsonData.EditPregnancy1[index].preg_week);
      await pregnancyExtraDetails.enterGestationDays(jsonData.EditPregnancy1[index].gestation_days);
      await pregnancyExtraDetails.selectDeliveryMethod(jsonData.EditPregnancy1[index].delivery_method);
      await pregnancyExtraDetails.enterDateOfDelivery(jsonData.EditPregnancy1[index].date)
      await pregnancyExtraDetails.enterTimeOfDelivery(jsonData.EditPregnancy1[index].time)
      await pregnancyExtraDetails.enterweightOfBaby(jsonData.EditPregnancy1[index].weight)
      await pregnancyExtraDetails.selectSexOfBaby(jsonData.EditPregnancy1[index].sex)
      await pregnancyExtraDetails.enterBabyName(jsonData.EditPregnancy1[index].name)
      await pregnancyExtraDetails.enterBirthPlace(jsonData.EditPregnancy1[index].birthplace)
      await pregnancyExtraDetails.selectFeedingMethod(jsonData.EditPregnancy1[index].feeding_method)
      await pregnancyExtraDetails.selectSocialWorkerAssigned('No');
      await pregnancyExtraDetails.selectComplications('No');
      await pregnancyExtraDetails.enterPregnancyNotes(jsonData.EditPregnancy1[index].notes);

      await pregnancyExtraDetails.expandFetusDrawerSecond();
      await page.waitForTimeout(1000);
      await pregnancyExtraDetails.selectPregOutcome1(jsonData.EditPregnancy1[index].preg_outcome1);
      await pregnancyExtraDetails.enterPregWeek1(jsonData.EditPregnancy1[index].preg_week1);
      await pregnancyExtraDetails.enterGestationDays1(jsonData.EditPregnancy1[index].gestation_days1);
      await pregnancyExtraDetails.selectDeliveryMethod1(jsonData.EditPregnancy1[index].delivery_method1);
      await pregnancyExtraDetails.enterDateOfDelivery1(jsonData.EditPregnancy1[index].date1)
      await pregnancyExtraDetails.enterTimeOfDelivery1(jsonData.EditPregnancy1[index].time1)
      await pregnancyExtraDetails.enterweightOfBaby1(jsonData.EditPregnancy1[index].weight1)
      //await pregnancyExtraDetails.selectSexOfBaby('Male')
      await pregnancyExtraDetails.selectSexOfBaby1(jsonData.EditPregnancy1[index].sex1)
      //await pregnancyExtraDetails.enterBabyName('Lokam')
       await pregnancyExtraDetails.enterBabyName1(jsonData.EditPregnancy1[index].name1)
       await pregnancyExtraDetails.enterBirthPlace1(jsonData.EditPregnancy1[index].birthplace1)
      //await pregnancyExtraDetails.enterBirthPlace('Satara')
      //await pregnancyExtraDetails.selectFeedingMethod('Breast')
      await pregnancyExtraDetails.selectFeedingMethod1(jsonData.EditPregnancy1[index].feeding_method1)
      await pregnancyExtraDetails.selectSocialWorkerAssigned1('Yes');
      await pregnancyExtraDetails.selectComplications1('No');
      //await pregnancyExtraDetails.enterPregnancyNotes('1st Pregnancy details added')
      await pregnancyExtraDetails.enterPregnancyNotes1(jsonData.EditPregnancy1[index].notes1);
      await pregnancyExtraDetails.savePregnancy();
      //await pregnancyExtraDetails.selectClinicalItemSubcategory(jsonData.Editpregnancy[index].eli_text);
            
      //await pregnancyExtraDetails.enterClinicalItemNotes(jsonData.Editpregnancy[index].soci_notes);
      await pregnancyExtraDetails.savePregnancy();
      await page.waitForTimeout(1000);

       ////// Database comparison - Patient Clinical Records - UPDATE pregnancy/////////
        sqlQuery =
     "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk,preg_no_of_fetus,preg_outcome,preg_gestation_weeks,preg_gestation_plus_days,preg_delivery_method,DATE_FORMAT(preg_date_of_delivery, '%H:%i') AS preg_time_of_delivery, preg_date_of_delivery,preg_time_of_delivery,preg_weight,CASE WHEN preg_sex = 'M' THEN 'Male' WHEN preg_sex = 'F' THEN 'Female' ELSE 'Unknown' END AS preg_sex, preg_baby_name, preg_birth_place, preg_feeding_method, preg_social_worker_assigned,preg_baby_name,preg_birth_place,preg_feeding_method,preg_social_worker_assigned,preg_complications, preg_notes"+
     " from patient_clinical_records join patient_clinical_records_details"+
     " on pacr_id=pacrd_pacr_id join pregnancy on pacr_id=preg_pacr_id where pacr_record_status='approved'"+
     " and pacrd_record_status='approved' and preg_record_status='approved' and pacr_id=" + pacrId +
     " and pacr_record_status='approved'";
          
     console.log("Manoj Edit query:"+sqlQuery);
   sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
   results = await executeQuery(sqlQuery, sqlFilePath);

   console.log("\n Patient Clinical Records stored into the database: \n", results);
   var match = await compareJsons(sqlFilePath, null, jsonData.EditPregnancy[index]);
   if (match) {
     console.log("\n Update Patient Clinical Records Comparision Edit pregnancy: Parameters from both JSON files match!\n");
   } else {
     console.log("\n Update Patient Clinical Records Comparision Edit pregnancy: Parameters from both JSON files do not match!\n");
   }

  //    sqlQuery =
  //    "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, soci_notes"+
  //    " from patient_clinical_records join patient_clinical_records_details"+
  //    " on pacr_id=pacrd_pacr_id join pregnancy_circumstances on pacr_id=soci_pacr_id where pacr_record_status='approved'"+
  //    " and pacrd_record_status='approved' and soci_record_status='approved' and pacr_id=" + pacrId +
  //    " and pacr_record_status='approved'";
          
  //    console.log("Manoj Edit query:"+sqlQuery);
  //  sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
  //  results = await executeQuery(sqlQuery, sqlFilePath);

  //  console.log("\n Patient Clinical Records stored into the database: \n", results);
  //  var match = await compareJsons(sqlFilePath, null, jsonData.Editpregnancy[index]);
  //  if (match) {
  //    console.log("\n Update Patient Clinical Records Comparision Edit pregnancy: Parameters from both JSON files match!\n");
  //  } else {
  //    console.log("\n Update Patient Clinical Records Comparision Edit pregnancy: Parameters from both JSON files do not match!\n");
  //  }

   ////////AUTO UPDATE RISK AFTER UPDATING OUTCOME /////

     await page.pause()

      await pregnancy.clickOnItemHistory();
      await pregnancy.clickOnHistoryItemDiv();
      await page.waitForTimeout(500);
      await pregnancy.closeWindow();
      await page.waitForTimeout(500);
     
     
      // await page.waitForTimeout(500);
      // await pregnancy.clickOnItemHighlightNone();
      // await page.waitForTimeout(500);
      // await pregnancy.selectLowRiskLevel();
      // await page.waitForTimeout(500);
      // await pregnancy.selectModerateRiskLevel();
      // await page.waitForTimeout(500);
      // await pregnancy.selectHighRiskLevel();
      // await page.waitForTimeout(500);
      // await pregnancy.selectAllRiskLevel();
      // await pregnancy.clickOnLevelTwoExtraDetails();
      // //await pregnancy.clickOnLevelThreeExtraDetails();
      // await pregnancy.clickOnLevelOneExtraDetails();


      ////// Database comparison - Patient Clinical Records - UPDATE pregnancy RISK/////////
  //    sqlQuery =
  //    "select pacr_risk from patient_clinical_records where pacr_id=" + pacrId;
          
  //  sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
  //  results = await executeQuery(sqlQuery, sqlFilePath);
  //  if(results[0].pacr_risk == jsonData.Editpregnancy[index].pacr_risk){
  //   console.log(
  //     "\n Patient Clinical Records Comparision for Edit pregnancy Risk: RISK Updated Successfully! \n"
  //   );
  //  } else {
  //   console.log(
  //     "\n Patient Clinical Records Comparision for Edit pregnancy Risk: RISK Update Failed! \n"
  //   );
  // }

     ///////// Deleting Item ////////////

     await pregnancy.clickOnItemEdit('Pregnancy 1')
      await pregnancyExtraDetails.clickOnDelete();
      await pregnancyExtraDetails.clickOnCancelDelete();
      await pregnancyExtraDetails.clickOnDelete();
      await pregnancyExtraDetails.clickOnConfirmDelete();
      await pregnancyExtraDetails.enterDeleteReason(jsonData.DeletePregnancy[index].pacr_delete_reason);
      await pregnancyExtraDetails.clickOnSaveDeleteReason();
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
       jsonData.DeletePregnancy[index]
     );
     if (match) {
       console.log(
         "\n  Patient Clinical Records Comparision for Delete pregnancy: Parameters from both JSON files match!\n"
       );
     } else {
       console.log(
         "\n  Patient Clinical Records Comparision for Delete pregnancy: Parameters from both JSON files do not match!\n"
       );
     }        
      await page.waitForTimeout(1000);
      //await pregnancy.clickOnMigratedItemsSection();
      await page.getByTestId('migrated')
      //await pregnancy.clickOnDeletedItemsSection();
      await page.waitForTimeout(1000);
      await page.getByTestId('deleted')
      //await pregnancy.clickOnArchivedItemsSection();
      await page.waitForTimeout(1000);
      await page.getByTestId('archived')
      await page.waitForTimeout(1000);
     // await pregnancy.clickOnAllItemsSection();
      await page.getByTestId('all');
      //await pregnancy.toggleHistorySection(); // Close the history section

     
     // await page.pause();
    }
  });
});
