// page.js
//import { Locator, Page } from '@playwright/test';

class CarePlansPage {
    constructor() {
        this.page = page;
    }

    // Selectors
    get carePlansButton() {
        return this.page.locator('[data-testid="carePlans"]');
    }

    get nursingDiagnosisInput() {
        return this.page.locator('#[name="searchNursingDiagnosis"]');
    }

    get goalsInput() {
        return this.page.locator('#searchGoals');
    }

    get interventionsInput() {
        return this.page.locator('#searchInterventions');
    }

    get evaluationsInput() {
        return this.page.locator('#searchEvaluations');
    }

    get saveButton() {
        return this.page.locator('[data-testid="Save"]');
    }

    get addToFavouritesCheckbox() {
        return this.page.locator('[data-testid="Add to Favourites"]');
    }

    // Actions
    async clickCarePlans() {
        await this.carePlansButton.click();
    }

    async fillNursingDiagnosis(value) {
        await this.nursingDiagnosisInput.fill(value);
    }

    async fillGoals(value) {
        await this.goalsInput.fill(value);
    }

    async fillInterventions(value) {
        await this.interventionsInput.fill(value);
    }

    async fillEvaluations(value) {
        await this.evaluationsInput.fill(value);
    }

    async clickSave() {
        await this.saveButton.click();
    }

    async toggleAddToFavourites() {
        await this.addToFavouritesCheckbox.click();
    }
}
module.exports=CarePlansPage