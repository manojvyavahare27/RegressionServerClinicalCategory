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

test.describe("Task Category", () => {
    test("Add Task", async ({ page }) => { 
  
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
        const problems = new ClinicalSummary(page);
        const taskExtraDetails = new ClinicalExtraDetails(page);
        const patientsummary = new PatientSummary(page);
  
        const menu = new Menu(page);
        await page.goto(environment.Test);
        await loginpage.enterUsername(jsonData.loginDetails[0].username);
        logger.info("Username enter successfully");
        await loginpage.enter_Password(jsonData.loginDetails[0].password);
        logger.info("Password enter successfully");
        await loginpage.clickOnLogin();
        logger.info("Clicked on Login button successfully");
         await page.waitForTimeout(1000)
       //  await homepage.scrollDivToLastIcon(page);
        await homepage.redirectsToHomePage()
        logger.info("Clicked on homepage icon successfully");
  
        await page.waitForTimeout(3000)
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
  
        await patientsearch.selectBornDate(
          jsonData.PatientDetails[index].pat_dob
        );
      
        //await patientsearch.selectBornDate(formattedDate);
        await patientsearch.clickOnSearchButton();
  
        await patientsearch.clickOnSearchPatientLink();
        await page.waitForTimeout(1500);
        await confirmexisting.clickOnConfirmExistingDetails();
         await page.waitForTimeout(4000);
      const alertPopup = page.locator("xpath=//h2[text()='Alerts']");
      if (await alertPopup.isVisible()) {
         const cancelButton = page.locator("xpath=//button[@aria-label='cancelIcon']");
          await cancelButton.waitFor({ state: 'visible', timeout: 5000 });
          await cancelButton.click();
        }
      await page.waitForTimeout(2000);


         //////Fetch Patient Details/////////
   var sqlQuery =
   "select * from patient_audit where paa_use_username='" + jsonData.loginDetails[0].username + 
   "' and paa_type='selected' order by 1 desc limit 1";
   var sqlFilePath = "SQLResults/PatientDomain/PatientAudit.json";
   var results = await executeQuery(sqlQuery, sqlFilePath);
   console.log("\n Patient Details stored into the database: \n", results);
   const patId = results[0].paa_pat_id;

   console.log("Patient Accessed by User:" + patId);

  

        await contacthistory.enterContactDate('26/04/2024');
        await contacthistory.selectContactReason('Assessments');
        await contacthistory.selectContactLocation('Cardio Location');
        //await contacthistory.enterContactWith('Dr Sathya');
        await contacthistory.clickOnAddContact();
        //await problems.clickOnViewContactItemsMenu();
        //await problems.clickOnPinContactItemsMenu();
       
        await page.pause()
        await page.waitForTimeout(1000);
        await patientsummary.clickOnAddToTask();
        await page.waitForTimeout(1000);
        await patientsummary.selectTasklink();
        await page.waitForTimeout(1000);
        
        await patientsummary.clickOnSearchTask();
        await page.waitForTimeout(1500);
        await patientsummary.addTask()
        //await patientsummary.selectTaskTemplate();
        
    
        await patientsummary.selectTaskCategory(jsonData.AddTask[index].task_category);
        await patientsummary.searchExistingTask(jsonData.AddTask[index].existing_task_search);
        await patientsummary.selectTaskType(jsonData.AddTask[index].task_type);
        await patientsummary.enterTaskAreaDescription(jsonData.AddTask[index].task_description);
        await patientsummary.selectTaskActionToPerform(jsonData.AddTask[index].task_action_perform);
       // 
        await patientsummary.selectAssignTaskUser(jsonData.AddTask[index].task_username);
        await patientsummary.selectTaskDueDate(jsonData.AddTask[index].task_due_date);
        await patientsummary.selectTaskDueTime(jsonData.AddTask[index].task_due_time);
        await patientsummary.selectSendAlertTo();
        await patientsummary.selectSendAlertUsing();
       // await patientsummary.selectApptSpeciality(jsonData.AddTask[index].specialty);
       
        // await patientsummary.selectApptClinicType(jsonData.AddTask[index].clinic_type);
        // await patientsummary.selectApptClinicLocation(jsonData.AddTask[index].appt_location);
        // await patientsummary.selectApptTeam(jsonData.AddTask[index].team);
        // await patientsummary.enterTaskDescription(jsonData.AddTask[index].taskd_description);
        // await patientsummary.enterTaskNotes(jsonData.AddTask[index].task_notes);
        await patientsummary.reoccurringTaskCheck();
        await page.waitForTimeout(1500);
        await patientsummary.reoccurringTaskUncheck();
        await page.waitForTimeout(1500);
        await patientsummary.setAgeSpecificTask();
        await patientsummary.setSexSpecificTask();
        await patientsummary.addSpecificMinAge(jsonData.AddTask[index].age_min);
        await patientsummary.addSpecificMaxAge(jsonData.AddTask[index].age_max);
        await patientsummary.addSpecificSex();
       
        await page.waitForTimeout(1500);
        await patientsummary.enterLocalCode(jsonData.AddTask[index].local_code);
        await patientsummary.saveTask();
         await page.waitForTimeout(1500);
        await page.waitForTimeout(1000);
         await page.waitForTimeout(1000);
       await page.pause()
        await page.getByLabel('cancelIcon').click();

       
let username = jsonData.loginDetails[0].username;        
         ////// Database comparison - ADDING NEW TASK/////////
  sqlQuery =
  //`SELECT task_name,task_que_code,task_due_date,task_due_time,task_status,task_priority,alert_category,taskd_description, task_notes FROM c4_tasks JOIN c4_alerts ON c4_tasks.task_id = c4_alerts.alert_task_id JOIN task_details ON c4_tasks.task_id = task_details.taskd_task_id WHERE c4_tasks.task_pat_id =${patId}  and task_created_by = '${username}' order by task_id desc limit 1`;
  //'SELECT t.task_id, t.task_pat_id, t.task_name, t.task_que_code, t.task_due_date, t.task_due_time, t.task_status, t.task_priority, td.taskd_id, td.taskd_description, td.taskd_action_to_perform FROM c4_tasks t JOIN task_details td ON t.task_id = td.taskd_task_id ORDER BY t.task_id DESC LIMIT 1';
  'SELECT t.task_id, t.task_pat_id, t.task_name, t.task_que_code, t.task_due_date, t.task_due_time, t.task_status, t.task_priority, td.taskd_id, td.taskd_description, td.taskd_action_to_perform FROM c4_tasks t JOIN task_details td ON t.task_id = td.taskd_task_id ORDER BY t.task_id DESC LIMIT 1';
 console.log("Task query"+sqlQuery)       
 

sqlFilePath = "SQLResults/ClinicalDomain/addTaskToPatient.json";
results = await executeQuery(sqlQuery, sqlFilePath);
//const pacrId = results[0].pacr_id;
console.log("\n Patient Clinical Records stored into the database: \n", results);
var match = await compareJsons(sqlFilePath, null, jsonData.AddTask[index]);
if (match) {
  console.log(
    "\n Patient Clinical Records Comparision Add Problems: Parameters from both JSON files match!\n"
  );
} else {
  console.log(
    "\n Patient Clinical Records Comparision: Parameters from both JSON files do not match!\n"
  );
} 
   


        //Edit & Complete Task
        await patientsummary.clickTaskIcon();
        await page.waitForTimeout(1500);
        await patientsummary.allTaskTab()
        await page.waitForTimeout(1500);
        
        await patientsummary.expandIncompleteTask()
        await page.waitForTimeout(1500);
        await patientsummary.expandIncompleteTask()
        await page.waitForTimeout(1500);
        await patientsummary.expandCompleteTask()
        await page.waitForTimeout(1500);
        await patientsummary.expandCompleteTask()
        await page.waitForTimeout(1500);
        await patientsummary.expandNotToBeCompleted()
        await page.waitForTimeout(1500);
        await patientsummary.expandNotToBeCompleted()
        await page.waitForTimeout(1500);
        
        await patientsummary.incompleteTaskTab()
        await page.waitForTimeout(1500);
        await patientsummary.notToBeCompletedTab()
        await page.waitForTimeout(1500);
        await patientsummary.completedTaskTab()
        await page.waitForTimeout(1500);
         await patientsummary.incompleteTaskTab()
        await page.waitForTimeout(1500);
        //  await patientsummary.expandIncompleteTask()
        // await page.waitForTimeout(1500);
        await patientsummary.editTask();
        await page.waitForTimeout(1500);
 
       
//await patientsummary.selectTaskCategory(jsonData.EditTask[index].task_category);  // Update category from JSON data
await patientsummary.enterTaskAreaDescription(jsonData.EditTask[index].task_description); // Update description
await patientsummary.selectTaskActionToPerform(jsonData.EditTask[index].task_action_perform);  // Update action to perform
await patientsummary.selectAssignTaskUser(jsonData.EditTask[index].task_username);  // Reassign task to another user
//await patientsummary.selectTaskDueDate(jsonData.EditTask[index].task_due_date);  // Update due date
//await patientsummary.selectTaskDueTime(jsonData.EditTask[index].task_due_time);  // Update due time
//await patientsummary.selectSendAlertTo(jsonData.EditTask[index].alert_recipient);  // Update alert recipient
//await patientsummary.selectSendAlertUsing(jsonData.EditTask[index].alert_method); // Update alert method
        // await patientsummary.selectTaskDueDate(jsonData.EditTask[index].due_date);
        // await patientsummary.selectTaskDueTime(jsonData.EditTask[index].due_time);
        // await patientsummary.enterTaskNotes(jsonData.EditTask[index].notes);
       
        await patientsummary.saveTask();
        await page.waitForTimeout(2500);
        await patientsummary.clickCheckAll();
        await page.waitForTimeout(1000);
        await patientsummary.clickUncheckAll();
        await page.waitForTimeout(1000);
        await patientsummary.clickCheckAll();
        await page.waitForTimeout(1000);
        await patientsummary.clickCompleteTask();
        await page.waitForTimeout(2000);
       
        await page.getByLabel('cancelIcon').click();

         //Adding task & Not to be Complete Task
        await patientsummary.clickTaskIcon();
        // await page.waitForTimeout(1500);
        //  await patientsummary.selectTasklink();
        //  await page.waitForTimeout(1000);
        //  await patientsummary.clickOnSearchTask();
        //  await page.waitForTimeout(1500);
        //  await patientsummary.selectTaskTemplate();
        //  await page.waitForTimeout(5000);
        await patientsummary.allTaskTab()
        await patientsummary.expandIncompleteTask()
        await page.waitForTimeout(1500);

        
        await patientsummary.editTask();
        await page.waitForTimeout(1500);
          await patientsummary.saveTask();
    
         
         await page.waitForTimeout(1500);
         await page.getByRole('button', { name: 'cancelIcon' }).click();

         await page.pause();
        

          //Edit & Not to be Complete Task
        await patientsummary.clickTaskIcon();
        await page.waitForTimeout(1500);
        await patientsummary.allTaskTab()
        await page.waitForTimeout(1500);
        await patientsummary.expandIncompleteTask()
        await page.waitForTimeout(1500);
        await patientsummary.expandCompleteTask()
        await page.waitForTimeout(1500);
        await patientsummary.expandNotToBeCompleted()
        await page.waitForTimeout(1500);
        await patientsummary.incompleteTaskTab()
        await page.waitForTimeout(1500);
        await patientsummary.editTask();
        await page.waitForTimeout(1500);
        await patientsummary.selectTaskDueDate(jsonData.EditTask[index].due_date);
        await patientsummary.selectTaskDueTime(jsonData.EditTask[index].due_time);
        await patientsummary.enterTaskNotes(jsonData.EditTask[index].notes);
        await patientsummary.clickNotToBeComplete();
        await page.getByLabel('Add Reason for Incompletion').getByTestId('reason').locator('div').filter({ hasText: 'Reason *' }).click();
        await page.getByRole('option', { name: 'Not required' }).click();
        await page.getByPlaceholder('description', { exact: true }).click();
        await page.getByPlaceholder('description', { exact: true }).fill('Not to be completed');
        await page.getByLabel('saveReason').click();
        await page.waitForTimeout(4500);
        await page.getByLabel('cancelIcon').click();

      }
      });
    })