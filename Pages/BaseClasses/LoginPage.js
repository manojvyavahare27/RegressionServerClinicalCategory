class LoginPage {
    constructor(page) {
        this.page = page
        this.userName = page.getByRole('textbox', { name: 'Username' })
        this.passWord = page.getByRole('textbox', { name: 'Password' })
        this.emailaddress = page.locator("xpath=//input[@id='Email Address']")
        //this.loginButton = page.locator("xpath=//button[@aria-label='Login']")
        this.loginButton = page.locator("xpath=//button[@data-testid='Login']")
        this.message = page.getByText('Your username/password combination has not been recognised. Please try again.')

        //Forgot Password Page
        this.forgotpasswordlink = page.locator("//body/div[@id='root']/div[2]/div[1]/div[1]/div[1]/form[1]/div[1]/div[2]/div[1]/div[5]/a[1]")
        this.forgotpasswordlink = page.getByText('Forgot Password')
        this.closeforgotpasswordpopup = page.getByTestId('CancelIcon')
        this.txtEmailAddress = page.locator("xpath=//input[@id='Email Address']")

        //Login to Rferral Portal


        this.txtUserName = page.locator("xpath=//input[@id='Username']")
        this.txtPassword = page.locator("xpath=//input[@id='Password']")
        this.btnLoginReferralPortal = page.locator("xpath=//div[contains(text(),'Login')]")


    }

    async openReferralPortal() {
        await this.page.goto("http://10.0.0.106:3001/cellmaPortal/portal/login")
    }

    async enterReferralPortalUserName(username) {
        await this.txtUserName.fill(username)
    }
    async enterRefrralPortalPassword(password) {
        await this.txtPassword.fill(password)
    }
    async clickOnReferralPortalLoginButton() {
        await this.btnLoginReferralPortal.click()
    }

    async openUrl() {
        await this.page.goto("http://10.0.0.64:3000/cellmaUser/login")
        //await page.goto(Environment.Test)
    }
    //enterUsername=async()=> await this.userName.type(username)
    //enter_Password=async()=> await this.passWord.type(password)


    async enterUsername(username) {
        await this.userName.fill(username)
    }
    async enter_Password(password) {
        await this.passWord.fill(password)
    }
    async clickOnLogin() {
        await this.loginButton.click()
    }

    async enter_emailAddress(emailid) {
        await this.txtEmailAddress.fill(emailid)
    }

    async enter_InvalidemailAddress(Invalidemailid) {
        await this.txtEmailAddress.fill(Invalidemailid)
    }
}
module.exports = LoginPage