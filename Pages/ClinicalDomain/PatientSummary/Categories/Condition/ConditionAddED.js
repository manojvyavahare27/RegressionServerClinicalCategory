class ConditionAddED
{
    constructor(page)
    {
        this.page=page;
        //All locators

         //Expand extra details
         this.btnexpands=page.locator("xpath=//div[@class='MuiGrid-root MuiGrid-container css-1bsa7z6']//button[@aria-label='cellmaAccordionIcon']//*[name()='svg']//*[name()='path' and contains(@d,'M15.08 9.5')]")
        
         //Add Extra Details pop up locators

         this.dropdownSubCatagory = page.locator("xpath=//input[@id='Sub Category']");
         this.calendarDateOfDiagnosis = page.locator("//input[@id='Date Of Diagnosis']");
         this.dropdownPreviousRF = page.locator("xpath=//input[@name='previousCondition']");
         this.txtareaNotes = page.locator("xpath=//textarea[@name='notes']");
         this.btnSave = page.locator("xpath=//button[@data-testid='Save']");



         //Checkboxes
         this.checkboxPrivateRecord = page.locator("xpath=//span[@data-testid='Private Record']");
         this.checkboxSetAsDefault = page.locator("xpath=//span[@data-testid='Set as Default']");
         this.checkboxAddToFavourites = page.locator("xpath=//span[@data-testid='Add to Favourites']");
         this.checkboxAddToOrderSet = page.locator("xpath=//span[@data-testid='Add to Order Set']");

         //Add To Favourite
         this.dropdownLinkToFavourites = page.locator("xpath=//input[@id='linkToExistingFavourites']");
         this.btnAddNewFavourites = page.locator("//div[@class='MuiGrid-root MuiGrid-container MuiGrid-item MuiGrid-grid-xs-6 css-1dic65j']//button[@type='button']")
         this.btnSaveFavourites = page.locator("//div[@class='MuiGrid-root MuiGrid-container MuiGrid-item MuiGrid-grid-xs-12 css-2rb3u3']//div[@class='MuiGrid-root MuiGrid-item css-1wxaqej'][normalize-space()='Save']")

         //Add To Order Set
         this.btnAddNewOrderSet = page.locator("xpath=//button[@data-testid='Add New Order Set']");
         this.dropdownSpeciality = page.locator("xpath=//input[@id='specialty']");
         this.searchOrderSetName = page.locator("xpath=//input[@id=':r21m:']")
         this.searchOtherItems = page.locator("xpath=//input[@name='otherItems']")



          //Setting Button
       this.btnSetting=page.locator("xpath=//button[@class='MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-d5btle']//*[name()='svg']//*[name()='path' and contains(@d,'M19.43 12.')]")
       this.linkCustomisableView=page.locator("xpath=//li[@data-testid='customizableView']")
       this.linkdefaultView=page.locator("xpath=//li[@data-testid='defaultView']")


         //Top icons on Pop up
        this.iconAddDiagnosis=page.locator("xpath=//img[@alt='addDiagnosis']")
        this.iconStandardDosing=page.locator("xpath=//img[@alt='standardDosing']")
        this.iconUploadFile=page.locator("xpath=//img[@alt='uploadFile']")
        this.iconFolder=page.locator("xpath=//img[@alt='folder']")
        this.iconAddTask=page.locator("xpath=//img[@alt='addTask']")
        this.iconAddToWorkList=page.locator("xpath=//img[@alt='addToWorklist']")
        this.iconAddPathway=page.locator("xpath=//img[@alt='AddPathway']")
        this.iconAddLink=page.locator("xpath=//img[@alt='LinkAdd']")
        this.buttonClosePopup=page.locator("xpath=//button[@aria-label='cancelIcon'][1]")
        this.buttonCloseChildPopup=page.getByRole('button', { name: 'cancelIcon' })
        
        


        //button[@aria-label='cancelIcon']
    }

    async expandConditionSection()
    {
        await this.btnexpands.click();
    }

    async selectSubCatagory(eli_text)
    {
        await this.dropdownSubCatagory.click();
        await this.page.getByRole('option',{name : eli_text}).click();
    }

    async selectDateOfDiagnosis(cond_date_diagnosed)
    {
        await this.calendarDateOfDiagnosis.fill(cond_date_diagnosed);
    }

    async selectPreviousCondition()
    {
        await this.dropdownPreviousRF.click();
        await this.page.getByRole('option',{value : 'yes' }).click();
    }

    async selectPrivateRecord()
    {
        await this.checkboxPrivateRecord.click();
    }

    async selectSetAsDefault()
    {
        await this.checkboxSetAsDefault.click();
    }

    async addToFavourites()
    {
        await this.checkboxAddToFavourites.click();
        await this.btnAddNewFavourites.click();
        await this.btnSaveFavourites.click();
        await this.buttonClosePopup.click();

    }

    async addToOrderSet()
    {
        await this.checkboxAddToOrderSet.click();
        await this.dropdownSpeciality.select-Option('Speciality');
        await this.page.searchOrderSetName.fill('Erythematous condition').select();
        //await this.searchOrderSetName.fill('con').click();
        await this.btnSave.click();
        await this.buttonClosePopup.click();

    }

    async addNotes(cond_notes)
    {
        await this.txtareaNotes.fill(cond_notes);
    }

    async handleTopBarIcons()
    { 

        await this.iconUploadFile.click();
        await this.buttonCloseChildPopup.click();

        await this.iconFolder.click();
        await this.buttonCloseChildPopup.click();

        await this.iconAddTask.click();
        await this.buttonCloseChildPopup.click();

        await this.iconAddToWorkList.click();
        await this.buttonCloseChildPopup.click();

        await this.iconAddPathway.click();
        await this.buttonCloseChildPopup.click();

        await this.iconAddLink.click();
        await this.buttonCloseChildPopup.click();


    }

    async saveCondition()
    {
        await this.btnSave.click();
    }


}
module.exports=ConditionAddED