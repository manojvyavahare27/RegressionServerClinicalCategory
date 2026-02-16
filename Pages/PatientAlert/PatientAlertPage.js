class PatientAlertPage
{
    constructor(page)
    {
        this.page=page;
        this.sidebarDrawer=this.page.locator("xpath=//div[@data-testid='serviceAlertCommunicationDrawerHeader']")
        this.linkslink=this.page.locator("xpath=//button[@data-testid='Links']//span[@class='MuiButton-icon MuiButton-endIcon MuiButton-iconSizeSmall mui-qpmepm']")
        //Links
        this.myTask=this.page.locator("xpath=//h1[text()='My Tasks']")
        this.serviceAppReminder=page.locator("xpath=//ul[@class='MuiList-root MuiList-padding MuiMenu-list mui-ubifyk']//h1[text()='Service Appointment Reminders']")
        this.cancelButton=this.page.locator('button[aria-label="cancelIcon"]');    
        this.dropdownAlertDaysSelected= this.page.locator("xpath=//input[@id='alertsDaysSelected']")
    }

    async clickOnSidebarDrawer()
    {
        await this.sidebarDrawer.click()
    }
    async clickOnLinksLink()
    {
        await this.linkslink.click()
    }

    async clickOnMyTaskLink()
    {
        await this.myTask.click()
    }
    async clickOnServiceAppReminder()
    {
        await this.serviceAppReminder.click()
    }
    async clickOnCancelButton()
    {
        await this.cancelButton.click()
    }
    
}


module.exports=PatientAlertPage;