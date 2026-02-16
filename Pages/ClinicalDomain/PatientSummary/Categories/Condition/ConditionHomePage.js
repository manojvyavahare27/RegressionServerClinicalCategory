class ConditionHomePage{

    constructor(page)
    {
        this.page=page;

        //Add contact
        this.dropdownContactLocation = page.locator('#contactLocation')
        this.btnAddContact = page.locator("xpath=//button[@data-testid='Add Contact']")

         //Click on condition catagory
         this.iconConditionCatagory = page.locator("xpath=//img[@alt='Conditions Image Avatar']");
        //All Locators
        //search and add condition from condition home page
         //this.txtboxSearchCondition = page.locator("xpath=//input[@name='search']");
        // this.searchClinicalItem = page.locator("xpath=//label[text()='Any Search, Item, Code, Category']");
        this.searchClinicalItem=page.locator("xpath=//input[@name='search']")
         this.btnAddCondition = page.locator("xpath=//button[@type='submit']")


         //Expands icon for Search, Favourite and Condition History
        this.btnExpandCollapseSearchSection=page.getByTestId('search').getByLabel('cellmaAccordionIcon')
        this.btnExpandCollapseFavourites=page.getByTestId('favourites').getByLabel('cellmaAccordionIcon')
        this.btnExpandCollapseConditionHistory=page.getByTestId('categoryHistoryAccordion').getByLabel('cellmaAccordionIcon')
        
        //Edit Conditon
        this.expandConditionRecord = page.locator("xpath=//button[@aria-label='expandRowIconundefined']")
        this.btnEditCondition = page.locator("xpath=//button[@aria-label='editIconButton']");
        this.btnexpands=page.locator("xpath=//div[@class='MuiGrid-root MuiGrid-container css-1bsa7z6']//button[@aria-label='cellmaAccordionIcon']//*[name()='svg']//*[name()='path' and contains(@d,'M15.08 9.5')]")
        this.txtareaNotes = page.locator("xpath=//textarea[@name='notes']");

        //Condition History and history links to find records
        this.btnConditionHistory = page.locator("xpath=//button[@aria-label='patientHistoryIconButton']");
        this.btnExpandHistoryRecordOnPopUp = page.locator("xpath=//button[@aria-label='expandRowIconundefined']");
        
        this.linkCurrent = page.getByLabel('Current')
        this.linkPrevious = page.getByLabel('Previous')
        this.linkMigrated = page.getByLabel('Migrated')
        this.linkDeleted = page.getByLabel('Deleted')
        this.linkArchived = page.getByLabel('Archived')

        //Condition Risk - Highlight
        this.iconHighlightLowRisk = page.locator("xpath=//button[@aria-label='highlightNone']")
        this.iconHighlightModerateRisk = page.locator("xpath=//button[@aria-label='highlightModerate']")
        //locator('//button[@aria-label=\'highlightModerate\']')
        this.iconHighlightHighRisk = page.locator("xpath=//button[@aria-label='highlightHigh']")

        // Review Condition
        this.iconReviewCondition = page.locator("xpath=//button[@aria-label='reviewIconButton']")

        // Filter Condition records by service, priroity
        this.filtConditionByService = page.locator("xpath=//input[@id='showConditionsByService']")
        //General Medicine Automation
        this.filtRiskLevel = page.locator("xpath=//input[@id='riskLevel']");
        

        //close pop up
        this.btnClosePopup=page.locator("xpath=//button[@aria-label='cancelIcon'][1]")

        //
        this.btnAddCondition=page.locator("xpath=//button[@aria-label='Add']")

        //Delete Medication
        this.btnDeleteCondition=page.locator("xpath=//button[@aria-label='Delete']")
        this.btnOkToDeleteCondition=page.locator("//button[@aria-label='Ok']")
        this.txtareaDeleteReason=page.locator("//textarea[@aria-label='Reason']")
        this.btnSaveDeleteCondition=page.locator("xpath=//div[@class='MuiGrid-root MuiGrid-container MuiGrid-item MuiGrid-grid-xs-12 css-6td7do']//button[@data-testid='Save']");

        //Check Conditions History Links
        this.linkCurrentCondition=page.locator("xpath=//button[@data-testid='current']")
        this.linkPreviousCondition=page.locator("xpath=//button[@data-testid='surgical']")

        //user logout
        this.iconCellmaHomePage=page.locator("xpath=//img[@alt='Cellma Image Avatar']")
        this.iconMenu=page.locator("xpath=//button[@aria-label='Menu']")
        this.linkLogout=page.locator("//li[@data-testid='menuDropDownLogout']")

    }

    async selectContactLocation()
    {
        await this.dropdownContactLocation.click();
        await this.page.getByRole('option', { name: 'Cardio Location' }).click()

    }    

    async addContact()
    {
        await this.btnAddContact.click();
    }

    async clickOnConditionCatagory()
    {
        await this.iconConditionCatagory.click();
    }
    async isConditionAlreadyAddedToPatient(pacr_que_name)
    {
        const condition = this.page.getByLabel(pacr_que_name);
        if(condition == true)
            {
                //return true;
        await this.btnEditCondition.click()
        await this.btnDeleteCondition.click();
        await this.btnOkToDeleteCondition.click();
        await this.txtareaDeleteReason.fill("Not Required")
        await this.btnSaveDeleteCondition.click();
       logger.info("Item was deleted successfully");
            }
            else
            {
                return false;
            }

    }

    async searchCategory(pacr_que_name)
    {
        await this.searchClinicalItem.click()
        await this.searchClinicalItem.fill(pacr_que_name)
        await this.page.getByRole('option', { name: pacr_que_name }).click()
        
    }

    async addCondition()
    {
        await this.btnAddCondition.click();
    
    }

    async expandSearchSection()
    {
        await this.btnExpandCollapseSearchSection.dblClick();
        
    }

    async expandFavouritesSection()
    {
        await this.btnExpandCollapseFavourites.dblClick();
        await this.btnExpandCollapseConditionHistory.dblClick();

    }

    async expandConditionHistorysSection()
    {
        await this.btnExpandCollapseConditionHistory.dblClick();

    }

    async editCondition()
    {   
       
        await this.btnEditCondition.click();
    }

    async editExistingCondition(pacr_que_name)
    {   
       
        await this.btnEditCondition.click();
    }

    async addNotes(cond_notes)
    {
        await this.btnexpands.click();
        await this.txtareaNotes.fill(cond_notes);
    }

   
    async clickOnHistoryIcon()
    {
        await this.btnConditionHistory.click();
    }

    async expandHistoryRecord()
    {
        await this.btnExpandHistoryRecordOnPopUp.nth(0).click();
    }

    async closeHistoryPopup()
    {
        await this.btnClosePopup.click();
    }


    async conditionRiskLow()
    {
        await this.iconHighlightLowRisk.click();

    }

    async conditionRiskModerate()
    {
        await this.iconHighlightModerateRisk.click();
    }

    async conditionRiskHigh()
    {
        await this.iconHighlightHighRisk.click();
    }

    //If already review condition need to add

    async reviewCondition()
    {
        await this.iconReviewCondition.click();
    }

    async filterConditionRecords()
    {
        await this.filtConditionByService.click();
        await this.page.getByRole('option', { name: 'General Medicine Automation' }).click()
        //await this.page.filtRiskLevel.selectOption({value: 'All'})
       // await this.filtRiskLevel.getByRole('option', { name: 'All' }).click()

    }

    async deleteCondition()
    {
        await this.btnDeleteCondition.click();

    }
    async confirmToDeleteCondition()
    {
        
        await this.btnOkToDeleteCondition.click();

    }

    async addReasonToDeleteCondition()
    {
        await this.txtareaDeleteReason.fill("Delete Condition");

    }

    async clickSaveToDeleteCondition()
    {
        
        await this.btnSaveDeleteCondition.click();

    }

    async linkToCurrentCondition()
    {
        await this.linkCurrentCondition.click();
    }

    async linkToPreviousCondition()
    {
        await this.linkPreviousCondition.click();
    }

    //Logout-temp adding here as not aware of logout page
    
    async userLogout()
    {
       await this.iconCellmaHomePage.click();
       await this.iconMenu.click();
       await this.linkLogout.click();
    }











}
module.exports=ConditionHomePage