const { clickElement, typeText, selectFromDropdown} = require('../../../UtilFiles/StaticUtility.js');
const { selectFromSearchResults, selectRadioButton, locateFieldById, toggleDivVisibility, clickOnRemoveCustomizableQuestion, clickOnRestoreCustomizableQuestion, showClinicalItemByStatus, showExtraDetailLevel, clickHistoryTableIconsBeforeItemName, clickHistoryTableIconsUsingItemName, replaceLocator, assertElementExists } = require('../../../UtilFiles/DynamicUtility.js');

class ClinicalMedicationAdministration {
    constructor(page) {
        this.page = page;
        this.expandMedication = page.getByLabel('expandRowIconParacetamol')
        this.givenMedication = page.getByTestId('Give')
        this.dropdownBatch = page.getByLabel('Open')
        this.selectBatch = page.getByRole('option', { name: 'Paracetamol 500mg / Ibuprofen 200mg tablets' })
        this.btnSelect = page.getByTestId('Select')
        this.btnSave = page.getByTestId('Save')
        this.btnLogout = page.getByTestId('logout')
        this.btnPageBack = page.getByLabel('Back-Button')
        this.btnCheckAll = page.getByTestId('Check All')
        this.btnSaveChecklist = page.getByLabel('saveChecklist')

        //Front End Display Locators

        this.lastDateField = page.locator('div').filter({ hasText: /^22\/01\/2025$/ }).nth(1)
        this.timeSlotOneNotGiven = page.locator('div:nth-child(9) > .MuiGrid2-root > .MuiSvgIcon-root').first()
        this.timeSlotOne = page.locator('div:nth-child(4) > div:nth-child(9) > .MuiGrid2-root').getByTestId('DoneIcon')
        this.timeSlotTwo = page.locator('div:nth-child(5) > div:nth-child(9) > .MuiGrid2-root').getByTestId('DoneIcon')
        this.medicationName = page.getByRole('heading', { name: 'Paracetamol 500mg / Ibuprofen 200mg tablets' })
        this.medicationDose = page.getByRole('heading', { name: '2 (Tablet)' })
        this.medicationRoute = page.getByRole('heading', { name: 'Oral' })
        this.medicationFrequency = page.getByRole('heading', { name: 'Hours' })
        this.medicationDuration = page.getByRole('heading', { name: 'Days' })
        //this.medicationStartDate = page.getByRole('heading', { name: '13/06/2025' }).first()
        //this.username = page.getByRole('heading', { name: 'Thayne.auto' })

        //Review
        this.reviewLink=page.locator("xpath=//a[@class='MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineHover css-1cahger'][@data-testid='Review']")
        this.clinicalReviewTextbox=page.locator("xpath=//input[@id='reviewCode']")
        this.saveClinicalReviewbutton=page.locator("xpath=//button[@id=':r4vc:']//div[@class='MuiGrid2-root MuiGrid2-direction-xs-row css-3ex5vf'][normalize-space()='Save']")
       this.GivenLink=page.locator("xpath=//a[@aria-label='Give']")
       //this.GivenLink=page.getByTestId('Give')
        this.batchdropdown=page.locator("xpath=//input[@id='selectBatch']")
        this.selectbatchButton=page.locator("xpath=//div[contains(text(),'Select')]")
    }

    async clickOnSelectButtonbatch()
    {
        await this.selectbatchButton.click()
    }
    async clickOnselectBatch()
    {
        await this.batchdropdown.click()
        await this.page.locator("xpath=//li[@id='selectBatch-option-0']").click()
    }

    async ClickOnGivenLink()
    {
        await this.GivenLink.click()
    }

    async clickOnSaveClinicalReviewButton()
    {
        // await this.saveClinicalReviewbutton.click();
        // await this.page.waitForTimeout(500);
        await this.page.getByTestId('CommonCellmaPopup').getByTestId('Save').click()
    }

    async selectclinicalReview()
    {
        await this.clinicalReviewTextbox.click()
        await this.page.locator("xpath=//li[@id='reviewCode-option-4']").click()
    }

    async clickOnReviewLink()
    {
        await this.reviewLink.click()
    }

    async clickOnMedicationToggle() {
        await clickElement(this.page, this.expandMedication);
    }
    async clickOnNotGivenLink() {
        await clickElement(this.page, this.givenMedication);
    }
    async clickOnBatchDropdown() {
        await clickElement(this.page, this.dropdownBatch);
    }
    async selectBatchMedication(batch){
        await selectFromDropdown(this.page, this.dropdownBatch, batch);
    }
    async clickOnSelectButton() {
        await clickElement(this.page, this.btnSelect);
    }
    async clickOnSaveButton() {
        await clickElement(this.page, this.btnSave);
    }
    async clickOnBackButton() {
        await clickElement(this.page, this.btnPageBack);
    }
    async clickOnCheckAllButton() {
        await clickElement(this.page, this.btnCheckAll);
    }
    async clickOnSaveChecklistButton() {
        await clickElement(this.page, this.btnSaveChecklist);
    }
}

module.exports = ClinicalMedicationAdministration;