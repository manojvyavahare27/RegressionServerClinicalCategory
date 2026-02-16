const { clickElement, typeText, selectFromDropdown} = require('../../../../../UtilFiles/StaticUtility');

// page.js
class ConsentPage {
    constructor(page) {
        this.page = page;
        // this.consentGivenByInput = '[data-testid="consentGivenBy"] input';
        // this.consentTypeInput = '[data-testid="consentType"] input';
        // this.consentStatusInput = '[data-testid="consentStatus"] input';
        this.consentGivenByInput = page.locator("xpath=//input[@id='consentGivenBy']");
        this.consentTypeInput = page.locator("xpath=//input[@id='consentType']");
        this.consentStatusInput = page.locator("xpath=//input[@id='consentStatus']");
        this.startDateInput = '[data-testid="Date of Consent Start"]';
        this.endDateInput = '[data-testid="Date of Consent End"]';
        this.completeConsentButton = '[data-testid="Complete Consent"]';
        this.downloadConsentButton = '[data-testid="Download Consent"]';
        this.chooseFileButton = '[data-testid="Choose File1"]';
        this.giveConsentButton = '[data-testid="Give Consent"]';
        this.withdrawConsentButton = '[data-testid="Withdraw Consent"]';
        this.notesTextarea = '[data-testid="Notes"]';
        this.checkboxConsent = '[data-testid="I hereby give consent that the consent file is genuine"] input';
        //Patient Details Section
        this.surnameInput = "input[name='patientFamilyName']";
        this.firstNameInput = "input[name='patientFirstName']";
        this.dobInput = "input[name='dob']";
        this.genderInput = "input[name='gender']";
        this.nhsNumberInput = "input[name='nhsNumber']";
        this.pidInput = "input[name='pid']";
        this.specialRequirementsInput = "textarea[name='specialRequirements']";
        this.treatmentNameInput = "input[name='nameOfTreatment']";
        this.medicalTermExplanationInput = "textarea[name='medicalTermNotClear']";
        //Statement of Health Professional
        this.intendedBenefitsTextarea = 'textarea[name="intendedBenefits"]';
        this.frequentlyOccurringRisksTextarea = 'textarea[name="frequentlyOccurringRisks"]';
        this.bloodTransfusionDetailsTextarea = 'textarea[name="bloodTransfusionDetails"]';
        this.procedureDetailsTextarea = 'textarea[name="procedureDetails"]';
        this.riskDetailsTextarea = 'textarea[name="riskDetails"]';
        this.responsibleHealthProfInput = 'input[name="responsibleHealthProf"]';
        this.hpUserNameInput = 'input[name="hpUserName"]';
        this.hpUserDateInput = 'input[name="hpUserDate"]';
        this.clearLink = 'a[data-testid="Clear"]';
        this.risksTextarea = 'textarea[name=frequentlyOccurringRisks]';
        this.bloodTransfusionCheckbox ='span[data-testid="Blood transfusion"]';
        this.otherProceduresCheckbox = 'span[data-testid="Other procedures (please specify)"]';
        this.followingInformationCheckbox = 'span[data-testid="The following information has been provided"]';
        this.procedureInput = 'input[name=procedures]';
        this.responsibleHealthProfInput = 'input[name=responsibleHealthProf]';
        this.hpUserNameInput = 'input[name=hpUserName]';
        this.hpUserJobTitleInput = 'input[name=hpUserJobTitle]';
        this.hpUserDateInput = 'input[name=hpUserDate]';
        this.submitButton = 'button[type=submit]';
        //Statement of Interpreter
        this.clearButton = 'a[data-testid="Clear"]';
        this.nameInput = 'input[data-testid="Name"]';
        this.dateInput = 'input[data-testid="Date"]';
        this.nameLabel = 'label[for="Name"]';
        this.dateLabel = 'label[for="Date"]';
        //Statement of Parent
        this.textAreaSelector = 'textarea[name="statementOfParentDetails"]';
        this.radioYesSelector = 'input[name="removalOfMyTissue"][value="Yes"]';
        this.radioNoSelector = 'input[name="removalOfMyTissue"][value="No"]';
        this.nameInputSelector = 'input[name="parentFullName"]';
        this.dateInputSelector = 'input[name="parentDate"]';
        this.clearButtonSelector = '[data-testid="Clear"]';
        //Confirmation of Consent
        this.signedByHealthProfessionalSelector = '.MuiTypography-h5:has-text("Signed")';
        this.healthProfessionalNameInputSelector = '#confirmationHealthProf';
        this.healthProfessionalJobTitleSelector = '[data-testid="Job Title"]';
        this.healthProfessionalDateSelector = '[name="confirmationDate"]';
        this.signedByParentSelector = '.MuiTypography-h5:has-text("Signed")';
        this.parentNameInputSelector = '[name="confirmationPatientName"]';
        this.parentDateSelector = '[name="confirmationPatientDate"]';
        this.clearButtonSelector = '[data-testid="Clear"]';
        //Withdraw Consent
        this.withdrawDate = page.locator("xpath=//input[@name='withdrawDate']");
        this.withdrawConsentCheckbox = 'span[data-testid="I hereby declare that I am withdrawing my previously given consent"]';

        //Section Expansion Buttons
        this.expandConfirmationOfConsent = page.getByRole('button', { name: 'Confirmation of Consent' }).getByLabel('cellmaAccordionIcon')
        this.expandStatementOfParent = page.getByRole('button', { name: 'Statement of Parent' }).getByLabel('cellmaAccordionIcon')
        this.expandStatementOfInterpreter = page.getByRole('button', { name: 'Statement of Interpreter' }).getByLabel('cellmaAccordionIcon')
        this.expandStatementOfHealth = page.getByRole('button', { name: 'Statement of Health' }).getByLabel('cellmaAccordionIcon')
        this.expandPatientDetails = page.getByRole('button', { name: 'Patient Details' }).getByLabel('cellmaAccordionIcon')
        this.expandWithdrawConsent = page.getByRole('button', { name: 'Withdraw Consent' }).getByLabel('cellmaAccordionIcon')

        //page.getByLabel('editIcon').first()
        this.editBtn = page.locator("xpath=//button[@aria-label='editIcon']")
        this.deleteBtn = page.locator("xpath=//button[@aria-label='deleteIcon']")
    }

    async fillConsentGivenBy(value) {
        await selectFromDropdown(this.page, this.consentGivenByInput, value);
    }

    async fillConsentType(value) {
        await selectFromDropdown(this.page, this.consentTypeInput, value);
    }

    async fillConsentStatus(value) {
        await selectFromDropdown(this.page, this.consentStatusInput, value);
    }

    async fillStartDate(value) {
        await this.page.fill(this.startDateInput, value);
    }

    async fillEndDate(value) {
        await this.page.fill(this.endDateInput, value);
    }

    async clickCompleteConsent() {
        await this.page.click(this.completeConsentButton);
    }

    async clickDownloadConsent() {
        await this.page.click(this.downloadConsentButton);
    }

    async clickChooseFile() {
        await this.page.click(this.chooseFileButton);
    }

    async clickGiveConsent() {
        await this.page.click(this.giveConsentButton);
    }

    async clickWithdrawConsentBtn() {
        await this.page.click(this.withdrawConsentButton);
    }

    async fillNotes(value) {
        await this.page.fill(this.notesTextarea, value);
    }

    async checkCheckboxConsent() {
        await this.page.check(this.checkboxConsent);
    }

    async uncheckCheckboxConsent() {
        await this.page.uncheck(this.checkboxConsent);
    }

    //Patient Details Section
    async getSurname() {
        return await this.page.$eval(this.surnameInput, el => el.value);
    }

    async getFirstName() {
        return await this.page.$eval(this.firstNameInput, el => el.value);
    }

    async getDob() {
        return await this.page.$eval(this.dobInput, el => el.value);
    }

    async getGender() {
        return await this.page.$eval(this.genderInput, el => el.value);
    }

    async getNhsNumber() {
        return await this.page.$eval(this.nhsNumberInput, el => el.value);
    }

    async getPid() {
        return await this.page.$eval(this.pidInput, el => el.value);
    }

    async fillSpecialRequirements(text) {
        //return await this.page.$eval(this.specialRequirementsInput, el => el.value);
        await this.page.fill(this.specialRequirementsInput, text);
    }

    async fillTreatmentName(tetx) {
        //return await this.page.$eval(this.treatmentNameInput, el => el.value);
        await this.page.fill(this.treatmentNameInput, text);
    }

    async fillMedicalTermExplanation(text) {
        //return await this.page.$eval(this.medicalTermExplanationInput, el => el.value);
        await this.page.fill(this.medicalTermExplanationInput, text);
    }
    
    // Statement of Health Professional
    async fillIntendedBenefits(text) {
        await this.page.fill(this.intendedBenefitsTextarea, text);
    }

    async fillFrequentlyOccurringRisks(text) {
        await this.page.fill(this.frequentlyOccurringRisksTextarea, text);
    }

    async fillBloodTransfusion(text) {
        await this.page.fill(this.bloodTransfusionDetailsTextarea, text)
    }

    async checkBloodTransfusion() {
        await this.page.click(this.bloodTransfusionCheckbox);
    }

    async uncheckBloodTransfusion() {
        await this.page.uncheck(this.bloodTransfusionCheckbox);
    }

    async checkOtherProcedures() {
        await this.page.check(this.otherProceduresCheckbox);
    }

    async checkFollowingInformation() {
        await this.page.check(this.followingInformationCheckbox);
    }

    async checkGeneralAnaesthesia() {
        await this.page.check(this.otherProceduresCheckbox);
    }

    async checkLocalAnaesthesia() {
        await this.page.check(this.otherProceduresCheckbox);
    }

    async checkSedation() {
        await this.page.check(this.otherProceduresCheckbox);
    }

    async fillProcedure(procedure) {
        await this.page.fill(this.procedureInput, procedure);
    }

    async fillProcedureDetails(details) {
        await this.page.fill(this.procedureDetailsTextarea, details);
    }

    async fillRiskDetails(details) {
        await this.page.fill(this.riskDetailsTextarea, details);
    }

    async fillResponsibleHealthProf(name) {
        await this.page.fill(this.responsibleHealthProfInput, name);
    }

    async fillHpUserName(name) {
        await this.page.fill(this.hpUserNameInput, name);
    }

    async fillHpUserJobTitle(title) {
        await this.page.fill(this.hpUserJobTitleInput, title);
    }

    async fillHpUserDate(date) {
        await this.page.fill(this.hpUserDateInput, date);
    }

    async submit() {
        await this.page.click(this.submitButton);
    }

    //Statement of Interpreter
    async clickClearButton() {
        await this.page.click(this.clearButton);
    }

    async fillName(name) {
        await this.page.fill(this.nameInput, name);
    }

    async fillDate(date) {
        await this.page.fill(this.dateInput, date);
    }

    async getNameLabelText() {
        return await this.page.textContent(this.nameLabel);
    }

    async getDateLabelText() {
        return await this.page.textContent(this.dateLabel);
    }

    async getNameInputValue() {
        return await this.page.inputValue(this.nameInput);
    }

    async getDateInputValue() {
        return await this.page.inputValue(this.dateInput);
    }

    //Statement of Parent
    async fillDetails(statement) {
        await this.page.fill(this.textAreaSelector, statement);
    }

    async selectTissueRemovalOption(option) {
        if (option === 'Yes') {
            await this.page.check(this.radioYesSelector);
        } else {
            await this.page.check(this.radioNoSelector);
        }
    }

    async enterName(name) {
        await this.page.fill(this.nameInputSelector, name);
    }

    async enterDate(date) {
        await this.page.fill(this.dateInputSelector, date);
    }

    async clearForm() {
        await this.page.click(this.clearButtonSelector);
    }

    async getNameValue() {
        return await this.page.inputValue(this.nameInputSelector);
    }

    async getDateValue() {
        return await this.page.inputValue(this.dateInputSelector);
    }

    //Confirmation of Consent
    async checkHealthProfessionalSigned() {
        await this.page.waitForSelector(this.signedByHealthProfessionalSelector);
        const signedText = await this.page.textContent(this.signedByHealthProfessionalSelector);
        return signedText.includes('Signed');
    }

    async fillHealthProfessionalDetails(name, jobTitle, date) {
        await this.page.fill(this.healthProfessionalNameInputSelector, name);
        await this.page.fill(this.healthProfessionalJobTitleSelector, jobTitle);
        await this.page.fill(this.healthProfessionalDateSelector, date);
    }

    async checkParentSigned() {
        await this.page.waitForSelector(this.signedByParentSelector);
        const signedText = await this.page.textContent(this.signedByParentSelector);
        return signedText.includes('Signed');
    }

    async fillParentDetails(name, date) {
        await this.page.fill(this.parentNameInputSelector, name);
        await this.page.fill(this.parentDateSelector, date);
    }

    async clickClearButton() {
        await this.page.click(this.clearButtonSelector);
    }

    //Withdraw Consent
    async fillWithdrawDate(value) {
        await typeText(this.page, this.withdrawDate, value);
    }

    async checkWithdrawConsent() {
        await this.page.click(this.withdrawConsentCheckbox);
    }

    //Section Expand/Collapse Methods
    async clickConfirmationOfConsent() {
        await this.expandConfirmationOfConsent.click()
    }
    async clickStatementOfParent() {
        await this.expandStatementOfParent.click()
    }
    async clickStatementOfInterpreter() {
        await this.expandStatementOfInterpreter.click()
    }
    async clickStatementOfHealth() {
        await this.expandStatementOfHealth.click()
    }
    async clickPatientDetails() {
        await this.expandPatientDetails.click()
    }

    async clickWithdrawConsent() {
        await this.expandWithdrawConsent.click()
    }

    async clickOnEditButton() {
        await this.editBtn.click()
    }

    async clickOnDeleteButton() {
        await this.deleteBtn.click()
    }
}

module.exports = ConsentPage;