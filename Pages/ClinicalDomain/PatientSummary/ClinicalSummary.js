//Sathyanarayan


const { clickElement, typeText, selectFromDropdown} = require('../../../UtilFiles/StaticUtility.js');
const { selectFromSearchResults, selectRadioButton, locateFieldById, toggleDivVisibility, clickOnRemoveCustomizableQuestion, clickOnRestoreCustomizableQuestion, showClinicalItemByStatus, showClinicalItemByStatusforCarePlan, showExtraDetailLevel, clickHistoryTableIconsBeforeItemName, clickHistoryTableIconsUsingItemName, replaceLocator, assertElementExists,clickOnFitnessRadioButton,clickMCHistoryTableIconsUsingItemName } = require('../../../UtilFiles/DynamicUtility.js');

class ClinicalSummary {
    constructor(page) {

        //Search and Add Items to Contact 
       // this.allCategory= page.locator("xpath=//input[@id='allCategory']") 
       this.allCategory= page.locator("xpath=//input[@id='allCategory']") 
        this.allCategorySearchItem = page.locator("xpath=//label[text()='Any Search, Item, Code, Category']")

        //View Menu to View Contact Items
        this.viewContactItemsMenu = page.locator("xpath=//h1[contains(text(), 'View')]/../..//button[@aria-label='Menu Button']")
        this.closeContactItemMenu = page.locator("xpath=//h1[contains(text(), 'Items added to current contact')]/../..//button[@aria-label='Menu Button']")
        this.flag = true
        this.pinContactItemsMenu = page.locator("xpath=//button[@aria-label='pin']")
        this.page = page;
        
        //Item Name to be added/updated/deleted
        this.itemName= "";
        this.closeWindowLocator= page.locator("//button[@aria-label='cancelIcon']");

        // Search Clinical Items fields
        this.searchClinicalItem = page.locator("xpath=//label[text()='Any Search, Item, Code, Category']");
        this.addClinicalItem = page.locator("xpath=//button[@aria-label='Add']")

        //Medication
        this.editFavouriteMedication=page.locator("xpath=//button[@aria-label='editIconButton']")
       
        // Clinical Section Divs - These locators should be declared as string as we will use the toggle function
        this.expandSearchButton = "xpath=//div[@data-testid='search']//button[@aria-label='cellmaAccordionIcon']//*[name()='svg'][@aria-label='Expand']";
        //this.hideSearchButton = "xpath=//div[@data-testid='search']//button[@aria-label='cellmaAccordionIcon']//*[name()='svg'][@aria-label='Hide']";
        this.hideSearchButton = "xpath=//button[@data-testid='search']//button[@aria-label='cellmaAccordionIcon']";
        this.expandFavouritesButton = "xpath=//div[@data-testid='favourites']//button[@aria-label='cellmaAccordionIcon']//*[name()='svg'][@aria-label='Expand']";
        this.hideFavouritesButton = "xpath=//div[@data-testid='favourites']//button[@aria-label='cellmaAccordionIcon']//*[name()='svg'][@aria-label='Hide']";
        this.expandHistoryButton = "xpath=//div[@data-testid='categoryHistoryAccordion']//button[@aria-label='cellmaAccordionIcon']//*[name()='svg'][@aria-label='Expand']";
        this.hideHistoryButton = "xpath=//div[@data-testid='categoryHistoryAccordion']//button[@aria-label='cellmaAccordionIcon']//*[name()='svg'][@aria-label='Hide']";
        
        // Favourites & Order sets
        // this.orderSetName = "xpath=//h1[text()='Conditions Order Sets']//..//..//button[@aria-label='Condyloma latum']"
        this.orderSetNameOpthamology = page.locator("xpath=//div[contains(text(),'Diagnosis HIV')]")
        this.orderSetItemSleepapnoea =page.locator("xpath=//a[@aria-label='Sleep apnoea']")
        // this.favouriteName = "xpath=//h1[text()='Conditions Favourites']//..//..//button[@aria-label='Condyloma latum']"
        this.favouriteNameRespiratory = page.locator("xpath=//div[contains(text(),'ENT System')]")
        this.FavouriteItemLungCancer=page.locator("xpath=//a[@aria-label='ACUTE SINUSITIS']").first()
        this.favouriteQueExamination=page.locator("xpath=//button[@data-testid='Mental Health (MH)']")
        this.favouriteItemExamination=page.locator("xpath=//a[@aria-label='Mental Health Assessment']")
        //this.favouriteQueMedication=page.locator("xpath=//div[contains(text(),'Antibiotics')]")
       // this.favouriteQueMedication=page.locator("xpath=//button[@data-testid='Medicine Favourites']")
        this.favouriteQueMedication=page.locator("xpath=//button[@data-testid='Medication Orders']")
        
        //        //this.favouriteItemMedication=page.locator("xpath=//a[@aria-label='Azithromycin 500mg tablets']")
        //this.favouriteItemMedication=page.locator("xpath=//a[@aria-label='Paracetamol 500mg tablets']")
        this.favouriteItemMedication=page.locator("xpath=//a[@aria-label='Ibuprofen 400mg Tablet']")

        // this.orderSetItem = "xpath=//a[text()='Metformin 500mg tablets     ']//..//..//input[@class='PrivateSwitchBase-input css-1m9pwf3']"
        //this.orderSetItem = "xpath=//a[text()='placeholder1']//..//..//input[@class='placeholder2']"       
        // this.favouriteItem = "xpath=//a[text()='Metformin 500mg tablets']//..//..//input[@class='PrivateSwitchBase-input css-1m9pwf3']"
       // this.favouriteItem = "xpath=//a[text()='placeholder1']//..//..//input[@class='placeholder2']"

       this.checkAllCheckboxCheckList=page.locator("xpath=//button[@data-testid='Check All']")
        //RiskLevel dropdown
        this.riskLevel = page.locator("xpath=//input[@id='riskLevel']");

        //Patient Scan
        

        //Overview
        this.addClinicalItem = page.locator("xpath=//button[@data-testid='Add']")


        //Medical Certificates
        this.AddMedicalCertificateButton=page.locator("xpath=//div[contains(text(),'Add Applicant Medical Certificate')]")
        this.showLink=page.locator("xpath=//a[@aria-label='Show']")
        this.buttonPrint=page.locator("xpath=//button[@class='MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeSmall MuiButton-containedSizeSmall MuiButton-disableElevation MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeSmall MuiButton-containedSizeSmall MuiButton-disableElevation css-1hx9jce']//div[@class='MuiGrid-root MuiGrid-item css-1wxaqej'][normalize-space()='Print']")
        //Locators for Assertions 
        //this.historyTableItem = "xpath=//div[@id='historyTable']//*[text()='Sleep walking disorder']";          

        //Diagnosis Customizable question
       // this.customizableQuestion="xpath=//div[@class='MuiGrid-root MuiGrid-container MuiGrid-item MuiGrid-grid-xs-3 css-1jjp2xs']//label[text()='placeholder1']/parent::div/..//preceding-sibling::div/preceding-sibling::div//button";
        
        //Assessments
          this.assessmentType= page.locator("xpath=//input[@id='assessmentType']")
          this.assessmentName= page.locator("xpath=//input[@id='assessmentName']")
          this.assessmentSelectBtn= page.locator("xpath=//div[contains(text(),'Select')]")

          
          this.btnKFT= page.locator("xpath=//button[@id=':r60i:']//div[normalize-space()='Kidney Function Test']")
          this.btnNext= page.locator("xpath=//div[contains(text(),'Next')]")
          this.btnEnd= page.locator("xpath=//button[@aria-label='End']")
          this.btcRecomToRest= page.locator("xpath=//button[@aria-label='Recommendation to rest']")
          this.addNotes= page.locator("xpath=//textarea[@id='additionalNotes2353465']")
          this.clinicalReview = page.locator("xpath=//button[@data-testid='clinicalReview']")
          this.btnAsymptomatic = page.locator("xpath=//button[@id=':r6g6:'][normalize-space()='Asymptomatic']")
          this.notesPresentingProblem = page.locator("xpath=//div[@class='MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth Mui-focused MuiInputBase-formControl MuiInputBase-sizeSmall MuiInputBase-multiline MuiInputBase-adornedEnd css-ypy1ze']//textarea[@id='notesPP_A_101.19']")
          this.btnAnaemia = page.locator("xpath=//button[@aria-label='Anaemia']")

          //Assessment Divs
          this.divInvestigation = page.locator("xpath=//div[contains(text(),'Investigations')]")
          this.divRecommendations = page.locator("xpath=//button[@data-testid='recommendations']")
          this.divPresentingProblems = page.locator("xpath=//button[@data-testid='presentingProblems']")
          this.divDiagnosis = page.locator("xpath= //div[contains(text(),'Diagnosis')]")
          this.divExamination = page.locator("xpath= //div[contains(text(),'Examinations')]")
          this.divRiskFactos = page.locator("xpath=//div[contains(text(),'Risk Factors')]")
          this.divSocialCircum = page.locator("xpath= //div[contains(text(),'Social Circumstances')]")
          this.divInterpretations = page.locator("xpath=//div[contains(text(),'Interpretations')]")
          this.divOverview = page.locator("xpath=//div[contains(text(),'Overview')]")
          this.divPatientDetails = page.locator("xpath=//div[contains(text(),'Patient Details')]")
          this.divPresProblems = page.locator("xpath=//div[contains(text(),'Presenting Problems')]")
          this.divConditions = page.locator("xpath=//div[contains(text(),'Conditions')]")
          this.divLifestyle = page.locator("xpath=//div[contains(text(),'Lifestyle')]")
          this.divMedication = page.locator("xpath=//div[contains(text(),'Medication')]")
          this.divAllergies = page.locator("xpath=//div[contains(text(),'Allergies')]")

          //Assessment Checkboxes
          this.selectCheckbox = page.getByRole('checkbox', { name: 'hideLabel' }).first()
          this.selectExSmoker = page.getByRole('checkbox', { name: 'Smoking Status: Ex-smoker' })
          //Assessment buttons
          this.CBCBtn = page.getByRole('button', { name: 'Complete Blood Count' })
          this.DryEyeBtn = page.getByRole('button', { name: 'Dry eye' })
          this.metforminBtn  = page.getByRole('button', { name: 'Metformin 500mg tablets' })
          this.asthmaBtn = page.getByRole('button', { name: 'Asthma' })
          this.overviewText = page.getByRole('textbox', { name: 'overview458200' })
          this.cancelAssessment = page.locator("xpath=//button[@aria-label='Cancel']")
          this.endAssessmentOkBtn= page.locator("xpath=//button[@aria-label='Ok']")
          this.viewPrintLink= page.locator('td:nth-child(7)').first()
          //this.asthmaLink = page.locator('xpath=//a[@data-testid="Asthma"]').nth(0);
          this.asthmaLink = page.locator('xpath=(//a[@data-testid="Asthma"])[last()]')
          //this.dryEyeLink = page.locator("xpath=//a[data-testid='Dry eye']").last()
          this.dryEyeLink = page.getByTestId('CommonCellmaPopup').getByTestId('Dry eye')
          this.completeBloodCountLink = page.getByTestId('CommonCellmaPopup').getByTestId('Complete Blood Count')
          //this.completeBloodCountLink = page.locator("xpath=//a[@data-testid='Complete Blood Count']").last()
          //this.medicationLink = page.locator("xpath=//a[@data-testid='Medication']").last()
          this.medicationLink = page.getByTestId('CommonCellmaPopup').getByText('Metformin 500mg tablets')
          this.popupLocator = page.locator('//div[@class="MuiDialog-container MuiDialog-scrollPaper css-8azq84"]');
          this.SavePopupbutton=page.locator("xpath=//button[@data-testid='Save']")

        //Links
        this.dropdownLinks=page.getByTestId('Links')
        this.linkMedicationAdministrations=page.getByRole('heading', { name: 'Medication Administrations' })

        this.dropdownAddTo=page.getByTestId('Add To')
        this.linkPatientConsent = page.locator("xpath=//li[@data-testid='patientConsent']")
          
     }

       //Pharmacy portal.
     async changeRiskLevel(risk){
        await this.page.getByRole('button', { name: risk }).click();
    }
     async selectAndAddMedication(clinicalItemName) {

        console.log("Item Name is:"+clinicalItemName);
        
        //await page.pause()
        await selectFromSearchResults(this.page, this.searchMedication, clinicalItemName, this.addClinicalItem);  
   
     }
     //Add favourites
     //Diagnosis
     async clickOnFavouritesQuestion()
     {
        await this.favouriteNameRespiratory.click()
     }

     async clickOnfavouritesItem()
     {
        await this.FavouriteItemLungCancer.click()
     }

     //Add order sets diagnosis
        async clickOnOrderSetOpthamology()
        {
            await this.orderSetNameOpthamology.click()
        }

        async clickOnOrderSetItemSleepapnoea()
        {
            await this.orderSetItemSleepapnoea.click()
        }

     //Examination
     async clickOnFavouriteQueExam()
     {
        await this.favouriteQueExamination.click()
     }


     async clickOnFavouritemItemExam()
     {
        await this.favouriteItemExamination.click()
     }

     //Orderset exam
     

     //Medication

     async clickOnFavouriteQueMedication()
     {
        await this.favouriteQueMedication.click()
     }


     async clickOnFavouritemItemMedication()
     {
        await this.favouriteItemMedication.click()
     }

     async clickOnEditIconforFavouriteMedication()
     {
        await this.editFavouriteMedication.click()
     }

     

     async clickOnCheckallCheckListcheckbox()
     {
        await this.checkAllCheckboxCheckList.click()
     }
     
     //Links
     async clickOnDropdownLinks()
     {
         await this.dropdownLinks.click()
     }

     async clickOnMedicationAdministrationsLink()
     {
         await this.linkMedicationAdministrations.click()
     }

     async clickOnDropdownAddToo()
     {
        await this.dropdownAddTo.click()
     }
     async clickOnPatientConsent(){
        await this.linkPatientConsent.click()
     }

     async clickOnSavePopup()
     {
        await this.SavePopupbutton.click()
     }

     async closePopUp(page) {
        //await page.pause()
       await this.page.locator("xpath=//button[@aria-label='cancelIcon']").click()
       //await this.page.getByRole('button', { name: 'cancelIcon' }).click()
    }



    async clickMedicationLink()
     {
        await clickElement(this.page, this.medicationLink)
     }

      async DiagnosisLink()
     {
        await clickElement(this.page, this.asthmaLink)
     }
     async examinationLink()
     {
        await clickElement(this.page, this.dryEyeLink)
     }

     async investigationLink()
     {
        await clickElement(this.page, this.completeBloodCountLink)
     }
     async clickMedicationLink()
     {
        await clickElement(this.page, this.medicationLink)
     }


      async clickViewPrintLink()
     {
        await clickElement(this.page, this.viewPrintLink)
     }

     async cancelAssessmentBtn()
     {
        await clickElement(this.page, this.cancelAssessment)
     }
     async cancelAssessmentBtn()
     {
        await clickElement(this.page, this.cancelAssessment)
     }
     async okBtnForEndAssessment()
     {
        await clickElement(this.page, this.endAssessmentOkBtn)
     }
     async selectAssessmentType()
      {
        await selectFromDropdown(this.page, this.assessmentType,'User Assessment')
      }
      async selectAssessmentName()
      {
        await selectFromDropdown(this.page, this.assessmentName,'HACU-Nurse Assessment')
      }

      async ClickOnAssessmentSelectBtn()
    {
        await clickElement(this.page, this.assessmentSelectBtn)
    }

    //Assessment Divs

  

     async ClickOnDivInvestigation()
    {
        await clickElement(this.page, this.divInvestigation)
    }
     async ClickOndivRecommendations()
    {
        await clickElement(this.page, this.divRecommendations)
    }
     
    async clickDivPresentingProblems()
    {
        await clickElement(this.page, this.divPresentingProblems)
    }
     async clickDivDiagnosis()
    {
        await clickElement(this.page, this.divDiagnosis)
    }

    async clickDivExamination()
    {
        await clickElement(this.page, this.divExamination)
    }
     
    async clickDivMedication()
    {
        await clickElement(this.page, this.divMedication)
    }
     async clickDivRiskFactos()
    {
        await clickElement(this.page, this.divRiskFactos)
    }

      async clickDivSocialCircum()
     {
        await clickElement(this.page, this.divSocialCircum)
     }
      async clickDivInterpretations()
     {
        await clickElement(this.page, this.divInterpretations)
     }
      async clickDivOverview()
     {
        await clickElement(this.page, this.divOverview)
     }
       async clickDivPatientDetails()
     {
        await clickElement(this.page, this.divPatientDetails)
     }
     async clickDivPresProblems()
     {
        await clickElement(this.page, this.divPresProblems)
     }

     async clickDivConditions()
     {
        await clickElement(this.page, this.divConditions)
     }
     async clickDivLifestyle()
     {
        await clickElement(this.page, this.divLifestyle)
     }
     
     async clickDivAllergies()
     {
        await clickElement(this.page, this.divAllergies)
     }
     //assessment select checkbox
     async selectAssessmentCheckbox()
     {
        await clickElement(this.page, this.selectCheckbox)
     }
     async selectExSmokerCheckbox()
     {
        await clickElement(this.page, this.selectExSmoker)
     }
     
     // assessment buttons*******************************************************************

     async clickOnEndButton()
     {
        await clickElement(this.page, this.btnEnd)
     }
     async selectAsthma()
     {
        await clickElement(this.page, this.asthmaBtn)
     }
      
     async selectDryEye()
     {
        await clickElement(this.page, this.DryEyeBtn)
     }
     
     async selectCBCBtn()
     {
        await clickElement(this.page, this.CBCBtn)
     }
      
     async selectMetforminBtn()
     {
        await clickElement(this.page, this.metforminBtn)
     }

       async enterOverviewNotes(Overview_notes)
    {
      await typeText(this.page, this.overviewText, Overview_notes);
    } 
      


    async ClickOnbtnKFT()
    {
        await clickElement(this.page, this.btnKFT)
    }

     async ClickOnbtnNext()
    {
        await clickElement(this.page, this.btnNext)
    }

   

    async ClickOnbtcRecomToRest()
    {
        await clickElement(this.page, this.btcRecomToRest)
    }


      // Handle SubCategory Popup

     async  handleSubCategoryPopup(page) {
    const popupHeader = "//h1[normalize-space()='Choose a Sub Category to continue']";
    const dropdown = "//input[@id='subcategory']";
    const option = page.getByRole('option', { name: 'Sub Category' });
    const saveButton = "//button[@aria-label='saveSubcategoryBtn']";

    
    // Check if popup is visible
    const isPopupVisible = await page.locator(popupHeader).isVisible();

    if (isPopupVisible) {
        console.log("Sub Category popup detected. Selecting and saving...");

        await page.click(dropdown);               // Click dropdown
        await option.click();                     // Select value
        await page.click(saveButton);             // Click save button
    } else {
        console.log("Popup not visible. Skipping Sub Category selection.");
    }
}
    

    ///////////////////////////////BUTTON CLICKS///////////////////////////////////////////////
    /*This method is no longer used as we are clicking it in selectandaddClinicalItem*/
    // // Click on Add Medication button
    // async clickOnAddClinicalItem() {
    //     await this.page.waitForSelector(this.addClinicalItem);
    //     await clickElement(this.page, this.addClinicalItem);
    // }

    //TestTool
    async clickOnAddButton() {
        await clickElement(this.page, this.addClinicalItem)
    }

    //Medical Certificate
    async ClickOnAddMedicalCertificateButton()
    {
        await clickElement(this.page, this.AddMedicalCertificateButton)
    }

    async clickOnPrintButton()
     {
        await this.buttonPrint.click()
     }

    async clickOnShowLink()
     {
        await this.showLink.click()
     }

     async clickOnMCItemDelete(item = null){
        if(item){
            this.itemName=item;
            console.log("Itemname is:"+ this.itemName);            
        }
        await clickMCHistoryTableIconsUsingItemName(this.page,this.itemName, 'Delete')
    }
    
    async clickOnMCItemHistory(item = null){
        if(item){
            this.itemName=item;
        }
        await clickMCHistoryTableIconsUsingItemName(this.page,this.itemName, 'historyIconButton')
    }

    async clickOnMCItemDiv(item = null){
        try {
            if (item) {
                this.itemName = item;
            }
                 // clickMCHistoryTableIconsUsingItemName
            await clickMCHistoryTableIconsUsingItemName(this.page, this.itemName, 'expandRowIconundefined') // Open Div
            await this.page.waitForTimeout(1000); // Wait for some time
            await clickMCHistoryTableIconsUsingItemName(this.page, this.itemName, 'expandRowIconundefined') // Close Div
        } catch (error) {
            console.error(`Error clicking on item div: ${error.message}`);
        }
    }
    
    async clickOnMCItemEdit(item = null){
        if(item){
            this.itemName=item;
            console.log("Itemname is:"+ this.itemName);            
        }
        await clickMCHistoryTableIconsUsingItemName(this.page,this.itemName, 'edit')
    }

    async clickOnCertificateFitnessforFit(item = null,status){
        if(item){
            this.itemName=item;
        }
        await clickOnFitnessRadioButton(this.page,this.itemName, status)
    }

    //
    async toggleSearchSection() {
        await toggleDivVisibility(this.page, this.expandSearchButton, this.hideSearchButton);
    }

    async toggleFavouritesSection() {
        await toggleDivVisibility(this.page, this.expandFavouritesButton, this.hideFavouritesButton);
    }

    async toggleHistorySection() {
        await toggleDivVisibility(this.page, this.expandHistoryButton, this.hideHistoryButton);
    }

    ////////////////////////////CHOOSE DYNAMIC QUESTION FOR CUSTOMIZABLE VIEW////////////////////////

    async clickOnDeleteQuestion(questionName)
    {
        this.itemName.questionName;
        await clickOnRemoveCustomizableQuestion(this.page, questionName)
    }

    async clickOnRestoreQuestion(questionName)
    {
        this.itemName.questionName;
        await clickOnRestoreCustomizableQuestion(this.page,questionName)
    }


    //Overview
    async selectandAddOverview() {
        //this.itemName=clinicalItemName;
        await clickElement(this.page, this.addClinicalItem)
       // await this.addClinicalItem.click() 
    }
    ///////////////////////////////CHOOSE DYNAMIC DROPDOWN ITEMS//////////////////////////////////
    
    async selectTestToolItem(testToolName) {
        this.itemName = this.page.locator(`xpath=//h1[normalize-space()='${testToolName}']`)
        this.searchClinicalItem = this.page.locator("xpath=//input[@name='search']")
        await this.searchClinicalItem.click()
        await this.itemName.click()
    }

    async selectandAddClinicalItem(clinicalItemName) {
        
        this.itemName=clinicalItemName;
        console.log("Item Name is:"+this.itemName);
        
        //await page.pause()
        await selectFromSearchResults(this.page, this.searchClinicalItem, clinicalItemName, this.addClinicalItem);  
   
    }


    // async selectandAddCarePlanItems(clinicalItemName) {
    //     this.itemName=clinicalItemName;
    //     await selectFromSearchResults(this.page, this.searchClinicalItem, clinicalItemName);  
    // }

    async selectClass(className)
    {
        await selectRadioButton(this.page, className);
    }

    async selectLicCategory(licCategory)
    {
        await selectRadioButton(this.page, licCategory);
    }

    async selectModeCategory(mode)
    {
        await selectRadioButton(this.page, mode);
    }

    async selectValidityCategory(Validity)
    {
        await selectRadioButton(this.page, Validity);
    }      
    async selectAllRiskLevel(){
        await selectFromDropdown(this.page, this.riskLevel, 'All')
    }

    async selectLowRiskLevel(){
        await selectFromDropdown(this.page, this.riskLevel,'Low Risk')
    }

    async selectModerateRiskLevel(){
        await selectFromDropdown(this.page, this.riskLevel, 'Moderate Risk')
    }

    async selectHighRiskLevel(){
        await selectFromDropdown(this.page, this.riskLevel, 'High Risk')
    }


//////////////////////// STATIC METHODS USED TO CLICK ON DYNAMICALLY CREATED LOCATORS /////////////////

    async clickOnAllItemsSection(){
        await showClinicalItemByStatus(this.page, 'All');
    }

    async clickOnCurrentItemsSection(){
        await showClinicalItemByStatus(this.page, 'Current');
    }

    async clickOnNormalItemsSection(){
        await showClinicalItemByStatus(this.page, 'Normal');
    }

    async clickOnMigratedItemsSection(){
        await showClinicalItemByStatus(this.page, 'Migrated');
    }

    async clickOnGeneralItemsSection(){
        await showClinicalItemByStatus(this.page, 'General');
    }

    async clickOnSurgicalItemsSection(){
        await showClinicalItemByStatus(this.page, 'Surgical');
    }

    async clickOnMigratedItemsSectionCarePlan(){
        await showClinicalItemByStatusforCarePlan(this.page, 'Migrated');
    }
    async clickOnDeletedItemsSectionCarePlan(){
        await showClinicalItemByStatusforCarePlan(this.page, 'Deleted');
    }

    async clickOnDeletedItemsSection(){
        await showClinicalItemByStatus(this.page, 'Deleted');
    }

    async clickOnArchivedItemsSection(){
        await showClinicalItemByStatus(this.page, 'Archived');
    }

    async clickOnStoppedSection(){
        await showClinicalItemByStatus(this.page, 'Stopped');
    }



    async clickOnLevelOneExtraDetails(){
        await showExtraDetailLevel(this.page, 'levelOne');
    }

    async clickOnLevelTwoExtraDetails(){
        await showExtraDetailLevel(this.page, 'levelTwo');
    }

    async clickOnLevelThreeExtraDetails(){
        await showExtraDetailLevel(this.page, 'levelThree');
    }

    async clickOnItemDiv(item = null){
        try {
            if (item) {
                this.itemName = item;
            }
            await clickHistoryTableIconsUsingItemName(this.page, this.itemName, 'expandRowIconundefined') // Open Div
            await this.page.waitForTimeout(1000); // Wait for some time
            await clickHistoryTableIconsUsingItemName(this.page, this.itemName, 'expandRowIconundefined') // Close Div
        } catch (error) {
            console.error(`Error clicking on item div: ${error.message}`);
        }
    }

    async clickOnHistoryItemDiv(){
            await clickHistoryTableIconsUsingItemName(this.page,this.itemName, 'expandRowIconundefined', true) 
    }

    async clickOnItemHistory(item = null){
        if(item){
            this.itemName=item;
        }
        await clickHistoryTableIconsUsingItemName(this.page,this.itemName, 'patientHistoryIconButton')
    }

    async clickOnItemReview(item = null){
        if(item){
            this.itemName=item;
        }
        await clickHistoryTableIconsUsingItemName(this.page,this.itemName, 'reviewIconButton')
    }

    // async clickOnCancelFavouritesQuestion(item = null){
    //     if(item){
    //         this.itemName=item;
    //     }
    //     await clickHistoryTableIconsUsingItemName(this.page,this.itemName, 'cancelFavouritesQuestion')
    // }

    async clickOnItemHighlightNone(item = null){
        if(item){
            this.itemName=item;
        }
        await clickHistoryTableIconsUsingItemName(this.page,this.itemName, 'highlightNone')

    }

    async clickOnItemHighlightModerate(item = null){
        if(item){
            this.itemName=item;
        }
        await clickHistoryTableIconsUsingItemName(this.page,this.itemName, 'highlightModerate')
    }

    async clickOnItemHighlightHigh(item = null){
        if(item){
            this.itemName=item;
        }
        await clickHistoryTableIconsUsingItemName(this.page,this.itemName, 'highlightHigh')
    }

    async clickOnItemEdit(item = null){
        if(item){
            this.itemName=item;
        }
        await clickHistoryTableIconsUsingItemName(this.page,this.itemName, 'editIconButton')
    }

    async clickOnDeviceEdit(item = null){
        if(item){
            this.itemName=item;
        }
        await clickHistoryTableIconsUsingItemName(this.page,this.itemName, 'edit')
    }

    async closeWindow(){
        await clickElement(this.page, this.closeWindowLocator)
    }

    async clickOnOrderSets(category, ordersets){
        const favouriteLocator = this.orderSetName
    //        xpath=//h1[text()='placeholder1']//..//..//button[@aria-label='placeholder2']
        const placeholderValues = {
            "placeholder1": `${category} Order Sets`,
            "placeholder2": ordersets
        }
        const updatedLocator = replaceLocator(favouriteLocator, placeholderValues);
        await clickElement(updatedLocator)
    }

    async clickOnFavourites(category, favourite){
        const favouriteLocator = this.favouriteName
        const placeholderValues = {
            "placeholder1": `${category} Favourites`,
            "placeholder2": favourite
        }
        const updatedLocator = replaceLocator(favouriteLocator, placeholderValues);
        await clickElement(updatedLocator)
    }

    async clickOnOrderSetItem(category, orderSetItem){
        const favouriteLocator = this.orderSetItem
        const placeholderValues = {
            "placeholder1": orderSetItem,
            "placeholder2": ordersets
        }
        const updatedLocator = replaceLocator(favouriteLocator, placeholderValues);
        await clickElement(updatedLocator)
    }

    async clickOnFavouriteItem(category, favourite){
        const favouriteLocator = this.favouriteName
        const placeholderValues = {
            "placeholder1": `${category} Favourites`,
            "placeholder2": favourite
        }
        const updatedLocator = replaceLocator(favouriteLocator, placeholderValues);
        await clickElement(updatedLocator)
    }

    /////////////////////////////// METHOD TO CREATE LOCATORS DYNAMICALLY ////////////////////////////

    //Status wise items click
    /* Methods to be called as below for required category
    await showClinicalItemByStatus(page, 'All');
    await showClinicalItemByStatus(page, 'Normal');
    await showClinicalItemByStatus(page, 'Migrated');
    await showClinicalItemByStatus(page, 'Deleted');
    await showClinicalItemByStatus(page, 'Archived');
    */
    // async showClinicalItemByStatus(page, tabText) {
    //     const locator = `xpath=//div[@class='MuiTabs-flexContainer css-k008qs']//button[contains(text(), '${tabText}')]`;
    //     await clickElement(page, locator);
    // }

        //View Level of extra details
    /* Methods to be called as below for required category
    await showExtraDetailLevel(page, 'levelOne');
    await showExtraDetailLevel(page, 'levelTwo');
    await showExtraDetailLevel(page, 'levelThree');
    */
    // async showExtraDetailLevel(page, levelText) {
    //     const locator = `xpath=//div[@aria-label='levelExtraDetails']//button[@data-testid='${levelText}']`;
    //     await clickElement(page, locator);
    // }

    // async clickHistoryTableIconsBeforeItemName(page, itemName, ariaLabel){
    //     const locator= `xpath=//td[@class='MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-1obezc4']//*[text()='${itemName}']//parent::td//preceding-sibling::td//button[@aria-label='${ariaLabel}']`;
    //     await clickElement(page, locator);
    // }

    // async clickHistoryTableIconsAfterItemName(page, itemName){
    //     const locator= `xpath=//td[@class='MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-1obezc4']//*[text()='${itemName}']//parent::td//following-sibling::td//button[@aria-label='${ariaLabel}']`;
    //     await clickElement(page, locator);
    // }

    
    async clickOnViewContactItemsMenu(){
        if(this.flag==true)
            {
                await clickElement(this.page, this.viewContactItemsMenu)
                this.flag=false;
            }   
    }

    async clickOnCloseContactItemMenu(){
        if(this.flag==false)
            {
                await clickElement(this.page, this.closeContactItemMenu)
                this.flag=true;
            }
    }

    async clickOnPinContactItemsMenu(){
        if(this.flag==false)
            {
                await clickElement(this.page, this.pinContactItemsMenu)
            }
    }

            // Choose Required Category from Dropdown
            async selectCategoryFromList(category) {
                await selectFromDropdown(this.page, this.allCategory, category);
            }
    
            async selectClinicalItem(item) {
                await selectFromSearchResults(this.page, this.allCategorySearchItem, item);  
            }

            async clickOnViewOrCloseContactItemsMenu(){
                if(this.flag){
                    await clickElement(this.page, this.viewMenu);   
                }
                else{
                    await clickElement(this.page, this.closeMenu);
                }
                this.flag = !this.flag;
            }
    
            async clickOnPinContactItemsMenu(){
                await clickElement(this.page, this.pinContactItemsMenu)
            }
             
            
            // async clickOnFavouritequestion()
            // {
            //     (item = null){
            //         if(item){
            //             this.itemName=item;
            //         }
            //         await clickHistoryTableIconsUsingItemName(this.page,this.itemName, 'reviewIconButton')
            //     }
            // }

            // async clickOnFavouritesCustView(locatorText=null)
            // {
            //     let locatorElement;
            //     try{
                   
            //         console.log("clicking on Favourites Customizable View")
            //         locatorElement = locatorText ?
            //         `xpath=//div[@id="favourite"]//button[@aria-label='${locatorText}']`:
            //         `xpath=//div[@id='favourite']//button[@aria-label='${this.itemName}']`;
                                  
            //         const cancelFavourites=await assertElementExists(this.page, locatorElement ,locatorText)
            //         return cancelFavourites;
            //     }
            //     catch (error) {
            //         console.error("Error occurred during checkItemOnHistoryTable:", error);
            //         throw error;
            //     }
            // }

    ////////////////////////////////// ASSERTION //////////////////////////////
    async checkItemOnHistoryTable(locatorText = null, review = null) {
        let locatorElement;
        try {
            console.log("Executing checkItemOnHistoryTable method...");
            
            // Construct the locator based on the review parameter
            if (review === null) {
                locatorElement = locatorText ?
                    `xpath=//div[@id='historyTable']//*[text()='${locatorText}']` :
                    `xpath=//div[@id='historyTable']//*[text()='${this.itemName}']` ;
                   
            } else {
                locatorElement = locatorText ?
                    `xpath=//div[@data-testid='CommonCellmaPopup']//*[text()='${locatorText}']//../..//button[@aria-label='reviewIconButton']` :
                    `xpath=//div[@data-testid='CommonCellmaPopup']//*[text()='${this.itemName}']//../..//button[@aria-label='reviewIconButton']`;
            }
            
            // Log the constructed locator
            console.log("Constructed Locator:", locatorElement);
    
            // Check if the element exists
            const elementExists = await assertElementExists(this.page, locatorElement, locatorText || this.itemName);
    
            console.log("checkItemOnHistoryTable method executed successfully.");
            return elementExists;
        } catch (error) {
            console.error("Error occurred during checkItemOnHistoryTable:", error);
            throw error;
        }
    }


    async checkItemOnMedicationCertificateHistoryTable(locatorText = null) {
        let locatorElement;
        try {
            console.log("Executing checkItemOnMedicationHistoryTable method...");
                     
                locatorElement = locatorText ?
                    `xpath=//table[@aria-label="medicalCertificateHistoryTable"]//*[text()='${locatorText}']` :
                    `xpath=//table[@aria-label="medicalCertificateHistoryTable"]//*[text()='${this.itemName}']` ;

                    // `xpath=//table[@aria-label="medicalCertificateHistoryTable"]//*[text()='${locatorText}']` :
                    // `xpath=//table[@aria-label="medicalCertificateHistoryTable"]//*[text()='${this.itemName}']` ;
                   
                      
            // Log the constructed locator
            console.log("Constructed Locator:", locatorElement);
    
            // Check if the element exists
            const elementExists = await assertElementExists(this.page, locatorElement, locatorText || this.itemName);
    
            console.log("checkItemOnMedicationHistoryTable method executed successfully.");
            return elementExists;
        } catch (error) {
            console.error("Error occurred during checkItemOnMedicationHistoryTable:", error);
            throw error;
        }
    }

    

}
module.exports = ClinicalSummary;
