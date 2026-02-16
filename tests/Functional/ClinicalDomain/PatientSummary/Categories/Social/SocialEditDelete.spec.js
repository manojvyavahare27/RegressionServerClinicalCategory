import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://cellma4testing.riomed.com/cellmaUser/login');
  await page.getByTestId('Username').click();
  await page.getByTestId('Username').fill('anu.auto');
  await page.getByTestId('Password').click();
  await page.getByTestId('Password').fill('Pune@2023');
  await page.getByTestId('Login').click();
  await page.getByRole('button', { name: 'Patients' }).click();
  await page.getByTestId('Given Name').click();
  await page.getByTestId('Given Name').fill('Manoj');
  await page.getByTestId('Barcode').click();
  await page.getByTestId('Barcode').fill('788287');
  await page.getByTestId('Search').click();
  await page.getByTestId('Select').click();
  await page.locator("xpath=//button[@data-testid='Confirm Existing Details']").click();
  //await page.getByTestId('Confirm Existing Details').click();
  await page.getByTestId('contactLocation').getByLabel('Open').click();
  await page.getByRole('option', { name: 'Cardio Location' }).click();
  await page.getByTestId('Add Contact').click();
  await page.getByTestId('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAD80lEQVR4XtWWvWsUURTF8yeksRhBnU5BhBQ2fsEiqRKEtRGbwGJlubxCxMYtLESbBe1stgzBIgQDCVisXcqQXlitLASDkC8txnvy7kvenvt2Zzabwil+ZPbcO2/Ou+/eycwURTFTN4xQB4xQB4xQB4wwNZsXZoUNoVDWjjXOmwIjTI03GQyfGue8KTDC1FjDHs6bAiNMDZv9n007154Ttr8uX//Nhr+tXPsusXPrayOcBTHUEQr8LfwgnvT14frFzy+fP12X2K7Q5HvPghEmIVRXmeM45TaFgdAXco5PghGqMlTdRDyF5M4KXeerXvk+xghloKJa2dLqjoLWaHC8DCMArciG85UEa6q13ZRVionW635YfHDly9UbG8KhUOh1cniNoIvBZDAc+OlKqps922kLA6FQcD12+GS9XOiv3Gv8VbMxG5wPjKALseFjOC9GzHXVaEdoKD3VWpzPJAyDQ84DRgBstsy0mMrVHJI4hk3sCsmjDkRtMQTnASMAN9zPgZHfDzArDFjX2KxuqMGxGLQCG4bGecAIwPmhi/v6eBA5L6DV7LMexdHb5hRixOCssKZmj3QTyWcaIcb5IdllnUHPogVY11ilSgN5Fl6FA9YZIzCoNGtMdtrTjUQMG0IsWbUYeVZLWGWdMQKDnaMCrDNoj1SLaGv0WE/h/H/LDuuMERjnvxUarDOosla0FWkd1XLOT1H1WUZgZJGeMHaIgLZIeFf3hNWwCaH0pABa0VX4mDICg+MadWSZHzIYxHsYBueEZqatotcAMeSg8sneRgu6CkMPjMA4/0nZZ10Nb6sZVBMm8fvElOYgjqrDMK6HcqLnYAjNc1IYgUGPpRZTk4NgIPPtEUzhGlVH/MSkasjp8nqu4hACIzDO/6MpYk1N4cibpMMUTIYPJmxsqKrZiHc6CoNTZT2FEVIkTDdgivMo3mBdY2HDQ8OJZ7gKQwiMkMLRx3qZ6XGEe+NNydqVhxAYIQUfHaqkD25x7jgyP5gdvTeP1k8O+yiMkMIlhiQ7/VbGYPUrEnp9aBCxNq8/DiOk0EXNxGe+4u3MV68KLdzD6/BJlmEE5tb6Qn5/pflxfvnhL7nu4TfnnIWD95dyoSv0t17fOdp8NX+Xc0ZhhBgYFPaEIgK/c86dBDW8JxQR+F1pXSPEaGVjwwHTKpMg5npkOFBpXSPEiLl+wjDY4txJQEskDINK6xohBhVNGC4We49+6PCUsRreDDE7b29uJQyDHntIYQQyjZ7ejw3f/rRwuPTmyWPnv0nKaLFh0H2x1N17d/kPGd4/OI+eBmocvb2llc855yzAICqLljjwb5Gcc0ZhhDpghDpghDpghDpghDrwD3082XJ0QpirAAAAAElFTkSuQmCC').click();
  await page.getByLabel('editIconButton').click();
  await page.locator("(//*[name()='svg'][@aria-label='Expand'])[1]").click();
  await page.getByTestId('Notes').click();
  await page.getByTestId('Notes').fill('test edit');
  await page.getByTestId('Save').click();
  await page.getByLabel('cancelIcon').click();

  await page.getByLabel('reviewIconButton').click();
  await page.getByLabel('patientHistoryIconButton').click();
  await page.getByLabel('expandRowIconundefined').nth(1).click();
  await page.getByLabel('cancelIcon').click();
  await page.getByLabel('highlightNone').click();
  await page.getByLabel('expandRowIconundefined').click();
  
  await page.getByLabel('editIconButton').click();
  await page.getByTestId('Delete').click();
  await page.getByTestId('Ok').click();
  await page.getByTestId('Reason').click();
  await page.getByTestId('Reason').fill('test delete');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByTestId('migrated').click();
  await page.getByTestId('deleted').click();
  await page.getByTestId('archived').click();
  await page.getByLabel('cellmaImageAvatar').click();
  await page.getByTestId('Menu').click();
  await page.getByText('Logout').click();
});