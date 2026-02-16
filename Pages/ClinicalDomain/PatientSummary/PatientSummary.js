const { clickElement, typeText, selectFromDropdown} = require('../../../UtilFiles/StaticUtility.js');
const { selectFromSearchResults, selectRadioButton, locateFieldById, toggleDivVisibility, clickOnRemoveCustomizableQuestion, clickOnRestoreCustomizableQuestion, showClinicalItemByStatus, showExtraDetailLevel, clickHistoryTableIconsBeforeItemName, clickHistoryTableIconsUsingItemName, replaceLocator, assertElementExists } = require('../../../UtilFiles/DynamicUtility.js');

class PatientSummary
{
    // Manoj Vyavahare
    constructor(page)
    {
        this.page=page
        //All Categories icon from left hand side on patient Summary page
        this.buttonMenuCategory=page.locator("xpath=//button[@aria-label='Menu Button']//*[name()='svg']")
        this.iconDiagnosisCategory=page.locator("xpath=//img[@alt='Diagnosis Image Avatar']")
        this.iconDocumentCategory=page.locator("xpath=//img[@alt='Documents Image Avatar']")
        this.iconPatientDetailsCategory=page.locator("xpath=//img[@alt='Patient Details Image Avatar']")
        this.iconAllergyCategory=page.locator("xpath=//img[@alt='Allergies Image Avatar']")
        this.iconConditionCategory=page.locator("xpath=//img[@alt='Conditions Image Avatar']")
        this.iconMedicationCategory=page.locator("xpath=//img[@alt='Medications Image Avatar']")
        this.iconInvestigationCategory=page.locator("xpath=//img[@alt='Investigations Image Avatar']")
        this.iconDeviceCategory=page.locator("xpath=//img[@alt='Devices Image Avatar']")
        this.iconExaminationsCategory=page.locator("xpath=//img[@alt='Examinations Image Avatar']")
        this.iconPhysicalSignCategory=page.locator("xpath=//img[@alt='Physical Signs Image Avatar']")
        this.iconLifestyleCategory=page.locator("xpath=//img[@alt='Lifestyle Image Avatar']")
        this.iconSocialCircumstancesCategory=page.locator("xpath=//img[@alt='Social Circumstances Image Avatar']")
        this.iconRiskFactorCategory=page.locator("xpath=//img[@alt='Risk Factor Image Avatar']")
        this.iconTestToolCategory=page.locator("xpath=//img[@alt='Test Tools Image Avatar']")
        this.iconPromsCategory=page.locator("xpath=//img[@alt='PROMs Image Avatar']")
        this.iconPatientScanCategory=page.locator("xpath=//img[@alt='Patient Scans Image Avatar']")
        this.iconPregnanciesCategory=page.locator("xpath=//img[@alt='Pregnancies Image Avatar']")
        this.iconOutcomeCategory=page.locator("xpath=//img[@alt='Outcomes Image Avatar']")
        this.iconInterpretationsCategory=page.locator("xpath=//img[@alt='Interpretations Image Avatar']")
        this.iconRecommendationsCategory=page.locator("xpath=//img[@alt='Recommendations Image Avatar']")
        this.iconCommunicationCategory=page.locator("xpath=//img[@alt='Communication Image Avatar']")
        this.iconOverviewCategory=page.locator("xpath=//img[@alt='Overview Image Avatar']")

        this.allCategory=page.locator("xpath=//input[@name='allCategory']")

        //Top Icons on Patient Summary page
        this.topIconHome=page.locator("xpath=//div[contains(text(),'Home')]")
        this.topIconMyArea=page.locator("xpath=//div[contains(text(),'My Area')]")
        this.topIconCategories=page.locator("xpath=//div[contains(text(),'Categories')]")
        this.topIconModules=page.locator("xpath=//div[contains(text(),'Modules')]")
        this.topIconView=page.locator("xpath=//div[contains(text(),'View')]")
        this.topIconAddTo=page.locator("xpath=//div[contains(text(),'Add To')]")
        this.topIconPrint=page.locator("xpath=//div[contains(text(),'Print')]")

        //Setting Button for customizable view
        this.buttonSetting=page.locator("xpath=//button[@aria-label='settingButton']//*[name()='svg']")
        this.buttonCustomisableView=page.locator("xpath=//li[normalize-space()='Customizable View']")

        //Links in Add to dropdown

        //Links in Add to dropdown

        this.linkTask=page.locator("xpath=//li[@aria-label='Task']")
        this.buttonSearch= page.locator("xpath=//button[@data-testid='Search']")
        //this.selectTask= page.getByRole('row', { name: 'expandRowIconundefined Arrange Appointment Regular Checkup Patient Yes - No No' }).getByTestId('Select')
        //this.selectTask= page.getByRole('row', { name: 'expandRowIconundefined Arrange Appointment - Regular Checkup Patient Yes - No' }).getByTestId('Select')
        this.selectTask= page.getByRole('row', { name: 'expandRowIconundefined Arrange Appointment Regular Checkup Patient Yes - No No' }).getByTestId('Select').nth(0)

        
       //Add/Edit task 
        this.addTaskButton=page.locator("xpath=//div[@class='MuiGrid2-root MuiGrid2-container MuiGrid2-direction-xs-row MuiGrid2-grid-xs-3 mui-1ey4xqy']//button[@data-testid='Add']")
         this.iconEditTask= page.locator("xpath=//button[@aria-label='editIconButton']").nth(0)
         this.dropdownAssignTaskGroup = page.locator("xpath=//input[@id='assignTaskGroup']")
         this.dropdownAssignTo = page.locator("xpath=//input[@id='assignTask']")
         this.dropdownIsForSelectedPatient = page.locator("xpath=//input[@name='taskForSelectedPatient']")
         this.taskDueDate = page.locator("xpath=//input[@id='taskDueDate']")
         this.taskDueTime = page.locator("xpath=//input[@name='taskDueTime']")
         this.showAlertForPatient= page.locator("xpath=//input[@id='showAlertForPatientTask']")
         this.alertMarkedAsCritical= page.locator("xpath=//input[@id='alertShownWillBeMarkedCritical']")
         this.addiSendAlertTo = page.locator("xpath=//input[@id='additionallySendAlertTo']")
         this.sendAlertUsing = page.locator("xpath=//input[@id='additionalSendALertUsing']")
         this.createInvoice = page.locator("xpath=//input[@id='createInvoice']")
         this.actioToPerform = page.locator("xpath=//input[@id='taskActionToPerform']")
         this.apptSpeciality = page.locator("xpath=//input[@id='arrangeAppointmentSpecialty']")
         this.clinicType = page.locator("xpath=//input[@id='clinicType']")
         this.clinicLocation = page.locator("xpath=//input[@id='clinicLocation']")
         this.ApptTeam = page.locator("xpath=//input[@id='team']")
         this.apptReason = page.locator("xpath=//input[@id='reason']")
         this.taskDescription = page.locator("xpath=//textarea[@id='descriptionForAddEditTask']")
         this.taskNotes = page.locator("xpath=//textarea[@id='notesForAddEditTask']")
         this.noOfOccurrance = page.locator("xpath= //input[@name='dueIn']")
         this.firstOccurrance = page.locator("xpath=//input[@id='firstOccurrence']")
         this.checkReoccurringTask = page.locator("xpath=//input[@value='false']")
         this.uncheckReoccurringTask = page.locator("xpath=//input[@value='true']")
         this.ageSpecific = page.locator("xpath=//input[@id='ageSpecific']")
         this.sexSpecific = page.locator("xpath=//input[@id='sexSpecificAddEdit']")
         this.reocurringIn = page.locator("xpath=//input[@id='reoccurringIn']")
         this.reoccuringDuration  = page.locator("xpath=//input[@id='reoccurringDuration']")
         this.reoccurances = page.locator("xpath=//input[@id='reoccursThisManyTimes']")
         this.minAge = page.locator("xpath=//input[@id='lowerAgeRange']")
         this.maxAge = page.locator("xpath=//input[@id='upperAgeRange']")
         this.sexSpecificAdd = page.locator("xpath=//input[@id='sexSpecificAdd']")
         this.saveButton = page.locator("xpath=//div[contains(text(),'Save')]")
         this.taskSpeciality = page.locator("xpath=//input[@id='specialty']")
         this.taskType = page.locator("xpath=//input[@id='taskType']")
         this.searchQuestion = page.locator("xpath=//input[@id='searchExistingTaskAndQuestion']")
         this.procedureStatus = page.locator("xpath=//input[@id='status']")
         this.procedureType = page.locator("xpath=//input[@id='type']")
         this.procedureSite = page.locator("xpath=//input[@id='site']")
         this.notToBeComplete = page.locator("xpath=//div[contains(text(),'Not To Be Complete')]")
         this.checkAllTasks = page.locator("xpath=//div[contains(text(),'Check All')]")
         this.uncheckAllTasks = page.locator("xpath=//div[contains(text(),'Uncheck All')]")
         this.completeTask = page.locator("xpath=//div[contains(text(),'Complete Tasks')]")
 
        //patient Summary Due Task icon
         this.iconDueTask = page.locator("xpath=//button[@aria-label='dueTask']")
        //  this.linkAllTask = page.locator("xpath=//button[normalize-space()='All Tasks']")
        //  this.linkIncompleteTask = page.locator("xpath=//button[normalize-space()='Incomplete Tasks']")
        //  this.linkNotToBeCompleted = page.locator("xpath=//button[normalize-space()='Not to be Completed Tasks']")
        //  this.linkCompletedTask = page.locator("xpath=//button[normalize-space()='Not to be Completed Tasks']")
        //  this.linkOverdueTask = page.locator("xpath=//button[normalize-space()='Overdue Tasks']")
        this.linkAllTask = page.locator("xpath=//div[@role='tablist']//button[@data-testid='allTasks']");
this.linkIncompleteTask = page.locator("xpath=//div[@role='tablist']//button[@data-testid='incompletedTask']");
this.linkNotToBeCompleted = page.locator("xpath=//div[@role='tablist']//button[@data-testid='notToBeCompletedTasks']");
this.linkCompletedTask = page.locator("xpath=//div[@role='tablist']//button[@data-testid='completedTask']");
this.linkOverdueTask = page.locator("xpath=//div[@role='tablist']//button[@data-testid='overdueTasks']");
 
         //Colapsables for task
         this.incompleteTask= page.locator("xpath=//div[text()='Incomplete Tasks']")
         this.completedTask= page.locator("xpath=//div[text()='Completed Tasks']")
         this.notToBeCompleted= page.locator("xpath=//div[text()='Not to be Completed Tasks']")
         this.expandTask= page.getByRole('cell', { name: 'expandRowIconundefined' }).first()
         
        this.taskCategory=page.locator("xpath=//input[@id='taskCategory']")
        this.txtboxSearchExistingTask=page.locator("xpath=//input[@id='searchExistingTaskAndQuestion']")
        this.taskType=page.locator("xpath=//input[@id='taskType']")
        this.textAreaDescription=page.locator("xpath=//textarea[@id='descriptionForAddEditTask']")
        this.taskActionToPerform=page.locator("xpath=//input[@id='taskActionToPerform']")
        this.localCode=page.locator("xpath=//input[@id='localCode']")
         
        
         //Communication Locators
        this.btnTextEmail= page.locator("xpath=//button[@aria-label='Text/Email']")
        this.typeOfComm = page.locator("xpath=//input[@id='typeOfCommunication']")
        this.emailHeader= page.locator("xpath=//input[@data-testid='Email Header']")
        this.stdContent= page.locator("xpath=//input[@id='standard']")
        //this.content= page.locator("xpath=//textarea[@id='Content']")
        this.content= page.locator("xpath=//textarea[@data-testid='Content']")
        this.checkboxSendToPatient= page.locator("xpath=//span[@data-testid='Send To Patient']//input[@type='checkbox']")
       
        //this.btnSend= page.locator("xpath=//button[@aria-label='Send']")
        this.btnSend= page.locator("xpath=//button[@aria-label='sendPatientComm']")
   
        this.emailSection= page.locator("xpath=//button[normalize-space()='Email']")
        this.textSection= page.locator("xpath=//button[normalize-space()='Text']")
        this.allCommSection= page.locator("xpath=//button[normalize-space()='All']")
        this.showLinkFirst= page.locator('a').first()
        this.showLinkSecond= page.locator('.MuiDataGrid-virtualScrollerRenderZone > div:nth-child(2) > div:nth-child(8) > .MuiTypography-root')
        this.cellmaLink= page.locator("xpath=//img[@alt='Cellma Image Avatar']")
        this.expandComm= page.getByRole('cell', { name: 'expandRowIconundefined' }).first()
        this.expandComm2= page.getByRole('cell', { name: 'expandRowIconundefined' }).nth(1)

    }

    //////Patient summary
 
 
//////Funtions
 
///////*****Communication*****
    async clickOnTextEmailBtn()
    {
        await clickElement(this.page, this.btnTextEmail)
    }
    async selectTypeOfCom(csd_communication_medium_type)
    {
        await selectFromDropdown(this.page, this.typeOfComm, csd_communication_medium_type)
    }
    async enterEmailHeader(email_header)
    {
        await typeText(this.page, this.emailHeader, email_header)
    }
    async selectStdContent(std_Content)
    {
        await selectFromDropdown(this.page, this.stdContent, std_Content)
    }
    async enterContent(com_content)
    {
        await typeText(this.page, this.content, com_content)
    }
 
    async clickOnSendComm()
    {
        await clickElement(this.page, this.btnSend)
    }
 
    async clickOnEmailSection()
    {
        await clickElement(this.page, this.emailSection)
    }
 
    async clickOnTextSection()
    {
        await clickElement(this.page, this.textSection)
    }
 
    async clickOnAllCommSection()
     {
        await clickElement(this.page, this.allCommSection)
     }
    async closePopUp()
    {
        await clickElement(this.page, this.closeTaskPopup)
    }
    async clickOnFirstShowLink()
    {
        await clickElement(this.page, this.showLinkFirst)
    }
 
    async clickOnSecondShowLink()
    {
        await clickElement(this.page, this.showLinkSecond)
    }
 
    async clickOnCellma()
    {
        await clickElement(this.page, this.cellmaLink)
    }
 
    async expandFisrtCom()
    {
        await clickElement(this.page, this.expandComm)
    }
    async expandSecondCom()
    {
        await clickElement(this.page, this.expandComm2)
    }
 
        async sendToPatientCheckbox() {
    await clickElement(this.page, this.checkboxSendToPatient);}
 
 

    async clickOniconExaminationsCategory()
    {
        await this.iconExaminationsCategory.click()
    }
    async clickOniconRecommendation()
    {          
        await this.iconRecommendationsCategory.click()
    }

    async clickOnallCategory()
    {
        await this.allCategory.click()
        await this.page.getByRole('option', { name: 'Recommendations' }).click()
    }
 
    async clickOniconPatientDetailsCategory()
    {
        await this.iconPatientDetailsCategory.click()
    }

    async addTask()
    {
        await clickElement(this.page, this.addTaskButton)
    }
    
    async clickOnAddToTask()
    {
        await clickElement(this.page, this.topIconAddTo)
    }
    async selectTasklink()
    {
        await clickElement(this.page, this.linkTask)
    }
    async clickOnSearchTask()
    {
        await clickElement(this.page, this.buttonSearch)
    }
    async selectTaskTemplate()
    {
        await clickElement(this.page, this.selectTask)
    }

    async selectAssignTaskGroup(task_groupname)
    {
        await selectFromDropdown(this.page, this.dropdownAssignTaskGroup, task_groupname)
    }
    async selectAssignTaskUser(task_username)
    {
        await selectFromDropdown(this.page, this.dropdownAssignTo, task_username)
    }
    async selectTaskDueDate(due_date)
    {
        await typeText(this.page, this.taskDueDate, due_date)
    }
    async selectTaskDueTime(due_time)
    {
        await typeText(this.page, this.taskDueTime, due_time) 
    }
    async selectSendAlertTo(){
        await selectFromDropdown(this.page, this.addiSendAlertTo, 'User')
    }
    async selectSendAlertUsing(){
        await selectFromDropdown(this.page, this.sendAlertUsing, 'Text')
    }
    async selectApptSpeciality(specialty){
        await selectFromDropdown(this.page, this.apptSpeciality, specialty)
    }
    async selectApptClinicType(clinic_type){
        await selectFromDropdown(this.page, this.clinicType, clinic_type)
    }
    async selectApptClinicLocation(appt_location){
        await selectFromDropdown(this.page, this.clinicLocation, appt_location)
    }
    async selectApptTeam(team){
        await selectFromDropdown(this.page, this.ApptTeam, team)
    }
    async enterTaskDescription(description)
    {
        await typeText(this.page, this.taskDescription, description) 
    }
    async enterTaskNotes(notes)
    {
        await typeText(this.page, this.taskNotes, notes) 
    }
    async reoccurringTaskCheck()
    {
        await clickElement(this.page, this.checkReoccurringTask)
    }
    async reoccurringTaskUncheck()
    {
        await clickElement(this.page, this.uncheckReoccurringTask)
    }
    async setAgeSpecificTask()
    {
        await selectFromDropdown(this.page, this.ageSpecific,'Yes')
    }
    async setSexSpecificTask()
     {
        await selectFromDropdown(this.page, this.sexSpecific, 'Yes')
     }
    async addSpecificMinAge(age_min)
    {
        await typeText(this.page, this.minAge,age_min)
    }
    async addSpecificMaxAge(age_max)
    {
        await typeText(this.page, this.maxAge,age_max)
    }
    async addSpecificSex()
    {
        await selectFromDropdown(this.page,this.sexSpecificAdd, 'Male')
    }
    async saveTask()
    {
        await clickElement(this.page, this.saveButton)
    }
     
    async selectTaskCategory(category) {
        await selectFromDropdown(this.page, this.taskCategory, category);
    }

    async searchExistingTask(searchText) {
        await typeText(this.page, this.txtboxSearchExistingTask, searchText);
    }

    async selectTaskType(type) {
        await selectFromDropdown(this.page, this.taskType, type);
    }

    async enterTaskAreaDescription(description) {
        await typeText(this.page, this.textAreaDescription, description);
    }

    async selectTaskActionToPerform(action) {
        await selectFromDropdown(this.page, this.taskActionToPerform, action);
    }
    async clickTaskIcon()
    {
        await clickElement(this.page, this.iconDueTask)
    }
    async allTaskTab()
    {
        await clickElement(this.page, this.linkAllTask)
    }
    async expandIncompleteTask()
    {
        await clickElement(this.page, this.incompleteTask)
    }
    async expandCompleteTask()
    {
        await clickElement(this.page, this.completedTask)
    }
    async expandNotToBeCompleted()
    {
        await clickElement(this.page,this.notToBeCompleted)
    }
    async incompleteTaskTab()
    {
        await clickElement(this.page,this.linkIncompleteTask)
    }
    async completedTaskTab()
    {
        await clickElement(this.page,this.linkCompletedTask)
    }

    async notToBeCompletedTab()
    {
        await clickElement(this.page,this.linkNotToBeCompleted)
    }
    async overrdueTaskTab()   
    {   
    await clickElement(this.page, this.linkOverdueTask)
    }
    async editTask()
    {
        await clickElement(this.page, this.iconEditTask)
    }
    async clickCheckAll()
    {
        await clickElement(this.page, this.checkAllTasks)
    }

    async clickUncheckAll()
    {
        await clickElement(this.page,this.uncheckAllTasks)
    }
    
    async clickCompleteTask()
    {
        await clickElement(this.page,this.completeTask )
    }

    async clickNotToBeComplete()
    {
        await clickElement(this.page,this.notToBeComplete)
    }
    
        async enterLocalCode(code) {
        await typeText(this.page, this.localCode, code);
    }

     
}
module.exports=PatientSummary