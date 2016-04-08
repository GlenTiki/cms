//**********************

//              yyyyy

// ************************


var genericApp =  angular.module('genericApp');

// check if all of these still in use attendeedetails???
 
genericApp.directive('yyyyy', ['CloudServices','$compile', '$templateCache', 'OrganisationStateTemplate1',
 
     function(cloudServices, $compile, $templateCache,orgState) {
	
// a directive to allow a list of names to be edited
 	var getTemplateUrl =  function() { return  "js/directives/templates/attendees/seminarattendees_template1_template1.html"; };
 	 
  return {
	   // this could become switchable if necessary
	   templateUrl: "js/directives/templates/xxxxx.html",
     
	restrict: 'E',
    scope: { // local $scope
	  
    },
	
	link : function(scope, element, attrs)
	{
		 		
	 
	},   // link
	
   controller:   function($scope
   ) { // not dollar
           console.log("organisational details  controller");
 
		
		// always get the latest state
		$scope.formData = orgState.formData;
		$scope.formMeta = orgState.formMeta;
	  $scope.fn = orgState.fn; // 1:1 name between scope and state
 	
		// wire back to parent formData
		// $scope.attendees = $scope.formData.attendees;
  

	 } // controller
  };
}]);
