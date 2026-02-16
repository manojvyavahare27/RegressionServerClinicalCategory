class Menu{
    constructor(page)
    {
        this.page=page
        this.menubtn=page.getByTestId('Menu')
        this.linkaddReferral=page.getByText('Add Referral')
        this.linkfindpatient=page.getByText('Find Patient')
        this.menulogoutbtn=page.getByText('Logout')
        
    }
    async clickOnFindPatientlink()
    {
        await this.linkfindpatient.click()
    }
    async clickOnAddReferrallink()
    {
        await this.linkaddReferral.click()
    }
    async clickOnMenubtn()
    {
        await this.menubtn.click()
    }
    async clickOnLogout()
    {
        await this.menulogoutbtn.click()
    }
}
module.exports=Menu