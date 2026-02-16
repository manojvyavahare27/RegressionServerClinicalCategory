//Added by Manoj Vyavahare

const fs = require("fs");
const XLSX = require("xlsx");
const path = "D:/Riomed/Cellma4Automation";
const mysql = require("mysql2");
const convertExcelToJson = require("../../../config/global-setupOptimized");

const { test, expect, chromium } = require("@playwright/test");
const { executeQuery } = require("../../../databaseWritePortal"); // Update the path accordingly
import compareJsons from "../../../compareFileOrJson"; // Update the path accordingly

import logger from "../../../Pages/BaseClasses/logger";
import LoginPage from "../../../Pages/BaseClasses/LoginPage";
import FindPatient from "../../../Pages/PharmacyPortal/FindPatient";
//import from "../../../Pages/ReferralPortal/FindPatient";
import Homepage from "../../../Pages/BaseClasses/Homepage";
import PortalHome from "../../../Pages/ReferralPortal/PortalHome";
import PatientSearch from "../../../Pages/PatientDomain/PatientSearch";
import PatientDetails from "../../../Pages/PatientDomain/PatientDetails";
import Environment from "../../../Pages/BaseClasses/Environment";
import Menu from "../../../Pages/BaseClasses/Menu";
import PatientWizard from "../../../Pages/PatientDomain/PatientWizard";
import PatientDuplicateCheck from "../../../Pages/PatientDomain/PatientDuplicateCheck";
import AddPatient from "../../../Pages/PatientDomain/AddPatient";
import AddAddress from "../../../Pages/PatientDomain/AddAddress";
import AddPIP from "../../../Pages/PatientDomain/AddPIP";
import ViewPIP from "../../../Pages/PatientDomain/ViewPIP";
import AddGP from "../../../Pages/PatientDomain/AddGP";
import PrintIDCard from "../../../Pages/PatientDomain/PrintIDCard";
import { TIMEOUT } from "dns";
import { error, log } from "console";
import { before } from "node:test";
import ClinicalSummary from "../../../Pages/ClinicalDomain/PatientSummary/ClinicalSummary";
import ClinicalExtraDetails from "../../../Pages/ClinicalDomain/PatientSummary/ClinicalExtraDetails";
import PharmacyHome from "../../../Pages/PharmacyPortal/PharmacyPortalPatientDetails";

const logindata = JSON.parse(
  JSON.stringify(require("../../../TestData/PharmacyPortal/Login.json"))
);
const patientdetailsdata = JSON.parse(
  JSON.stringify(
    require("../../../TestData/PharmacyPortal/PatientDetails.json")
  )
);
const pipdetailsdata = JSON.parse(
  JSON.stringify(require("../../../TestData/PatientDomain/PIPDetails.json"))
);
const gpdata = JSON.parse(
  JSON.stringify(require("../../../TestData/PatientDomain/NewGPDetails.json"))
);

const consoleLogs = [];
let jsonData;

test.describe("Excel Conversion", () => {
  test("Extract Patient Details", async ({}) => {
    const excelFilePath =
      process.env.EXCEL_FILE_PATH || "./ExcelFiles/PharmacyPortal.xlsx";
    const jsonFilePath =
      "./TestDataWithJSON/PharmacyPortal/PharmacyPortalDetails.json";
    const conversionSuccess = await convertExcelToJson(
      excelFilePath,
      jsonFilePath
    );

    if (conversionSuccess) {
      jsonData = require("../../../TestDataWithJSON/PharmacyPortal/PharmacyPortalDetails.json");
      console.log("Excel file has been converted successfully!");
      console.log("jsonData:", jsonData);
      console.log("excelFilePath after conversion:", excelFilePath);
      console.log("jsonFilePath after conversion:", jsonFilePath);
    } else {
      throw new Error("Excel to JSON conversion failed.");
    }
  });
});

test.describe("New Patient", () => {
  test("Register New Patient", async ({ page }) => {
    if (!jsonData || !jsonData.addPatient) {
      throw new Error("JSON data is missing or invalid.");
    }

    let index = 0;

    for (const data of jsonData.addPatient) {
      const loginpage = new LoginPage(page);
      const portalhome = new PortalHome(page);
      const environment = new Environment(page);
      const Medications = new ClinicalSummary(page);
      const patientsearch = new PatientSearch(page);
      const patientduplicatecheck = new PatientDuplicateCheck(page);
      const findPatient = new FindPatient(page);
      const MedicationsExtraDetails = new ClinicalExtraDetails(page);
      const pharmacyHomePage = new PharmacyHome(page);

      await page.pause()
      await page.goto(environment.PharmacyPortal);
      await page.waitForTimeout(1500)
      await loginpage.enterReferralPortalUserName(jsonData.loginDetails[0].username);
      await page.waitForTimeout(1500)
      await loginpage.enterRefrralPortalPassword(jsonData.loginDetails[0].password);
      await page.waitForTimeout(3000)
      await loginpage.clickOnReferralPortalLoginButton();
      //await expect(page.getByText('Login success')).toHaveText('Login success');

      await findPatient.clickOnSearchButton();
      logger.info("Clicked on Search button successfully");

      await findPatient.enterGivenName(jsonData.addPatient[index].pat_firstname);
      logger.info("Given Name entered successfully");

      await findPatient.enterFamilyName(jsonData.addPatient[index].pat_surname);
      logger.info("Family Name entered successfully");

      await findPatient.enterSex(data.pat_sex);
      await findPatient.enterBorn(jsonData.addPatient[index].pat_dob);
await page.pause()
      await findPatient.clickOnSearchButton();
      await page.waitForTimeout(5000);
      await findPatient.clickOnAddPatientButton();
      
      await findPatient.clickOnCreatePatientButton();

      //await patientduplicatecheck.clickOnDuplicateCheckButton();
      // await expect(page.getByText("Photo Identification required")).toHaveText("Photo Identification required");
      // await expect(page.getByText("Photo Identification ID required")).toHaveText("Photo Identification ID required");
      // await expect(page.getByText("Middle name(s) is required")).toHaveText("Middle name(s) is required");

      await expect(page.getByText("Title required")).toHaveText("Title required");
      //await expect(page.getByText("Sex at Birth")).toHaveText("Sex at Birth");

      await findPatient.selectTitle(jsonData.addPatient[index].pat_title);
      await findPatient.selectSex(jsonData.addPatient[index].pat_sex);
      await page.waitForTimeout(2000);
      await findPatient.clickOnCreatePatientButton();
await page.pause()
      await Medications.selectAndAddMedication(jsonData.AddMedication[index].pacr_que_name);
      await page.waitForTimeout(2000);
      await page.getByLabel("cancelIcon").click();
      //await MedicationsExtraDetails.clickOnClincialItemCollapsable();
      await Medications.selectAndAddMedication(jsonData.AddMedication[index].pacr_que_name);
      await page.waitForTimeout(1000);

      //await MedicationsExtraDetails.selectClinicalItemSubcategory(jsonData.AddMedication[index].eli_text);
      await MedicationsExtraDetails.enterOnDose(jsonData.AddMedication[index].medi_dose);
      //await page.getByTestId('Ok').click()
      await MedicationsExtraDetails.enterForm(jsonData.AddMedication[index].medi_form);
      await MedicationsExtraDetails.selectFrequency(jsonData.AddMedication[index].medi_frequency);
      await MedicationsExtraDetails.selectRoute(
        jsonData.AddMedication[index].medi_route
      );
      await MedicationsExtraDetails.enterDays(
        jsonData.AddMedication[index].medi_duration
      );
      await MedicationsExtraDetails.selectSite(
        jsonData.AddMedication[index].meded_value
      );
      await MedicationsExtraDetails.selectPrescribeBy(
        jsonData.AddMedication[index].medi_prescribed_by
      );
      await MedicationsExtraDetails.enterStartDate(
        jsonData.AddMedication[index].medi_start_date
      );
      await MedicationsExtraDetails.enterReviewDate(
        jsonData.AddMedication[index].medi_stop_date
      );

      await MedicationsExtraDetails.enterStopDate(
        jsonData.AddMedication[index].medi_stop_date
      );
      await MedicationsExtraDetails.selectSideEffects(
        jsonData.AddMedication[index].mse_text
      );
      await MedicationsExtraDetails.selectIndication(
        jsonData.AddMedication[index].meded_value
      );
      await MedicationsExtraDetails.selectStoppedReason(
        jsonData.AddMedication[index].medi_stopped_reason_eli_text
      );
      await MedicationsExtraDetails.selectPGDPSD(
        jsonData.AddMedication[index].meded_value_PGD
      );
      await MedicationsExtraDetails.enterMedicationGradeForAdministrator(
        jsonData.AddMedication[index].meded_value_Administrator
      );
      await MedicationsExtraDetails.selectMaxReffills(
        jsonData.AddMedication[index].meded_value_MaxReffills
      );
      // await MedicationsExtraDetails.selectQuantity(jsonData.AddMedication[index].meded_value_Quantity)

      await MedicationsExtraDetails.enterUnit(
        jsonData.AddMedication[index].meded_value_Unit
      );
      await MedicationsExtraDetails.selectCurrentLocation(
        jsonData.AddMedication[index].pcl_location_name
      );
      //await MedicationsExtraDetails.enterLinkTiDiagnosis(jsonData.AddMedication[index].pacr_que_name_Diagnosis)
      //await MedicationsExtraDetails.selectStatus(jsonData.AddMedication[index].pacr_status)
      await MedicationsExtraDetails.selectAdherent(
        jsonData.AddMedication[index].meded_value_Adherent
      );
      await MedicationsExtraDetails.clickOnPrescribeAndSupply();
      await MedicationsExtraDetails.clickOnSuitableForDelivery();
      await MedicationsExtraDetails.clickOnAddToPrescribe();
      await MedicationsExtraDetails.clickOnSupply();
      await MedicationsExtraDetails.clickOnSetAsDefault();
      // await MedicationsExtraDetails.clickOnRepeatable()
      await MedicationsExtraDetails.clickOPrivateRecord();

      await MedicationsExtraDetails.selectEndoserment(
        jsonData.AddMedication[index].paprd_endorsement
      );

      //await MedicationsExtraDetails.selectForCondition(jsonData.AddMedication[index].que_display_text)
      // await MedicationsExtraDetails.enterPriceCheckQuantity(jsonData.AddMedication[index].meded_value_Price_check_quantity)
      await MedicationsExtraDetails.enterMedicationNotes(
        jsonData.AddMedication[index].medi_notes
      );

      await page.waitForTimeout(2000);
      //await MedicationsExtraDetails.clickOnPortalSaveBtn();
      await MedicationsExtraDetails.clickOnSave()
      await page.waitForTimeout(200);
      await Medications.clickOnCheckallCheckListcheckbox();
      await MedicationsExtraDetails.clickOnSavePortalChecklistButton();
      await expect(page.getByText("Medication record added successfully")
      ).toHaveText("Medication record added successfully");

      //await expect(page.getByText(`${clinicaCatergory} Record Added Successfully`)).toHaveText(`${clinicaCatergory} Record Added Successfully`);

      //////Fetch Patient Details/////////
      var sqlQuery =
        "select pat_id, pat_firstname, pat_surname, pat_sex_at_birth, pat_dob, pat_use_created_by from patients where pat_use_created_by ='" +
        jsonData.loginDetails[0].username +
        "' and pat_est_id = 2 order by 1 desc limit 1";
      var sqlFilePath = "SQLResults/PharmacyPortal/PatientData.json";
      var results = await executeQuery(sqlQuery, sqlFilePath);
      console.log("\n Patient Details stored into the database: \n", results);
      const patId = results[0].pat_id;
      console.log("Patient Accessed by User:" + patId);

      ////// Database comparison- Patient Clinical Records - ADDING NEW Medications/////////
      sqlQuery =
        "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, medi_notes" +
        " from patient_clinical_records join patient_clinical_records_details on pacr_id=pacrd_pacr_id join Medications on pacr_id=medi_pacr_id where pacr_record_status='approved'" +
        " and pacr_pat_id=" +
        patId +
        " and pacr_record_status='approved' and pacr_que_name='" +
        jsonData.AddMedication[index].pacr_que_name +
        "' and pacr_category='Medication' order by 1 desc limit 1";

      console.log("Manoj add Medications:  " + sqlQuery);
      sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
      results = await executeQuery(sqlQuery, sqlFilePath);
      const pacrId = results[0].pacr_id;
      console.log(
        "\n Patient Clinical Records stored into the database: \n",
        results
      );
      var match = await compareJsons(
        sqlFilePath,
        null,
        jsonData.AddMedication[index]
      );
      if (match) {
        console.log(
          "\n Patient Clinical Records Comparision adding new Medications: Parameters from both JSON files match!\n"
        );
      } else {
        console.log(
          "\n Patient Clinical Records Comparision adding new Medications: Parameters from both JSON files do not match!\n"
        );
      }

      await pharmacyHomePage.fillPrescriptionType(jsonData.AddPrescription[index].pre_type);
      await pharmacyHomePage.fillPrescriptionCode(jsonData.AddPrescription[index].papre_code);
      await pharmacyHomePage.fillNotes(jsonData.AddPrescription[index].pre_notes);

      //await Medications.selectandAddClinicalItem(jsonData.AddMedication[index].pacr_que_name)
      await pharmacyHomePage.clickHistoryIconForMedicine(jsonData.AddMedication[index].pacr_que_name)
      await page.waitForTimeout(3000)
      await pharmacyHomePage.clickOnClosePopup()
      //await pharmacyHomePage.clickOnAssociatedConditionIcon()
      //await pharmacyHomePage.clickOnClosePopup()
      //await pharmacyHomePage.clickOnSideEffectIcon()
      //await pharmacyHomePage.clickOnClosePopup()
      //await page.pause()
      await pharmacyHomePage.selectCheckBoxforPrescription(jsonData.AddMedication[index].pacr_que_name);
      await pharmacyHomePage.clickOncreatePrescription();
      await page.waitForTimeout(3000);

      await pharmacyHomePage.clickOnitemWithPrescriptionLink();
      await page.waitForTimeout(1500);
      await pharmacyHomePage.clickOnitemsOnlyLink();
      await page.waitForTimeout(1500);
      await pharmacyHomePage.clickOncancelledPrescriptionLink();
      await page.waitForTimeout(1500);
      await pharmacyHomePage.clickOnitemsOnlyLink();
      await page.waitForTimeout(1500);
      await pharmacyHomePage.clickOnitemNotOnPrescriptionLink();
      await page.waitForTimeout(1500);
      await pharmacyHomePage.clickOnitemWithPrescriptionLink();
      await page.waitForTimeout(1500);
      await pharmacyHomePage.ClickOnExpandMedication();
      await pharmacyHomePage.clickOnRefillLeftLink();
      await pharmacyHomePage.enterExternalRefillQty();
      await page.getByTestId("CommonCellmaPopup").getByTestId("Save").click();
      //await pharmacyHomePage.clickOnSaveExternalRefillQty()
      //Updated Prescription Refills
      await expect(page.getByText("Updated Prescription Refills")).toHaveText(
        "Updated Prescription Refills"
      );

      await pharmacyHomePage.clickOnAwaitingProductionLink();
      await pharmacyHomePage.clickAwaitingProduction();
      await page.getByRole("button", { name: "Save" }).click();
      //await pharmacyHomePage.clickOnSaveButton()
      await expect(
        page.getByText("Prescription updated successfully")
      ).toHaveText("Prescription updated successfully");
      await page.waitForTimeout(1000);
      await pharmacyHomePage.clickOnAwaitingProductionLink();
      await pharmacyHomePage.clickPartiallyProduced();
      // await page.pause()
      await page.getByRole("button", { name: "Save" }).click();
      //await pharmacyHomePage.clickOnSaveButton()
      await expect.soft(
        page.getByText("Prescription updated successfully")
      ).toHaveText("Prescription updated successfully");
      await page.waitForTimeout(2000);
      await pharmacyHomePage.clickOnPartiallyProducedLink();
      await pharmacyHomePage.clickOnExpandIconForDispense(jsonData.AddMedication[index].pacr_que_name);
      await page.waitForTimeout(2000);
      ////Bug with medication expand
      //await pharmacyHomePage.enterDispenseQty();
      await page.waitForTimeout(1000);
      await pharmacyHomePage.clickOnDispenseButton();
      await page.getByRole("button", { name: "Save" }).click();
      //await pharmacyHomePage.clickOnSaveButton()

      await expect.soft(
        page.getByText("Prescription updated successfully")
      ).toHaveText("Prescription updated successfully");

      await pharmacyHomePage.clickOnProducedLink();
      await pharmacyHomePage.clickCollected();
      await page.getByRole("button", { name: "Save" }).click();
      //await pharmacyHomePage.clickOnSaveButton()
      await expect.soft(
        page.getByText("Prescription updated successfully")
      ).toHaveText("Prescription updated successfully");

      //
      //
      // PHARMACY HOME
      //
      //

      await pharmacyHomePage.clickOnItemEdit();
      await MedicationsExtraDetails.enterOnDose(
        jsonData.EditMedication[index].medi_dose
      );
      await MedicationsExtraDetails.selectFrequency(
        jsonData.EditMedication[index].medi_frequency
      );
      await MedicationsExtraDetails.selectRoute(
        jsonData.EditMedication[index].medi_route
      );
      await MedicationsExtraDetails.enterEditDays(
        jsonData.EditMedication[index].medi_duration
      );
      await MedicationsExtraDetails.selectSite(
        jsonData.EditMedication[index].meded_value
      );
      await MedicationsExtraDetails.selectEditPrescribeBy(
        jsonData.EditMedication[index].medi_prescribed_by
      );
      await MedicationsExtraDetails.enterStartDate(
        jsonData.EditMedication[index].medi_start_date
      );
      await MedicationsExtraDetails.enterReviewDate(
        jsonData.EditMedication[index].medi_start_date
      );
      await MedicationsExtraDetails.enterStopDate(
        jsonData.EditMedication[index].medi_stop_date
      );
      await MedicationsExtraDetails.selectPGDPSD(
        jsonData.EditMedication[index].meded_value_PGD
      );
      // await MedicationsExtraDetails.enterMedicationGradeForAdministrator(jsonData.EditMedication[index].meded_value_Administrator)
      await MedicationsExtraDetails.selectMaxReffills(
        jsonData.EditMedication[index].meded_value_MaxReffills
      );

      await MedicationsExtraDetails.selectCurrentLocation(
        jsonData.EditMedication[index].pcl_location_name
      );
      await MedicationsExtraDetails.enterEditMedicationNotes(
        jsonData.EditMedication[index].medi_notes
      );
      //await page.pause()
      //await MedicationsExtraDetails.clickOnPortalSaveBtn();
      await page.getByTestId('CommonCellmaPopup').getByTestId('Save').click();
      await page.waitForTimeout(1500);
      await Medications.clickOnCheckallCheckListcheckbox();
      await MedicationsExtraDetails.clickOnSavePortalChecklistButton();

      ////// Database comparison - Patient Clinical Records - UPDATE Medications/////////
      sqlQuery =
        "select pacr_id, pacr_category, pacr_que_name, pacr_clinic_date, pacr_risk, medi_notes" +
        " from patient_clinical_records join patient_clinical_records_details" +
        " on pacr_id=pacrd_pacr_id join Medications on pacr_id=medi_pacr_id where pacr_record_status='approved'" +
        " and pacrd_record_status='approved' and medi_record_status='approved' and pacr_id=" +
        pacrId +
        " and pacr_record_status='approved'";

      console.log("Manoj Edit query Medications: " + sqlQuery);
      sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
      results = await executeQuery(sqlQuery, sqlFilePath);

      console.log(
        "\n Patient Clinical Records stored into the database: \n",
        results
      );
      var match = await compareJsons(
        sqlFilePath,
        null,
        jsonData.EditMedication[index]
      );
      if (match) {
        console.log(
          "\n Update Patient Clinical Records Comparision Edit Medications: Parameters from both JSON files match!\n"
        );
      } else {
        console.log(
          "\n Update Patient Clinical Records Comparision Edit Medications: Parameters from both JSON files do not match!\n"
        );
      }

      ////////AUTO UPDATE RISK AFTER UPDATING OUTCOME /////
      await pharmacyHomePage.clickHistoryIconForMedicineOnPrescription()
      await Medications.closeWindow();
      await page.waitForTimeout(500);
      // await page.waitForTimeout(500);
      // await Medications.clickOnItemHighlightNone();
      await Medications.changeRiskLevel('highlightNone');
      await page.waitForTimeout(500);
      await Medications.changeRiskLevel('highlightModerate');
      await page.waitForTimeout(500);
      await Medications.changeRiskLevel('highlightHigh');
      await page.waitForTimeout(500);

      ////// Database comparison - Patient Clinical Records - UPDATE Medications RISK/////////
      sqlQuery =
        "select pacr_risk from patient_clinical_records where pacr_id=" +
        pacrId;

      sqlFilePath = "SQLResults/ClinicalDomain/patientClinicalRecord.json";
      results = await executeQuery(sqlQuery, sqlFilePath);
      if (results[0].pacr_risk == jsonData.EditMedication[index].pacr_risk) {
        console.log(
          "\n Patient Clinical Records Comparision for Edit Medications Risk: RISK Updated Successfully! \n"
        );
      } else {
        console.log(
          "\n Patient Clinical Records Comparision for Edit Medications Risk: RISK Update Failed! \n"
        );
      }

      ///////// Deleting Item ////////////

      await pharmacyHomePage.clickOnItemEdit();
      await MedicationsExtraDetails.clickOnDelete();
      await MedicationsExtraDetails.clickOnCancelDelete();
      await MedicationsExtraDetails.clickOnDelete();
      await MedicationsExtraDetails.clickOnConfirmDelete();
      await MedicationsExtraDetails.enterDeleteReason(
        jsonData.DeleteMedication[index].pacr_delete_reason
      );
      await page.getByRole('button', { name: 'Save' }).click();
      //await MedicationsExtraDetails.clickOnPortalSaveBtn();
      await page.waitForTimeout(1000);

      ////// Database comparison- Patient Clinical Records - DELETE OUTCOME/////////
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
      
      index++; // Don't forget to increment index
    }
  });
});