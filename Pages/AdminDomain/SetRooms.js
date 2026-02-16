class SetRooms
{
    constructor(page)
    {
        this.page=page
        this.btn_BackButton=page.getByRole('button', { name: 'Back Button' })
        this.btn_SaveButton=page.getByTestId('Save')
        this.linkSetRoomsSchedule=page.getByTestId('Set Room Schedule')

        this.btnSearch=page.getByRole('button', { name: 'Search' })

        //SearchRooms
        this.dropdownSearchLocation=page.getByLabel('roomLocation').getByLabel('Open')
        this.btnSearchRooms=page.getByTestId('Search')

        //Edit Rooms Details
        this.btnEditRecords=page.getByLabel('edit')

        //Room Availability.
        this.dropdownLocation=page.getByLabel('roomAvailabilityLocation').getByLabel('Open')
        this.dropdownZone=page.getByLabel('roomAvailabilityZone').getByLabel('Open')
        this.dropdownRooms=page.getByLabel('roomAvailabilityRoom', { exact: true }).getByLabel('Open')
        this.calendarStartDate=page.getByLabel('Start Date *')
        this.calendarEndDate=page.getByLabel('End Date *')
        this.clockStartTime=page.getByLabel('roomAvailabilityStartTime').getByPlaceholder('hh:mm')
        this.clockEndTime=page.getByTestId('End Time').getByPlaceholder('hh:mm')
        this.dropdownRoomStatus=page.getByLabel('Room Status *')
        this.txtboxReason=page.getByTestId('Reason')
        this.btnSave=page.getByTestId('Save')
        this.btnSaveRoomAvailability=page.locator('form').filter({ hasText: 'Room AvailabilityLocation *Location *ZoneZoneRoom *Room *Start Date *Start Date ' }).getByTestId('Save')
        this.btnRoomScheduleSave=page.locator('form').filter({ hasText: 'Room ScheduleLocation *Location *ZoneZoneRoom *Room *Activity Type *Activity Typ' }).getByTestId('Save')
        this.linkSetRoomsSchedule=page.getByTestId('Set Room Schedule')

        //Room Shcedule 1
        this.dropdownActivityType1=page.getByTestId('roomSchedule[0].activityType').getByLabel('Open')
        this.StartDateRoomSchedule1=page.locator('#roomScheduleStartDAte')
        this.EndDateRoomSchedule1=page.locator('#roomScheduleEndDate')
        this.StartTimeRoomSchedule1=page.locator('input[name="roomSchedule\\[0\\]\\.startTime"]')
        this.EndTimeRoomSchedule1=page.locator('input[name="roomSchedule\\[0\\]\\.endTime"]')
        this.RoomStatusRoomSchedule1=page.getByTestId('roomSchedule[0].roomStatus').getByLabel('Room Status *')
        this.txtboxReasonRoomSchedule1=page.locator('[id="roomSchedule\\[0\\]\\.reason"]')
        this.btnSaveRoomSchedule1=page.locator('form').filter({ hasText: 'Room ScheduleLocation *Location *ZoneZoneRoom *Room *Activity Type *Activity Typ' }).getByTestId('Save')

        //Room Schedule 2        
        this.dropdownActivityType2=page.getByTestId('roomSchedule[1].activityType').getByLabel('Open')
        this.StartDateRoomSchedule2=page.locator('input[name="roomSchedule\\[1\\]\\.startDate"]')
        this.EndDateRoomSchedule2=page.locator('input[name="roomSchedule\\[1\\]\\.endDate"]')
        this.StartTimeRoomSchedule2=page.locator('input[name="roomSchedule\\[1\\]\\.startTime"]')
        this.EndTimeRoomSchedule2=page.locator('input[name="roomSchedule\\[1\\]\\.endTime"]')
        this.RoomStatusRoomSchedule2=page.getByTestId('roomSchedule[1].roomStatus').getByLabel('Room Status *')
        this.txtboxReasonRoomSchedule2=page.locator('[id="roomSchedule\\[1\\]\\.reason"]')
        this.btnSaveRoomSchedule2=page.locator('form').filter({ hasText: 'Room ScheduleLocation *Location *ZoneZoneRoom *Room *Activity Type *Activity Typ' }).getByTestId('Save')

        //Room Schedule 3        
        this.dropdownActivityType3=page.getByTestId('roomSchedule[2].activityType').getByLabel('Open')
        this.StartDateRoomSchedule3=page.locator('input[name="roomSchedule\\[2\\]\\.startDate"]')
        this.EndDateRoomSchedule3=page.locator('input[name="roomSchedule\\[2\\]\\.endDate"]')
        this.StartTimeRoomSchedule3=page.locator('input[name="roomSchedule\\[2\\]\\.startTime"]')
        this.EndTimeRoomSchedule3=page.locator('input[name="roomSchedule\\[2\\]\\.endTime"]')
        this.RoomStatusRoomSchedule3=page.getByTestId('roomSchedule[2].roomStatus').getByLabel('Room Status *')
        this.txtboxReasonRoomSchedule3=page.locator('[id="roomSchedule\\[2\\]\\.reason"]')
        this.btnSaveRoomSchedule3=page.locator('form').filter({ hasText: 'Room ScheduleLocation *Location *ZoneZoneRoom *Room *Activity Type *Activity Typ' }).getByTestId('Save')


        //Room Schedule 4        
        this.dropdownActivityType4=page.getByTestId('roomSchedule[3].activityType').getByLabel('Open')
        this.StartDateRoomSchedule4=page.locator('input[name="roomSchedule\\[3\\]\\.startDate"]')
        this.EndDateRoomSchedule4=page.locator('input[name="roomSchedule\\[3\\]\\.endDate"]')
        this.StartTimeRoomSchedule4=page.locator('input[name="roomSchedule\\[3\\]\\.startTime"]')
        this.EndTimeRoomSchedule4=page.locator('input[name="roomSchedule\\[3\\]\\.endTime"]')
        this.RoomStatusRoomSchedule4=page.getByTestId('roomSchedule[3].roomStatus').getByLabel('Room Status *')
        this.txtboxReasonRoomSchedule4=page.locator('[id="roomSchedule\\[3\\]\\.reason"]')
        this.btnSaveRoomSchedule4=page.locator('form').filter({ hasText: 'Room ScheduleLocation *Location *ZoneZoneRoom *Room *Activity Type *Activity Typ' }).getByTestId('Save')

      //Room Schedule 5        
      this.dropdownActivityType5=page.getByTestId('roomSchedule[4].activityType').getByLabel('Open')
      this.StartDateRoomSchedule5=page.locator('input[name="roomSchedule\\[4\\]\\.startDate"]')
      this.EndDateRoomSchedule5=page.locator('input[name="roomSchedule\\[4\\]\\.endDate"]')
      this.StartTimeRoomSchedule5=page.locator('input[name="roomSchedule\\[4\\]\\.startTime"]')
      this.EndTimeRoomSchedule5=page.locator('input[name="roomSchedule\\[4\\]\\.endTime"]')
      this.RoomStatusRoomSchedule5=page.getByTestId('roomSchedule[4].roomStatus').getByLabel('Room Status *')
      this.txtboxReasonRoomSchedule5=page.locator('[id="roomSchedule\\[4\\]\\.reason"]')
      this.btnSaveRoomSchedule5=page.locator('form').filter({ hasText: 'Room ScheduleLocation *Location *ZoneZoneRoom *Room *Activity Type *Activity Typ' }).getByTestId('Save')

      //Expand Records
      this.btnExpandRow=page.getByLabel('expandRowIconundefined')
      //Delete 5th records
      this.delete5thChildRecord=page.getByRole('cell', { name: 'Room Schedule Activity Type : Test 1 Start Date : 01/12/2023 End Time : 05:00 End Date : 05/12/2023 Room Status : Available Start Time : 02:00 Reason : Added for testing delete hideLabel Activity Type : Test 1 Start Date : 06/12/2023 End Time : 08:00 End Date : 10/12/2023 Room Status : Available Start Time : 05:30 Reason : Added for testing 2 delete hideLabel Activity Type : Test 1 Start Date : 11/12/2023 End Time : 08:00 End Date : 15/12/2023 Room Status : Available Start Time : 05:30 Reason : Added for testing 3 delete hideLabel Activity Type : Test 1 Start Date : 16/12/2023 End Time : 08:00 End Date : 19/12/2023 Room Status : Available Start Time : 05:30 Reason : Added for testing 4 delete hideLabel Activity Type : Test 1 Start Date : 20/12/2023 End Time : 08:00 End Date : 24/12/2023 Room Status : Available Start Time : 05:30 Reason : Added for testing 5 delete hideLabel' }).getByLabel('delete').nth(4)
      this.delete4thChildRecord=page.getByLabel('delete').nth(4)
                                     //getByRole('cell', { name: 'Room Schedule Activity Type : Test 1 Start Date : 01/11/2023 End Time : 05:00 End Date : 05/11/2023 Room Status : Available Start Time : 02:00 Reason : Added for testing delete hideLabel Activity Type : Test 1 Start Date : 06/11/2023 End Time : 08:00 End Date : 10/11/2023 Room Status : Available Start Time : 05:30 Reason : Added for testing 2 delete hideLabel Activity Type : Test 1 Start Date : 11/11/2023 End Time : 08:00 End Date : 15/11/2023 Room Status : Available Start Time : 05:30 Reason : Added for testing 3 delete hideLabel Activity Type : Test 1 Start Date : 16/11/2023 End Time : 08:00 End Date : 19/11/2023 Room Status : Available Start Time : 05:30 Reason : Added for testing 4 delete hideLabel Activity Type : Test 1 Start Date : 20/11/2023 End Time : 08:00 End Date : 24/11/2023 Room Status : Available Start Time : 05:30 Reason : Added for testing 4 delete hideLabel' }).getByLabel('delete').nth(4)
      this.bntYesToDelete=page.getByTestId('Yes')

      //Reschedule 3rd child record
      this.checkbox3rdRecord=page.getByLabel('', { exact: true }).nth(3)
      this.btnRepeatSchedule=page.getByTestId('Repeat Schedule')
      this.txtboxEndDate=page.getByTestId('CommonCellmaPopup').getByPlaceholder('dd/mm/yyyy')
      this.btnSaveEndDatePopup=page.getByTestId('CommonCellmaPopup').getByTestId('Save')

      //Delete Room Availability (Parent)
      this.deleteParentRecord=page.getByRole('cell', { name: 'delete', exact: true }).getByLabel('delete')

        //Add Additional Room
        this.linkAddAdditionalRoom=page.getByTestId('Add Additional Room Schedule')
    }

    //Delete Parent record
    async clickOnParentDeleteicon()
    {
      await this.deleteParentRecord.click()
    }

    //Reschedule 3rd child record
    async clickOn3rdChildCheckbox()
    {
      await this.checkbox3rdRecord.click()
    }
    async clickOnRepeateScheduleButton()
    {
      this.btnRepeatSchedule.click()
    }
    async enterEndDateforRepearSchedule()
    {
      this.txtboxEndDate.fill('30/12/2023')
    }
    async clickOnSaveButtononEndDatePopup()
    {
      await this.btnSaveEndDatePopup.click()
    }
    //Delete Child Records
    
    //Delete 4th Record
    async deletefourthRecord()
    {
      await this.delete4thChildRecord.click()
    }
    //Delete 5th records
    async deleteFifthChildRecord()
    {
      await this.delete5thChildRecord.click()
    }
    async clickOnYesToDelete()
    {
      await this.bntYesToDelete.click()
    }
    //Expand Row
    async clickOnExpandRowButton()
    {
      await this.btnExpandRow.click()
    }

    //Room Shcedule 5
    async selectRoomSchedule1ActivityType5()
    {
       await this.dropdownActivityType5.click()
       await this.page.getByRole('option', { name: 'Test 1' }).click() 
    }

    async selectStartDateRoomSchedule5()
    {
       await this.StartDateRoomSchedule5.type("20/12/2023")
    }
    async selectEndDateRoomSchedule5()
    {
       await this.EndDateRoomSchedule5.type("24/12/2023")
    }
    async selectStartTimeRoomSchedule5()
    {
       await this.StartTimeRoomSchedule5.type("05:30")
    }
    async selectEndTimeRoomSchedule5()
    {
       await this.EndTimeRoomSchedule5.type("08:00")
    }
    async selectRoomStatusRoomSchedule5()
    {
       await this.RoomStatusRoomSchedule5.click()
       await this.page.getByRole('option', { name: 'Available', exact: true }).click()
    }

    async EnterReasonRoomSchedule5()
    {
       await this.txtboxReasonRoomSchedule5.type("Added for testing 5")
      
    }
    async clickOnSaveButtonRoomSchedule5()
    {
       await this.btnSaveRoomSchedule5.click()
    }



    //Room Shcedule 4
    async selectRoomSchedule1ActivityType4()
    {
       await this.dropdownActivityType4.click()
       await this.page.getByRole('option', { name: 'Test 1' }).click() 
    }

    async selectStartDateRoomSchedule4()
    {
       await this.StartDateRoomSchedule4.type("16/12/2023")
    }
    async selectEndDateRoomSchedule4()
    {
       await this.EndDateRoomSchedule4.type("19/12/2023")
    }
    async selectStartTimeRoomSchedule4()
    {
       await this.StartTimeRoomSchedule4.type("05:30")
    }
    async selectEndTimeRoomSchedule4()
    {
       await this.EndTimeRoomSchedule4.type("08:00")
    }
    async selectRoomStatusRoomSchedule4()
    {
       await this.RoomStatusRoomSchedule4.click()
       await this.page.getByRole('option', { name: 'Available', exact: true }).click()
    }

    async EnterReasonRoomSchedule4()
    {
       await this.txtboxReasonRoomSchedule4.type("Added for testing 4")
      
    }
    async clickOnSaveButtonRoomSchedule4()
    {
       await this.btnSaveRoomSchedule4.click()
    }

     //Room Shcedule 3
     async selectRoomSchedule1ActivityType3()
     {
        await this.dropdownActivityType3.click()
        await this.page.getByRole('option', { name: 'Test 1' }).click() 
     }

     async selectStartDateRoomSchedule3()
     {
        await this.StartDateRoomSchedule3.type("11/12/2023")
     }
     async selectEndDateRoomSchedule3()
     {
        await this.EndDateRoomSchedule3.type("15/12/2023")
     }
     async selectStartTimeRoomSchedule3()
     {
        await this.StartTimeRoomSchedule3.type("05:30")
     }
     async selectEndTimeRoomSchedule3()
     {
        await this.EndTimeRoomSchedule3.type("08:00")
     }
     async selectRoomStatusRoomSchedule3()
     {
        await this.RoomStatusRoomSchedule3.click()
        await this.page.getByRole('option', { name: 'Available', exact: true }).click()
     }

     async EnterReasonRoomSchedule3()
     {
        await this.txtboxReasonRoomSchedule3.type("Added for testing 3")
       
     }
     async clickOnSaveButtonRoomSchedule3()
     {
        await this.btnSaveRoomSchedule3.click()
     }

    //Room Shcedule 2
    async selectRoomSchedule1ActivityType2()
     {
        await this.dropdownActivityType2.click()
        await this.page.getByRole('option', { name: 'Test 1' }).click() 
     }

     async selectStartDateRoomSchedule2()
     {
        await this.StartDateRoomSchedule2.type("06/12/2023")
     }
     async selectEndDateRoomSchedule2()
     {
        await this.EndDateRoomSchedule2.type("10/12/2023")
     }
     async selectStartTimeRoomSchedule2()
     {
        await this.StartTimeRoomSchedule2.type("05:30")
     }
     async selectEndTimeRoomSchedule2()
     {
        await this.EndTimeRoomSchedule2.type("08:00")
     }
     async selectRoomStatusRoomSchedule2()
     {
        await this.RoomStatusRoomSchedule2.click()
        await this.page.getByRole('option', { name: 'Available', exact: true }).click()
     }

     async EnterReasonRoomSchedule2()
     {
        await this.txtboxReasonRoomSchedule2.type("Added for testing 2")
       
     }
     async clickOnSaveButtonRoomSchedule2()
     {
        await this.btnSaveRoomSchedule2.click()
     }

     //Room Shcedule 1
     async selectRoomSchedule1ActivityType()
     {
        await this.dropdownActivityType1.click()
        await this.page.getByRole('option', { name: 'Test 1' }).click() 
     }

     async selectStartDateRoomSchedule1()
     {
        await this.StartDateRoomSchedule1.type("01/12/2023")
     }
     async selectEndDateRoomSchedule1()
     {
        await this.EndDateRoomSchedule1.type("05/12/2023")
     }

     async selectStartTimeRoomSchedule1()
     {
        await this.StartTimeRoomSchedule1.type("02:00")
     }
     async selectEndTimeRoomSchedule1()
     {
        await this.EndTimeRoomSchedule1.type("05:00")
     }

     async selectRoomStatusRoomSchedule1()
     {
        await this.RoomStatusRoomSchedule1.click()
        await this.page.getByRole('option', { name: 'Available', exact: true }).click()
     }

     async EnterReasonRoomSchedule1()
     {
        await this.txtboxReasonRoomSchedule1.type("Added for testing")
       
     }
     async clickOnSaveButtonRoomSchedule1()
     {
        await this.btnSaveRoomSchedule1.click()
     }


    //Add Additional Room
    async ClickOnAddAdditionalRoomLink1()
    {
        await this.linkAddAdditionalRoom.click()
    }
    //Edit Room Details
    async ClickOnEditRoomDetails()
    {
        await this.btnEditRecords.click()
    }
    //Search Room
    async selectRoomLocation()
    {
        await this.dropdownSearchLocation.click()
        await this.page.getByRole('option', { name: 'Cardio Location' }).click()
    }

    async clickOnSearchRoomButton()
    {
        await this.btnSearchRooms.click()
    }
    //Room Availability
    async clickOnSetRoomsSchedule()
    {
        await this.linkSetRoomsSchedule.click()
    }
    async clickOnSaveButton()
    {
        await this.btnSave.click()
    }
    //locator('form').filter({ hasText: 'Room AvailabilityLocation *Location *ZoneZoneRoom *Room *Start Date *Start Date ' }).getByTestId('Save')
    async clickOnSaveButtonRoomAvailability()
    {
        await this.btnSaveRoomAvailability.click()
    }
    async enterReason()
    {
        await this.txtboxReason.type("Room added for testing ")
    }
    async selectRoomStatus()
    {
        await this.dropdownRoomStatus.click()
        await this.page.getByRole('option', { name: 'Available', exact: true }).click()
    }
    async selectEndTime()
    {
        await this.clockEndTime.type("23:00")
    }
    async selectStartTime()
    {
        await this.clockStartTime.type("01:00")
    }
    async selectEndDate()
    {
        await this.calendarEndDate.type("30/12/2023")
    }
    async selectStartDate()
    {
        await this.calendarStartDate.type("01/12/2023")
    }
    async selectDropdownRooms()
    {
        await this.dropdownRooms.click()
        await this.page.getByRole('option', { name: 'Room A' }).click()
    }
    async selectDropdownZone()
    {
        await this.dropdownZone.click()
        await this.page.getByRole('option', { name: 'Zone 1' }).click()
    }
    async selectDropdownLocation()
    {
        await this.dropdownLocation.click()
        await this.page.getByRole('option', { name: 'Cardio Location' }).click()

    }
    async clickOnSearchButton()
    {
        await this.btnSearch.click()
    }
    async clickOnSetRoomsScheduleLink()
    {
        await this.linkSetRoomsSchedule.click()
    }
    async clickonBackButton()
     {
       await this.btn_BackButton.click()
     }
    async clickOnSaveButton()
    {
        await this.btn_SaveButton.click()
    }
}
module.exports=SetRooms