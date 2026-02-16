class FindPatient {
    constructor(page) {
        this.page = page;
        this.mpiNumberInput = page.locator("xpath=//input[@name='mpiNumber']");
        this.barcodeInput = page.locator("xpath=//input[@name='barcode']");
        this.cardInput = page.locator("xpath=//input[@name='card']");
        this.nhsNumberInput = page.locator("xpath=//input[@name='nhsNumber']");
        this.hospitalRefInput = page.locator("xpath=//input[@name='hospitalRef']");
        this.givenNameInput = page.locator("xpath=//input[@name='givenName']");
        this.familyNameInput = page.locator("xpath=//input[@name='familyName']");
        this.sexInput = page.locator("xpath=//input[@name='sex']");
        this.bornInput = page.locator("xpath=//input[@name='born']");
        this.mobileInput = page.locator("xpath=//input[@name='mobile']");
        this.postcodeInput = page.locator("xpath=//input[@name='postcode']");
        this.mrnNumberInput = page.locator("xpath=//input[@name='mrnNumber']");
        this.identificationIdInput = page.locator("xpath=//input[@name='identificationId']");
        this.patientNameInOtherLanguageInput = page.locator("xpath=//input[@name='patientNameInOtherLanguage']");
        this.patientSeenInLastDaysInput = page.locator("xpath=//input[@name='patientSeenInLastDays']");
        this.includeDeceasedPatientsCheckbox = page.locator("xpath=//input[@name='includeDeceasedPatients']");
        this.includeServicePatientsCheckbox = page.locator("xpath=//input[@name='includeDeceasedService']");
        this.soundexCheckbox = page.locator("xpath=//input[@name='soundex']");
        this.searchButton = page.locator("xpath=//button[@type='submit'][@data-testid='Search']");
    }
    async enterMpiNumber(value) {
    await this.mpiNumberInput.fill(value);
}

async enterBarcode(value) {
    await this.barcodeInput.fill(value);
}

async enterCard(value) {
    await this.cardInput.fill(value);
}

async enterNhsNumber(value) {
    await this.nhsNumberInput.fill(value);
}

async enterHospitalRef(value) {
    await this.hospitalRefInput.fill(value);
}

async enterGivenName(value) {
    await this.givenNameInput.fill(value);
}

async enterFamilyName(value) {
    await this.familyNameInput.fill(value);
}

async enterSex(value) {
    await this.sexInput.fill(value);
}

async enterBorn(value) {
    await this.bornInput.fill(value);
}

async enterMobile(value) {
    await this.mobileInput.fill(value);
}

async enterPostcode(value) {
    await this.postcodeInput.fill(value);
}

async enterMrnNumber(value) {
    await this.mrnNumberInput.fill(value);
}

async enterIdentificationId(value) {
    await this.identificationIdInput.fill(value);
}

async enterPatientNameInOtherLanguage(value) {
    await this.patientNameInOtherLanguageInput.fill(value);
}

async enterPatientSeenInLastDays(value) {
    await this.patientSeenInLastDaysInput.fill(value);
}

async checkIncludeDeceasedPatients() {
    await this.includeDeceasedPatientsCheckbox.check();
}

async checkIncludeServicePatients() {
    await this.includeServicePatientsCheckbox.check();
}

async checkSoundex() {
    await this.soundexCheckbox.check();
}

async clickOnSearchButton() {
    await this.searchButton.click();
}
}
module.exports=FindPatient