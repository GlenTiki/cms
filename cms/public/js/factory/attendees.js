'use strict';

 // is this used yet????????????????????????????

// don't forget to declare this service module as a dependency in your main app constructor!
var appAttendees = angular.module('Attendees', []);

 
appAttendees.factory('attendees', function( ) {
 
			 var editIndex = -1; // to ensure first entry is permitted vs update
             var readyState = false;
			 var queryLimit = 50;
			 var attendeePositions = null;
			 var defaults = { 'surname':'', 'forename': '', 'position':'', 'lunch' : false};
			 var editDetails = { 'surname':'', 'forename': '', 'position':'', 'lunch' : false};
		     var maxEntries = 10;
			 var collected_entries = [];

			return{
	
				max : maxEntries,
				
		 		collected : function(){ return collected_entries},
				
				ready : function(){ return readyState},
				setMaxEntries : function(m) { maxEntries = m },			
				setQueryLimit : function(limit) { queryLimit = limit },
				
				
				initialise : function(limit)
				{
				var lim = limit || queryLimit;
				cloudServices.getAllClass2("attendeePositions",lim, true).then(function(results) {
					     readyState = true;
						 attendeePositionOptions = results;
						}, 
						function(reason) { //error
						  readyState = false;
						  attendeePositionOptions = null;    
						});
				},
				
				addAttendeeRow : function(){		
				    
				   if (editIndex == -1)
				   {  // new entry
							collected_entries.push( editDetails );			 
				   }
				   else
				   { // update existing entry
			             collected_entries[editIndex] =   editDetails;
				   }
				    // always sort after a change 
					details = angular.copy(defaults);
 
					//_.map(attendees, function(element) {console.log(element.lastname + " " + element.firstname);});
					editIndex = -1;
				},
				
				removeAttendeeRow : function(dIndex){		
                        if (editIndex == dIndex)
						{
							details = angular.copy(defaults);
						}							
						collected_entries.splice( dIndex, 1 );		
					},			 
				 
				editAttendeeRow  : function(dIndex){				
						editIndex = dIndex;
						details = angular.copy(collected_entries[dIndex]);
					},				

				resetAttendee	 : function() {
						editDetails = angular.copy(defaults);
				}		
 
		} // return
    
 }); 