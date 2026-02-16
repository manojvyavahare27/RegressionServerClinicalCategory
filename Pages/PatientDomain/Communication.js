class Communication
{
    constructor(page)
    {
        this.page=page
        this.contactByEmailYesRadio=page.locator('label[aria-label="contactByEmailYes"]');
        this.contactByEmailNoRadio=page.locator('label[aria-label="contactByEmailNo"]');
        this.contactBySMSYesRadio=page.locator('label[aria-label="contactBySMSYes"]');
        this.contactBySMSNoRadio=page.locator('label[aria-label="contactBySMSNo"]');
        this.contactBySMSClinicalYesRadio=page.locator('label[aria-label="contactBySMSClinicalYes"]');
        this.contactBySMSClinicalNoRadio=page.locator('label[aria-label="contactBySMSClinicalNo"]');

        this.communicationDateInput = '#Communication\\ Date';
        this.typeOfCommunicationInput = '#typeOfCommunication';
        this.emailHeaderInput = '#Email\\ Header';
        this.standardInput = '#standard';
        this.contentTextarea = '#Content';
        this.sendButton = '[data-testid="Send"]';
    } 

    async fillCommunicationDate(date) {
        await this.page.fill(this.communicationDateInput, date);
    }

    async fillTypeOfCommunication(type) {
        await this.page.fill(this.typeOfCommunicationInput, type);
    }

    async fillEmailHeader(header) {
        await this.page.fill(this.emailHeaderInput, header);
    }

    async fillStandard(standard) {
        await this.page.fill(this.standardInput, standard);
    }

    async fillContent(content) {
        await this.page.fill(this.contentTextarea, content);
    }

    async clickSend() {
        await this.page.click(this.sendButton);
    }

    //

    async selectContactByEmailYes() {
        await this.contactByEmailYesRadio.click();
    }
    
    async selectContactByEmailNo() {
        await this.contactByEmailNoRadio.click();
    }
    
    async selectContactBySMSYes() {
        await this.contactBySMSYesRadio.click();
    }
    
    async selectContactBySMSNo() {
        await this.contactBySMSNoRadio.click();
    }
    
    async selectContactBySMSClinicalYes() {
        await this.contactBySMSClinicalYesRadio.click();
    }
    
    async selectContactBySMSClinicalNo() {
        await this.contactBySMSClinicalNoRadio.click();
    }
}
module.exports=Communication