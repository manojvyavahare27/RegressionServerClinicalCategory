import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://cellma4testing.riomed.com/cellmaUser/login');
  await page.getByTestId('Username').fill('saurabh.auto');
  await page.getByTestId('Password').click();
  await page.getByTestId('Password').fill('Dayal@2024');
  await page.getByTestId('Login').click();
 // await page.pause()
  await page.getByTestId('homeDashboard').click();
  await page.getByTestId('Patients').nth(1).click();
  await page.getByTestId('Given Name').click();
  await page.getByTestId('Given Name').fill('AssessmentxS');
  await page.getByTestId('Family Name').click();
  await page.getByTestId('Family Name').fill('Riomed');
  await page.getByTestId('Search').click();
  await page.getByTestId('Add Patient').click();
  await page.getByTestId('photoIdentification').getByLabel('Open').click();
  await page.getByRole('option', { name: 'Aadhar Card' }).click();
  await page.getByTestId('photoIdentification').getByPlaceholder('Please Select').press('Tab');
  await page.getByTestId('Photo Identification ID').fill('989800009813');
  await page.getByTestId('issuingCountry').getByLabel('Open').click();
  await page.getByRole('option', { name: 'India', exact: true }).click();
  await page.getByTestId('Title').getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Mr', exact: true }).click();
  await page.getByTestId('Middle Name(s)').click();
  await page.getByTestId('Middle Name(s)').fill('tester');
  await page.getByLabel('Choose date').click();
  await page.getByPlaceholder('dd/mm/yyyy').click();
  await page.getByPlaceholder('dd/mm/yyyy').click();
  await page.getByPlaceholder('dd/mm/yyyy').fill('01/01/1999');
  await page.getByTestId('Duplicate Check').click();
  await page.getByTestId('Create Patient').click();
  await page.getByTestId('Ethnicity').getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Indian' }).click();
  await page.getByTestId('Occupation').getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Trainer' }).click();
  await page.getByTestId('Religion').getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Hindu' }).click();
  await page.getByTestId('Blood Type').getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'AB+' }).click();
  await page.getByTestId('Patient Type').getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Regular' }).click();
  await page.getByTestId('Next').click();
  await page.getByRole('textbox', { name: 'numberRoadPermanentAddress' }).click();
  //await page.getByRole('textbox', { name: 'numberRoadPermanentAddress' }).press('Shift+Home');
  await page.getByRole('textbox', { name: 'numberRoadPermanentAddress' }).fill('flat no 1205');
  await page.getByRole('textbox', { name: 'numberRoadPermanentAddress' }).press('Tab');
  await page.getByRole('textbox', { name: 'townPermanentAddress' }).fill('Hadapsar');
  await page.getByRole('textbox', { name: 'townPermanentAddress' }).press('Tab');
  await page.getByRole('textbox', { name: 'districtPermanentAddress' }).fill('Pune');
 // await page.getByRole('textbox', { name: 'districtPermanentAddress' }).press('Tab');
  await page.getByRole('textbox', { name: 'countyPermanentAddress' }).fill('Maharashtra');
  await page.locator('#mui-component-select-country').click();
  await page.getByRole('option', { name: 'India', exact: true }).click();
  await page.getByRole('textbox', { name: 'Number & Road' }).click();
  await page.getByRole('textbox', { name: 'Number & Road' }).fill('Flat 1205');
  await page.getByRole('textbox', { name: 'Town', exact: true }).click();
  await page.getByRole('textbox', { name: 'Town', exact: true }).fill('Hadapsar');
  await page.getByRole('textbox', { name: 'District', exact: true }).click();
  await page.getByRole('textbox', { name: 'District', exact: true }).fill('pune');
  await page.getByRole('textbox', { name: 'County', exact: true }).click();
  await page.getByRole('textbox', { name: 'County', exact: true }).fill('maharashtra');
  await page.locator('#mui-component-select-tempCountry').click();
  await page.getByRole('option', { name: 'India', exact: true }).click();
  await page.getByTestId('Save').click();
  await page.pause()
  await page.getByTestId('Title').getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Mr', exact: true }).click();
  await page.getByTestId('Family Name').click();
  await page.getByTestId('Family Name').fill('Details');
  await page.getByTestId('Given Name').click();
  await page.getByTestId('Given Name').fill('Tester');
  await page.getByTestId('Relationship').getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Friend' }).click();  
  await page.getByRole('checkbox', { name: 'Assisting in partner\'s care' }).check();
  await page.getByRole('checkbox', { name: 'Helping patients and their' }).check();
  await page.getByRole('checkbox', { name: 'For use on the University' }).check();
  await page.getByRole('checkbox', { name: 'Being photographed or videoed' }).check();
  await page.getByTestId('Save').click();
  await page.getByTestId('Next').click();
  await page.getByTestId('Search').click();
//   await page.getByTestId('Family Name').click();
//   await page.getByTestId('Family Name').fill('akram'); 
  //await page.locator("//button[@aria-label='personAdd']").click();
 // await page.getByRole('button', { name: 'Search' }).click();
  //await page.getByLabel('personAdd').click();
  //await page.locator('//button[@aria-label="personAdd"]').click();
 // await page.locator(xpath="//button[@title='Add GP to Patient']//*[name()='svg']").click()
 // await page.locator("xpath=//button[@title='Add GP to Patient']//*[name()='svg']").click();
 await page.getByRole('textbox', { name: 'Search' }).click();
 await page.getByRole('textbox', { name: 'Search' }).fill('akram');
 await page.getByLabel('personAdd').click();
  
 //await page.getByLabel('personAdd').click()
   //await page.getByLabel('personAdd').click();
  await page.getByTestId('Next').click();
  await page.getByTestId('Save').click();
  await page.getByTestId('Identifier').click();
  await page.getByTestId('Identifier').fill('AA013');
  await page.getByTestId('Save').click();
  await page.getByTestId('Referrals').click();
  await page.getByTestId('Links').click();
  await page.getByRole('heading', { name: 'Add Referral' }).click();

  //Date format
await page.pause()
  
  const today = new Date();
const month = today.toLocaleString('default', { month: 'short' }); // Get abbreviated month (e.g., Dec)
const day = today.getDate(); // Get the day (e.g., 11)
const year= today.getFullYear();
console.log(year);




  //await page.getByTestId('Received Referral Date').getByLabel('Choose date').click();
  await page.getByTestId('Received Referral Date').fill('01/01/2025')
  //await page.getByLabel(`${month} ${day}, ${year}`).click();
  await page.waitForTimeout(1000)
  //await page.getByTestId('Approved Referral Date').getByLabel('Choose date').click();
  await page.getByTestId('Approved Referral Date').fill('01/01/2025')
  //await page.getByLabel(`${month} ${day}, ${year}`, { exact: true }).click();
  await page.waitForTimeout(1000)
  //await page.getByTestId('Date of Referral').getByLabel('Choose date').click();
  await page.getByTestId('Date of Referral').fill('01/01/2025')
  //await page.getByLabel(`${month} ${day}, ${year}`, { exact: true }).click();
  await page.waitForTimeout(1000)
  //await page.getByTestId('Time of Referral').getByLabel('Choose time').click();
  await page.getByTestId('Time of Referral').fill('09:00')
   //  await page.locator('.css-1umqo6f').click();
    // await page.locator('.css-1umqo6f').click();
  await page.getByTestId('Source of Referral').getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Self' }).click();
  await page.getByTestId('referralType').getByLabel('Open').click();
  await page.getByRole('option', { name: 'Clinical' }).click();
  await page.getByTestId('referralReason').getByLabel('Open').click();
  await page.getByRole('option', { name: 'In Patient' }).click();
  await page.getByTestId('Mode of Referral').getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Email' }).click();
  await page.getByTestId('Service').getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'General Medicine Automation' }).click();
  await page.getByTestId('Clinic Type').getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Cardiology Clinic' }).click();
  await page.getByTestId('clinicLocation').getByLabel('Open').click();
  await page.getByRole('option', { name: 'Cardio Location' }).click();
  await page.getByTestId('team').getByLabel('Open').click();
  await page.getByRole('option', { name: 'HP Region1' }).click();
  await page.getByTestId('patientCare').getByLabel('Open').click();
  await page.getByRole('option', { name: 'In Patient' }).click();
  await page.getByTestId('Preferred Sex for Assessment').getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Male', exact: true }).click();
  await page.getByTestId('Consultant').getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Mr Prerelease AutoEst' }).click();
  await page.getByTestId('methodOfArrival').getByLabel('Open').click();
  await page.getByRole('option', { name: 'Car' }).click();

  await page.getByTestId('Time of Arrival').fill('10:00')
  await page.getByRole('textbox', { name: 'Notes', exact: true }).click();
  await page.getByRole('textbox', { name: 'Notes', exact: true }).fill('test');
  await page.getByTestId('Save').click();
  await page.getByTestId('PatientSummary').click();
  //await page.locator()
  await page.locator("//img[@alt='PatientSummary Image Avatar']").click();  
  await page.getByLabel('alertIconButton').first().click();
  await page.getByLabel('', { exact: true }).first().check();
  await page.getByLabel('', { exact: true }).first().uncheck();
  // await page.getByLabel('', { exact: true }).nth(1).check();
  // await page.getByLabel('', { exact: true }).nth(1).uncheck();
  await page.getByRole('checkbox', { name: 'Select All' }).check();
  await page.getByRole('checkbox', { name: 'Select All' }).uncheck();
  // await page.getByLabel('', { exact: true }).nth(2).check();
  // await page.getByLabel('', { exact: true }).nth(2).uncheck();
  await page.getByLabel('cancelIcon').click();
  await page.getByLabel('alertIconButton').first().click();
  //await page.getByLabel('', { exact: true }).nth(2).check();
  await page.getByTestId('Save').click();
  await page.getByLabel('alertIconButton').first().click();
  await page.getByLabel('cancelIcon').click();
  await page.getByLabel('profileIcon').click();
  await page.getByRole('menuitem', { name: 'Logout Logout' }).click();
});

