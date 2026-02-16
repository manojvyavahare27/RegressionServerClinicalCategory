class LifestyleAddED
{
   
    constructor(page)
    {
        this.page=page
        //expand lifestyle
        this.svgexpandLifestyle=page.locator("xpath=//button[@class='MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-14x3gsq']//*[name()='svg']")
        
        //lifestyle extra details
        this.dropdownSubCategory=page.locator("xpath=//input[@id='Sub Category']")   
        this.textareaNotes=page.locator("//textarea[@id='Notes']")
        this.btnSave=page.locator("xpath=//button[@type='submit']").nth(0)

        this.btnDeleteLifestyle=page.locator("xpath=//div[contains(text(),'Delete')]")
        this.btnCancelDeleteLifestyle=page.locator("xpath=//button[@aria-label='Cancel']")
        this.btnOkDeleteLifestyle=page.locator("//button[@data-testid='Ok']")
        this.txtboxDeleteLifestyleReason=page.locator("xpath=//textarea[@id='Reason']")
       // [use .nth(0).click for indexing]
        this.btnSaveDeleteReason=page.locator("xpath=//button[@data-testid='Save']").nth(1)


        //Checkboxes
        this.checkboxPrivateRecord=page.locator("xpath=//span[@data-testid='Private Record']")
        this.checkboxSetasDefault=page.locator("xpath=//span[@data-testid='Set As Default']")
        this.checkboxAddtoFavourites=page.locator("xpath=//span[@data-testid='Add To Favourites']")
        this.closeFavouritesPopup=page.locator("xpath=//button[@aria-label='cancelIcon']").nth(1);
        this.checkboxAddToOrderSet=page.locator("xpath=//span[@data-testid='Add To Order Set']")
        this.closeOrdersetPopup=page.locator("xpath=//button[@aria-label='cancelIcon']").nth(1);

        //customizable view
        this.iconSettings=page.locator("xpath=//button[@data-testid='settingButton']")
        this.linkCustomizableView=page.locator("xpaty=//li[@data-testid='customizableView']")
        this.btnResetToDefaultView=page.locator("xpath=//div[contains(text(),'Reset to Default View')]")
        this.btnSaveCustomizableView=page.locator("xpath=//button[@data-testid='Save']")
        this.btnSaveAsCustomizableView=page.locator("xpath=//div[contains(text(),'Save As')]")
        this.linkCustomizableView=page.locator("xpath=//li[@data-testid='defaultView']")
        this.cancelButtonCustomizable=page.locator("xpath=//button[@aria-label='cancelIcon']")
    
    
    }
    async selectCheckboxes()
    {
        //await this.checkboxShareDocumentOnPortal.click()
        await this.checkboxPrivateRecord.click()
        await this.checkboxPrivateRecord.click()
        await this.checkboxSetasDefault.click()
        await this.checkboxSetasDefault.click()
        await this.checkboxAddtoFavourites.click()
        await this.closeFavouritesPopup.click()
        await this.checkboxAddToOrderSet.click()
        await this.closeOrdersetPopup.click()
    }
    async clickOnExpandLifestyle()
    {
        await this.svgexpandLifestyle.click()
    }
    async selectSubCategory(eli_text)
    {
        await this.dropdownSubCategory.click()
        await this.page.getByRole('option', { name: eli_text }).click()
       // await this.page.getByRole('option', { name: pacr_category }).click()
       //await this.page.locator("xpath=//li[@id='Sub Category-option-0']").click()
    }
    async EnterNotes(life_notes)
    {
        await this.textareaNotes.fill(life_notes)
    }
    async clickOnSaveButton()
    {
        await this.btnSave.click()
    }
    async clickOnDeleteButton()
    {
        await this.btnDeleteLifestyle.click()
    }
    async clickOnCancelLifestyle()
    {
        await this.btnCancelDeleteLifestyle.click()
    }
    async clickOnOkDeleteLifestyle()
    {
        await this.btnOkDeleteLifestyle.click()
    }
    async enterDeleteLifestyleReason(pacr_delete_reason)
    {
        await this.txtboxDeleteLifestyleReason.fill(pacr_delete_reason)
    }
    async clickOnSaveForReason()
    {
        await this.btnSaveDeleteReason.click()
    }

}
module.exports=LifestyleAddED