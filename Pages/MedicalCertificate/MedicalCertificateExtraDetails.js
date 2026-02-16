//Manoj

const { clickElement, typeText, selectFromDropdown } = require('../../UtilFiles/StaticUtility.js');
const {selectFromSearchResults,radioButtonSelector,selectRadioButton } = require('../../UtilFiles/DynamicUtility.js')

class MedicalCertificateExtraDetails
{
    constructor(page) {
    this.page = page;       
    this.save=page.locator("xpath=//button[@data-testid='Save']")
          
}
//Click on Save Medication button on Extra Details popup
async clickOnSave() {
    await clickElement(this.page, this.save);
  }
}
module.exports = MedicalCertificateExtraDetails;