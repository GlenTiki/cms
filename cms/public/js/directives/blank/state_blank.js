var appEventService = angular.module('ViewStates', []);

appEventService.service('OrganisationStateTemplate1',  [ 'CloudServices',  function(cloudServices) {
	
	// used to store state for the organisation's details of the \events attendee list  
	var myState = {};
	
	      // meta data on roll no = sectorNo
				//  county  county_region 
	 		  var organisationDefaults =  	{
										"id": -1,
										"name":    "",  
										"address1":  "",
										"address2":  "",
										"address3":  "",
										"address4":  "",
										"postcode":  "",
										"county_region" : "",
								 
										"sectorNo": "",
										"contact_name": "",
										"email": "",
										"telephone": "",
										"fax": ""
									}; 
									
				var organisationSelections = { 'list' : [{ 'orgId' : 1234, 'name' : 'school1' }, { 'orgId' : 7234, 'name' : 'school2' }]}
	

				myState.fn = {}   // functions to be wired back on the form
				myState.formMeta = {}  // data about the state of the data supplied by the user etc
			 
		    myState.formData = angular.copy(organisationDefaults); 
				myState.formMeta.organisationList = angular.copy(organisationSelections); 
		    // supplied  by the parent myState.formMeta.organisationType = "Organisation";
		 	  
 
				
	// functions			
				
				myState.fn.resetCurrentEdit =  function()
				{
					myState.formMeta.currentEditTemp =  angular.copy(organisationDefaults);
					myState.formMeta.currentEditTempIndex = -1;
					return myState.formMeta;
				};
				
				myState.fn.resetCurrentEdit(); // setup the data state
				
				myState.fn.getAttendees =  function()
				{
					 return myState.formData.attendees;
				};
				
				myState.fn.removeAttendeeRow = function(dIndex){		
            if (myState.formMeta.currentEditTempIndex == dIndex)
						{
							 myState.resetCurrentEdit();
						}							
						myState.formData.attendees.splice( dIndex, 1 );		
					};	

	 myState.fn.addAttendeeRow = function(){		
				    
				   if (myState.formMeta.currentEditTempIndex == -1)
				   {  // new entry
				 
		 						myState.formData.attendees.push( myState.formMeta.currentEditTemp );			 
				   }
				   else
				   { // update existing entry
			             myState.formData.attendees[myState.formMeta.currentEditTempIndex] =   myState.formMeta.currentEditTemp;
				   }
				    // always sort after a change ??? 
 
						myState.fn.resetCurrentEdit(); // clear the form for next name
				};	 

				myState.fn.editAttendeeRow = function(dIndex){				
						myState.formMeta.currentEditTempIndex = dIndex;
						myState.formMeta.currentEditTemp = angular.copy(myState.formData.attendees[dIndex]);
					};							
				
	// end functions			
				
				

	return myState; 
}]);