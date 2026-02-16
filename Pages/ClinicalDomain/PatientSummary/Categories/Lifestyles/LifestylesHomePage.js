class LifestylesHomePage
{
    // Saurabh Dayal
    constructor(page)
    {
        this.page=page
       this.contactLocation=page.locator("xpath=//input[@id='contactLocation']")
       this.dropdownContactLocation=page.locator("xpath=//li[@id='contactLocation-option-0']")
       this.buttonAddContact=page.locator("xpath=//div[contains(text(),'Add Contact')]") 
       //Search and Add lifestyle on Lifestyle home page
       this.txtboxSearchLifestyle=page.locator("xpath=//input[@name='search']")
        //expand sections
       this.svgexpandSearch=page.locator("xpath=//div[contains(text(),'Search')]")
       this.svgexapndFavourites=page.locator("xpath=//div[contains(text(),'Favourites')]")
       this.svgexpandLifestylesHostory=page.locator("xpath=//div[contains(text(),'Lifestyle History')]")
        
       //Select history section
       //this.linkAll=page.locator("xpath=//button[normalize-space()='All Lifestyle']")
       this.linkMigrated=page.locator("xpath=//button[normalize-space()='Migrated']")
       this.linkDeleted=page.locator("xpath=//button[normalize-space()='Deleted']")
       this.linkArchived=page.locator("xpath=//button[normalize-space()='Archived']")
       this.linkAll=page.locator("xpath=//button[normalize-space()='All']")
       
       //Review Records[use .nth(0).click for indexing]
        this.reviewRecord= page.locator("xpath=//button[@aria-label='reviewIconButton']")

      //Highlighted Risk[use .nth(0).click for indexing]
      this.buttonhighlightNone=page.locator("xpath=//img[@alt='Highlight None']")

      this.dropdownRiskLevel=page.locator("xpath=//input[@name='riskLevel']")
     
      //Level Of Extra Details
      this.buttonLevelOfExtraDetailsTwo=page.locator("xpath=//button[@data-testid='levelTwo']")
      this.buttonLevelOfExtraDetailsOne=page.locator("xpath=//button[@data-testid='levelOne']")

      //Add Lifestyle
      this.buttonAddLifestyle=page.locator("xpath=//button[@data-testid='Add']")

      //Edit Lifestyle[use .nth(0).click for indexing]
      this.iconEditLifestyle=page.locator("xpath=//button[@aria-label='editIconButton']")
      
      //History Icon
      this.svgbuttonHistoryIcon=page.locator("xpath=//img[@alt='Category History']")
      
      //expand History Record
      this.svgbuttonHistoryofLifestyleIcon=page.locator("xpath=//button[@aria-label='expandRowIconundefined']")
      
      //close History pop up
      this.buttonClosePopup=page.locator("xpath=//button[@aria-label='cancelIcon']")

      //Lifestyle page overview icons
      this.iconOverview=page.locator("xpath=//button[@aria-label='overviewIconButton']")
      this.iconUploadFile=page.locator("xpath=//button[@aria-label='Upload File']")
      this.iconClosePopupsecond=page.locator("xpath=//button[@aria-label='cancelIcon']").nth(1)
      this.iconAddedDocument=page.locator("xpath=//button[@aria-label='Added Documents']")
      this.iconAddtoTask=page.locator("xpath=//button[@aria-label='Add To Task']")
      this.iconAddtoWorklist=page.locator("xpath=//button[@aria-label='Add To Worklist']")
      this.iconAddPathway=page.locator("xpath=//button[@aria-label='Add Pathway']")
      this.iconLink=page.locator("xpath=//button[@aria-label='Link']")
      this.iconClosePopup=page.locator("xpath=//button[@aria-label='cancelIcon']").nth(0)

      //Lifestyle page other icons
      this.iconWorklist=page.locator("xpath=//button[@aria-label='worklistIconButton']")
      this.iconTask=page.locator("xpath=//button[@aria-label='taskIconButton']")
      this.iconAlert=page.locator("xpath=//button[@aria-label='alertIconButton']").nth(0)
      this.iconAddToPathway=page.locator("xpath=//button[@aria-label='alertIconButton']").nth(0)

      //Expand added categories on right side
      this.iconExpandCategoris=page.locator("xpath=//button[@aria-label='Menu Button']")

      //log out
      this.btnCellmaHome=page.locator("xpath=//button[@aria-label='cellmaImageAvatar']")
      this.dropdownMenu=page.locator("xpath=//button[@aria-label='Menu']")
      this.liLogout=page.locator("xpath=//li[@data-testid='menuDropDownLogout']")
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
    
    async addContact()
    {
      await this.contactLocation.click()
      await this.dropdownContactLocation.click()      
    }
    async clickOnAddContact()
    {
      await this.buttonAddContact.click()
    }
    //expand sections
    async expandAllSections()
    {
      await this.svgexpandSearch.click()
      await this.svgexapndFavourites.click()
      await this.svgexpandLifestylesHostory.click()

    }
    async expandLifestylesHistory()
    {
      await this.svgbuttonHistoryIcon.click()
      await this.svgbuttonHistoryofLifestyleIcon.nth(1).click()
      await this.buttonClosePopup.click()

    }
    async clickonAddLifestyleButton()
    {
      await this.buttonAddLifestyle.click()
    }
    async clickonEditLifestyleIcon()
    {
      await this.iconEditLifestyle.click()
    }
    async searchLifestyle(pacr_que_name)
    {
      await this.txtboxSearchLifestyle.click()
      await this.txtboxSearchLifestyle.type(pacr_que_name)

      await this.page.getByRole('option', { name: pacr_que_name }).click()
      //

    }
    async clickOnHistoryIcon()
    {
      await this.svgbuttonHistoryIcon.click()
    }
    async expandsHistoryofLifestyleIcon()
    {
      await this.svgbuttonHistoryofLifestyleIcon.click()
    }
    async closeLifestyleHistoryPopup()
    {
      await this.buttonClosePopup.click()
    }
    async clickOnReviewLifestyleButton()
    {
      await this.reviewRecord.click()
    }
    async clickOnHighlightedNoneRisk()
    {
      await this.buttonhighlightNone.click()
    }
    async clickOnLowRiskLevel()
    {
      await this.this.dropdownRiskLevel.click()
      await this.page.getByRole('option', { name: 'Low Risk' }).click()
    }
    async clickOnModerateRiskLevel()
    {
        await this.dropdownRiskLevel.click()
        await this.page.getByRole('option', { name: 'Moderate Risk' }).click()
    }
    async clickOnHighRiskLevel()
    {
        await this.dropdownRiskLevel.click()
        await this.page.getByRole('option', { name: 'High Risk' }).click()
    }
    async clickOnAllLinks()
    {
       // await this.linkMigrated.click()
        await this.linkMigrated.click()
        await this.linkDeleted.click()       
        await this.linkArchived.click()
        await this.linkAll.click()
    }
    async clickOnHighRiskLevel()
    {
        await this.dropdownRiskLevel.click()
        await this.page.getByRole('option', { name: 'All' }).click()
    }
    async checkExtradetailsLevel()
    {
      await this.buttonLevelOfExtraDetailsTwo.click()
      await this.buttonLevelOfExtraDetailsOne.click()
    }
    async logoutCellma()
    {
      await this.btnCellmaHome.click()
      await this.dropdownMenu.click()
      await this.liLogout.click()
    }
  }
module.exports=LifestylesHomePage