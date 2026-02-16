class PatientDetailsAddED
{
   
    constructor(page)
    {
        this.page=page
        //expand Patient Details
        this.svgexpandPatientDetails=page.locator("xpath=//button[@aria-label='cellmaAccordionIcon']").nth(2)
        
        //Patient Details extra details
        this.dropdownSubCategory=page.locator("xpath=//input[@id='Sub Category']")   
        this.textareaNotes=page.locator("xpath=//textarea[@name='notes']")
        this.btnSave=page.locator("xpath=//button[@type='submit']").nth(0)
        this.textDate=page.locator("xpath=//input[@name='date']")
        

        //Checkboxes
        this.checkboxPrivateRecord=page.locator("xpath=//span[@data-testid='Private Record']")
       
        //Delete patient details
        this.btnDeletePatientDetails=page.locator("xpath=//div[contains(text(),'Delete')]")
        this.btnCancelDeletePatientDetails=page.locator("xpath=//button[@data-testid='Cancel']")
        this.btnOkDeletePatientDetails=page.locator("//button[@data-testid='Ok']")
        this.txtboxDeletePatientDetailsReason=page.locator("xpath=//textarea[@id='Reason']")
       // [use .nth(0).click for indexing]
        this.btnSaveDeleteReason=page.locator("xpath=//button[@data-testid='Save']")
        
        //PatientDetails ED page pop up icons
      
      this.iconUploadFile=page.locator("xpath=//button[@aria-label='Upload File']")
      this.iconClosePopupsecond=page.locator("xpath=//button[@aria-label='cancelIcon']").nth(1)
      this.iconAddedDocument=page.locator("xpath=//button[@aria-label='Added Documents']")
      this.iconAddtoTask=page.locator("xpath=//button[@aria-label='Add To Task']")
      this.iconAddtoWorklist=page.locator("xpath=//button[@aria-label='Add To Worklist']")
      this.iconAddPathway=page.locator("xpath=//button[@aria-label='Add Pathway']")
      this.iconLink=page.locator("xpath=//button[@aria-label='Link']")
      this.iconClosePopup=page.locator("xpath=//button[@aria-label='cancelIcon']")
    }
    async clickOnExpandPatientDetails()
    {
        await this.svgexpandPatientDetails.click()
    }d
    async selectSubCategory(eli_text)
    {
        await this.dropdownSubCategory.click()
        await this.page.getByRole('option', { name: eli_text }).click()
    }
    async EnterNotes(pad_notes)
    {
        await this.textareaNotes.fill('')
        await this.textareaNotes.type(pad_notes)
    }
    async EnterDate()
    {
        await this.textDate.fill('18/05/2024')
    }
    async selectCheckboxes()
    {
        //await this.checkboxShareDocumentOnPortal.click()
        await this.checkboxPrivateRecord.click()
        await this.checkboxPrivateRecord.click()
    }
    async clickOnSaveButton()
    {
        await this.btnSave.click()
    }
    async clickOnDeleteButton()
    {
        await this.btnDeletePatientDetails.click()
    }
    async clickOnCancelPatientDetails()
    {
        await this.btnCancelDeletePatientDetails.click()
    }
    async clickOnOkDeletePatientDetails()
    {
        await this.btnOkDeletePatientDetails.click()
    }
    async enterDeletePatientDetailsReason(pacr_delete_reason)
    {
        await this.txtboxDeletePatientDetailsReason.fill(pacr_delete_reason)
    }
    async clickOnSaveForReason()
    {
        await this.btnSaveDeleteReason.click()
    }
    async edPopUp()
    {
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



}
module.exports=PatientDetailsAddED