class PatientDetailsHomePage
{
    // Saurabh Dayal
    constructor(page)
    {
        this.page=page
       this.contactLocation=page.locator("xpath=//input[@id='contactLocation']")
       this.dropdownContactLocation=page.locator("xpath=//li[@id='contactLocation-option-0']")
       this.buttonAddContact=page.locator("xpath=//div[contains(text(),'Add Contact')]") 
      //Search and Add patient details on patient details home page
      this.txtboxSearchPatientDetails=page.locator("xpath=//input[@name='search']")
      //Add Patient Details
      this.buttonAddPatientDetails=page.locator("xpath=//button[@data-testid='Add']")
      //expand sections
      this.svgexpandSearch=page.locator("xpath=//div[contains(text(),'Search')]")
      this.svgexpandPatientDetailsHostory=page.locator("xpath=//div[contains(text(),'Patients Details History')]")
       //Select history section
       this.linkMigrated=page.locator("xpath=//button[normalize-space()='Migrated']")
       this.linkDeleted=page.locator("xpath=//button[normalize-space()='Deleted']")
       this.linkArchived=page.locator("xpath=//button[normalize-space()='Archived']")
       this.linkAll=page.locator("xpath=//button[normalize-space()='All']")

       //History table filters
       this.txtClinicDate=page.locator("xpath=//input[@id='clinicDate']")
       this.dropdownRiskLevel=page.locator("xpath=//input[@id='riskLevel']")
       this.liRiskLevelAll=page.locator("xpath=//li[@id='riskLevel-option-0']")
       this.liRiskLevelLow=page.locator("xpath=//li[@id='riskLevel-option-1']")
       this.liRiskLevelModerate=page.locator("xpath=//li[@id='riskLevel-option-2']")
       this.liRiskLevelHigh=page.locator("xpath=//li[@id='riskLevel-option-3']")

        //Level Of Extra Details
      this.buttonLevelOfExtraDetailsTwo=page.locator("xpath=//button[@data-testid='levelTwo']")
      this.buttonLevelOfExtraDetailsOne=page.locator("xpath=//button[@data-testid='levelOne']")
      //History table
      this.expandHistoryTable=page.locator("xpath=//button[@aria-label='expandRowIconundefined']").nth(0)
       //History Icon
       this.svgbuttonHistoryIcon=page.locator("xpath=//img[@alt='Category History']")
       //Highlight Icon
       this.buttonhighlightNone=page.locator("xpath=//img[@alt='Highlight None']")
       this.buttonhighlightModerate=page.locator("xpath=//img[@alt='Highlight Moderate']")
       this.buttonhighlightHigh=page.locator("xpath=//img[@alt='Highlight High']")

       //history pop up
       //expand History Record
      this.svgbuttonHistoryofPatientDetailsIcon=page.locator("xpath=//button[@aria-label='expandRowIconundefined']").nth(1)
      //close History pop up
      this.buttonClosePopup=page.locator("xpath=//button[@aria-label='cancelIcon']")
       
      //Records review
      this.buttonReviewRecord=page.locator("xpath=//button[@aria-label='reviewIconButton']").nth(0)


       //Edit PatientDetails[use .nth(0).click for indexing]
      this.iconEditPatientDetails=page.locator("xpath=//button[@aria-label='editIconButton']")

      //Patient Details page overview icons
      this.iconOverview=page.locator("xpath=//button[@aria-label='overviewIconButton']")
      this.iconUploadFile=page.locator("xpath=//button[@aria-label='Upload File']")
      this.iconClosePopupsecond=page.locator("xpath=//button[@aria-label='cancelIcon']").nth(1)
      this.iconAddedDocument=page.locator("xpath=//button[@aria-label='Added Documents']")
      this.iconAddtoTask=page.locator("xpath=//button[@aria-label='Add To Task']")
      this.iconAddtoWorklist=page.locator("xpath=//button[@aria-label='Add To Worklist']")
      this.iconAddPathway=page.locator("xpath=//button[@aria-label='Add Pathway']")
      this.iconLink=page.locator("xpath=//button[@aria-label='Link']")
      this.iconClosePopup=page.locator("xpath=//button[@aria-label='cancelIcon']").nth(0)
      
      //Patient Details page other icons
      this.iconWorklist=page.locator("xpath=//button[@aria-label='worklistIconButton']")
      this.iconTask=page.locator("xpath=//button[@aria-label='taskIconButton']")
      this.iconAlert=page.locator("xpath=//button[@aria-label='alertIconButton']").nth(0)
      this.iconAddToPathway=page.locator("xpath=//button[@aria-label='alertIconButton']").nth(0)

      //Expand added categories on right side
      this.iconExpandCategoris=page.locator("xpath=//button[@aria-label='Menu Button']")

      //log out
      this.btnCellmaHome=page.locator("xpath=//button[@aria-label='cellmaImageAvatar']")
      this.dropdownMenu=page.locator("xpath=//button[@aria-label='Menu']")
      this.profileButton=page.locator("xpath=//button[@aria-label='profileIcon']")
      this.cellmaLogout=page.locator("xpath=//button[@data-testid='logout']")

      //close contact
      this.btnCloseContactYes=page.locator("xpath=//button[@aria-label='Yes']")
      this.btnCloseContactNo=page.locator("xpath=//button[@aria-label='No']")


    }
    async addContact()
    {
      await this.contactLocation.click()
      await this.dropdownContactLocation.click()      
    }
    async clickOnAddContact()
    {
      await this.buttonAddContact.click()
    }
    async searchPatientDetails(pacr_que_name)
    {
      await this.txtboxSearchPatientDetails.click()
      await this.txtboxSearchPatientDetails.type(pacr_que_name)
      await this.page.getByRole('option', { name: pacr_que_name }).click()
    }
    async clickonAddPatientDetailsButton()
    {
      await this.buttonAddPatientDetails.click()
    }

    async expandAllSections()
    {
      await this.svgexpandSearch.click()
      await this.svgexpandPatientDetailsHostory.click()
    }
    async expandLevels()
    {
      await this.buttonLevelOfExtraDetailsTwo.click()
      await this.buttonLevelOfExtraDetailsOne.click()
    }
    async reviewRecords()
    {
      await this.buttonReviewRecord.click()
    }
    /*********************** */
    async recordHistory()
    {
       //History Icon
       await this.svgbuttonHistoryIcon.click();
       await this.page.locator("xpath=//tbody/tr[1]/td[1]/button[1]//*[name()='svg']").click();
       await this.iconClosePopup.click();

    }
    async riskFilters1()
    {
      await this.dropdownRiskLevel.click()
      await this.liRiskLevelLow.click()
      await this.buttonhighlightNone.click()
    }
    async riskFilters2()
    {
      await this.dropdownRiskLevel.click()
      await this.liRiskLevelModerate.click()
      await this.buttonhighlightModerate.click()
    }
    async riskFilters3()
    {
      await this.dropdownRiskLevel.click()
      await this.liRiskLevelHigh.click()
      await this.buttonhighlightHigh.click()
    }
    async riskFilters4()
    {
      
      await this.dropdownRiskLevel.click()
      await this.liRiskLevelLow.click()
      await this.dropdownRiskLevel.click()
      await this.liRiskLevelAll.click()
      
    }
    async clickOnAllLinks()
    {
        await this.linkMigrated.click()
        await this.linkDeleted.click()       
        await this.linkArchived.click()
        await this.linkAll.click()
    }
    async clickonEditPatientDetailsIcon()
    {
      await this.iconEditPatientDetails.click()
    }
    async clickOnHistoryIcon()
    {
      await this.svgbuttonHistoryIcon.click()
      await this.buttonClosePopup.click()
    }
    async homepageOverviewIcon()
    {
      await this.iconOverview.click()
      await this.iconUploadFile.click()
      await this.iconClosePopupsecond.click()
      await this.iconAddedDocument.click()
      await this.iconClosePopupsecond.click()
      await this.iconAddtoTask.click()
      await this.iconClosePopupsecond.click()
      await this.iconAddtoWorklist.click()
      await this.iconClosePopupsecond.click()
      await this.iconAddPathway.click()
      await this.iconClosePopupsecond.click()
      await this.iconLink.click()
      await this.iconClosePopupsecond.click()
      await this.iconClosePopup.click()
    }
    async homepageIcons()
    {
      await this.iconWorklist.click()
      await this.iconClosePopup.click()
      await this.iconTask.click()
      await this.iconClosePopup.click()
      await this.iconAlert.click()
      await this.iconClosePopup.click()
      await this.iconAddToPathway.click()
      await this.iconClosePopup.click()
    }
    async logoutCellma()
    {
      //await this.btnCellmaHome.click()
      //await this.iconClosePopup.click()
      //await this.btnCloseContactYes.click()
      //await this.dropdownMenu.click()
      await this.profileButton.click()
      await this.page.getByText('Logout').click();
      //await this.cellmaLogout.click()
    }


}
module.exports=PatientDetailsHomePage