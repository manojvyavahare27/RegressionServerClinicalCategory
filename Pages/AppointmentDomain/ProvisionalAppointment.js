class ProvisionalAppointment
{
    constructor(page)
    {
        this.page=page
        this.SearchBtn=page.getByTestId('Search')
        this.ClearBtn=page.getByTestId('Clear')
        this.AllLinks=page.getByTestId('Links')
        this.linkAddProvisionalApp=page.getByRole('heading', { name: 'Add Provisional Appointment' })

        //Add Provisional Appointment Pop up
        this.dropdownAppType=page.getByTestId('CommonCellmaPopup').getByTestId('appointmentType').getByLabel('Open')
        this.dropdownService=page.getByTestId('service').getByLabel('Open')
        this.dropdownSpecility=page.getByTestId('specialty').getByLabel('Open')
        this.dropdownClinicType=page.getByTestId('CommonCellmaPopup').getByTestId('clinicType').getByLabel('Open')
        this.dropdownClinicLocation=page.getByTestId('clinicLocation').getByLabel('Open')
        this.dropdownTeams=page.getByTestId('teams').getByLabel('Open')
        this.txtboxAppDate=page.getByTestId('Appointment Date').getByPlaceholder('dd/mm/yyyy')
        this.txtAppconfirmStartDate=page.getByTestId('Appointment Confirmation Start Date').getByPlaceholder('dd/mm/yyyy')
        this.txtAppconfirmEndDate=page.getByTestId('Appointment Confirmation End Date').getByPlaceholder('dd/mm/yyyy')
        this.dropdownReasonForApp=page.getByTestId('reasonForAppointment').getByLabel('Open')
        this.txtboxNotes=page.getByTestId('Notes')
        this.btnSaveProvisionalApp=page.getByTestId('Save')        
        
    }
    //Add Provisional Appointment Pop up
    async enterNotes()
    {
        await this.txtboxNotes.fill('Added for testing')
    }
    async selectReasonforApp()
    {
        await this.dropdownReasonForApp.click()
        await this.page.getByRole('option', { name: 'Appointment Reason for Testing' }).click()
    }
    async enterAppconfirmEndDate(AppointmentConfirmationEndDate)
    {
        await this.txtAppconfirmEndDate.fill(AppointmentConfirmationEndDate)
    }
    async enterConfirmStartDate(AppointmentConfirmationStartDate)
    {
        await this.txtAppconfirmStartDate.fill(AppointmentConfirmationStartDate)
    }
    async enterAppDate(AppointmentDate)
    {
        await this.txtboxAppDate.fill(AppointmentDate)
    }
    async selectTeams()
    {
        await this.dropdownTeams.click()
        await this.page.getByRole('option', { name: 'All Teams' }).click()
    }
    async selectClinicLocation()
    {
        await this.dropdownClinicLocation.click()
        await this.page.getByRole('option', { name: 'Cath Lab Location' }).click()
    }
    async selectClinicType()
    {
        await this.dropdownClinicType.click()
        await this.page.getByRole('option', { name: 'Cardiology' }).click()
    }
    async selectSpeciality()
    {
        await this.dropdownSpecility.click()
        await this.page.getByRole('option', { name: 'All Specialties' }).click()
    }
    async selectAppType()
    {
        await this.dropdownAppType.click()
        await this.page.getByRole('option', { name: 'Provisional Appointment', exact: true }).click()
    }
    async clickOnSaveProvisionalApp()
    {
        await this.btnSaveProvisionalApp.click()
    }
    //Links
    async clickOnProvisionalApp()
    {
        await this.linkAddProvisionalApp.click()
    }
    async clickOnAllLinks()
    {
        await this.AllLinks.click()
    }
    async clickOnSearchBtn()
    {
        await this.SearchBtn.click()
    }
}
module.exports=ProvisionalAppointment