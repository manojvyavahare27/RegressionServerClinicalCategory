class HPDiary{
    constructor(page)
    {
        this.page=page
        this.btnBackBtn=page.getByLabel('Back Button')
        this.btnClinicDiary=page.getByTestId('Clinic Diary')
        this.btnHPDiary=page.getByTestId('HP Diary')
        this.btnByDaywise=page.getByTestId('day')
        this.btnByWeekwise=page.getByTestId('week')
        this.btnByMonthwise=page.getByTestId('month')
        
        //this.DateForLeave=page.locator('div:nth-child(19) > .MuiBox-root > div:nth-child(2) > div:nth-child(5) > a:nth-child(2)')
        this.DateForLeave=page.getByRole('button', { name: 'Working Hrs : 9 Start Time : 01:20 End Time : 10:20' }).nth(2)
       // getByRole('button', { name: 'Working Hrs : 9 Start Time : 01:20 End Time : 10:20' }).nth(2)
        this.dropdownLeaveType=page.getByRole('button', { name: 'Open' })
        this.checkboxDays=page.getByLabel('Day(s)')
        this.dayleavesStartDate=page.getByTestId('Start Date').getByPlaceholder('dd/mm/yyyy')
        this.dayleavesEndDate=page.getByTestId('End Date').getByPlaceholder('dd/mm/yyyy')
        this.btnSaveLeave=page.getByTestId('Save')

    }
    async clickOnBackButton()
    {
        await this.btnBackBtn.click()
    }
    async clickOnSaveLeaveButton()
    {
        await this.btnSaveLeave.click()
    }
    async enterLeavesStartDate()
    {
        await this.dayleavesStartDate.type("03/07/2023")
    }

    async enterLeavesEndDate()
    {
        await this.dayleavesEndDate.type("03/07/2023")
    }

    async checkCheckboxDays()
    {
        await this.checkboxDays.click()
    }
    async selectLeaveType()
    {
        await this.dropdownLeaveType.click()
        await this.page.getByRole('option', { name: 'Sick' }).click()
    }

    async changeDate()
    {
        await this.page.getByRole('button', { name: 'calendar view is open, switch to year view' }).click()
        await this.page.getByRole('button', { name: '2023' }).click()
        await this.page.getByRole('button', { name: 'Jul' }).click()
    }
    async clickOnDate()
    {
        await this.DateForLeave.click()
    }
    async selectDaywiseView()
    {
        await this.btnByDaywise.click()
    }
    async selectWeekwiseView()
    {
       await this.btnByWeekwise.click()
    }
    async selectmonthwiseView()
    {
        await this.btnByMonthwise.click()
    }
    async clickOnClinicDiarybutton()
    {
        await this.btnClinicDiary.click()
    }
    async clickOnHpDiaryButton()
    {
        await this.btnHPDiary.click()
    }
}
module.exports=HPDiary