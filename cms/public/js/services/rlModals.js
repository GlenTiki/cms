'use strict';

// candidate for refactoring in the future

// modals available, with suitable colour banner and buttons

// showErrorModal               - one button
// shownInformationModal        - one button
// showConfirmationModal        - two buttons
// showModalChooser             - two buttons
// showModalChooserPagination   - two buttons


// need to code information with just an okay
 
// don't forget to declare this service module as a dependency in your main app constructor!
var rlModalServices = angular.module('rlModalsServices', ['ui.bootstrap']);

 
rlModalServices.factory('rlModals', ['$uibModal',  '$filter', function( $uibModal, $filter) {
	
	
	
	 ///////////////////////////////  Dynamic Modal for printing 
 //   use a config options parameter to highly customise this modal via angular
 // one of the buttons is a print feature, the other closes
   var showDynamicPrintModal2 = function (imsg) {
       
	var msg = imsg || { "title" : "Dynamic", "text" : "provide the message here" } ;
	
		 // controller for the Dynamic modal
		 // handle the buttons etc via the controller
		 var ModalDynamicInstanceCtrl = function ($scope, $modalInstance, message) { // DynamicMessage comes from the resolve
		 
		      var okayDefault  = function () {  // positive action
													//	$modalInstance.close("okay");
													//  leave form displayed
													   window.print(); // form stays displayed cancel/dismiss only way out
													  };
														
					var cancelDefault  = function () {  // cancel action
												    $modalInstance.dismiss('cancel');
													  };									
														
		      var okayFn = message.buttons.okay.fn ||  okayDefault;
					var cancelFn = message.buttons.cancel.fn ||  cancelDefault;
					
											$scope.modalMessage = message;
											
											$scope.ok =  okayFn;

										  $scope.cancel = cancelFn; // negative action
													 
		};	
		  

    var modalInstanceDynamic = $uibModal.open({
      templateUrl: './partials/modals/modalDynamic.html',
      controller: ModalDynamicInstanceCtrl,  // a separate var do a search
      resolve: { // a promise,  This fires up before controller loads and templates rendered
                      // can be used for aysnch getting of data 
        message  :   function () {
						   						return msg ;
									}  
		}
    }); // open
	
		return modalInstanceDynamic; // let the caller handle the return values 
 
   } // showDynamicPrintModal2	
	
	
	
	
 ///////////////////////////////  Dynamic Modal 2 
 //   use a config options parameter to highly customise this modal via angular
   var showDynamicModal2 = function (imsg) {
       
	var msg = imsg || { "title" : "Dynamic", "text" : "provide the message here" } ;
	
		 // controller for the Dynamic modal
		 // handle the buttons etc via the controller
		 var ModalDynamicInstanceCtrl = function ($scope, $modalInstance, message) { // DynamicMessage comes from the resolve
		 
											$scope.modalMessage = message;
											$scope.ok = function () {  // positive action
														$modalInstance.close("okay");
													  };

										  $scope.cancel = function () { // negative action
														$modalInstance.dismiss('cancel');
													  };
		};	
		  

    var modalInstanceDynamic = $uibModal.open({
      templateUrl: './partials/modals/modalDynamic.html',
      controller: ModalDynamicInstanceCtrl,  // a separate var do a search
      resolve: { // a promise,  This fires up before controller loads and templates rendered
                      // can be used for aysnch getting of data 
        message  :   function () {
						   						return msg ;
									}  
		}
    }); // open
	
		return modalInstanceDynamic; // let the caller handle the return values 
 
   } // showDynamicModal2	
	
	
 
 ///////////////////////////////  Information Modal 1 buttons  
  var showInformationModal2 = function (imsg) {
          // msg = { "title" : "Feedback", "text" : "the feedback message" }
	var msg = imsg || { "title" : "Feedback", "text" : "provide the feedback message" } ;
	
	
		 // controller for the error modal
		 // handle the buttons etc via the controller
	var ModalInformationInstanceCtrl = function ($scope, $modalInstance, message) { // errorMessage comes from the resolve
		 
										 $scope.modalMessage = message;
										  $scope.cancel = function () {
														$modalInstance.dismiss('cancel');
													  };
		};	
 
    var modalInstanceInformation = $uibModal.open({
      templateUrl: './partials/modals/information.html',
      controller: ModalInformationInstanceCtrl,  // a separate var do a search
      resolve: { // a promise,  This fires up before controller loads and templates rendered
                      // can be used for aysnch getting of data 
        message  :   function () {
						   						return msg ;
									}  
		}
    }); // open
	
		return modalInstanceInformation; // let the caller handle the return values 
 
   } // showInformationModal2
 
 
 
 
 ///////////////////////////////  Error Modal 2 buttons  
   var showErrorModal2 = function (imsg) {
          // msg = { "title" : "Serious Error", "text" : "the error message" }
	var msg = imsg || { "title" : "Serious Error", "text" : "provide the message" } ;
	
	
		 // controller for the error modal
		 // handle the buttons etc via the controller
		 var ModalErrorInstanceCtrl = function ($scope, $modalInstance, message) { // errorMessage comes from the resolve
		 
										 $scope.modalMessage = message;
										 /*
										 $scope.ok = function () {
													//	$modalInstance.close($scope.selected.item);
													console.log("okay");
													  };*/

										  $scope.cancel = function () {
														$modalInstance.dismiss('cancel');
													  };
		};	
		  
	   
    var modalInstanceError = $uibModal.open({
      templateUrl: './partials/modals/error.html',
      controller: ModalErrorInstanceCtrl,  // a separate var do a search
      resolve: { // a promise,  This fires up before controller loads and templates rendered
                      // can be used for aysnch getting of data 
        message  :   function () {
						   						return msg ;
									}  
		}
    }); // open
	
		return modalInstanceError; // let the caller handle the return values 
 
   } // showErrorModal2
   
  ///////////////////////////////  Error Modal 2 buttons  
	
 ///////////////////////////////  Confirmation Modal 2 buttons
 
    var showConfirmationModal2 = function (imsg) {
          // msg = { "title" : "Confirm", "text" : "the  message" }
		var msg = imsg || { "title" : "Confirm", "text" : "the  message" }
	
	
		 // controller for the Confirm modal
		 // handle the buttons etc via the controller
		 var ModalConfirmationInstanceCtrl = function ($scope, $modalInstance, message) { // confirmationMessage comes from the resolve
		 
										 $scope.modalMessage = message;

										  $scope.ok = function () {

										  console.log("okay");
										  $modalInstance.close("okay");
										  };

										  $scope.cancel = function () {
											$modalInstance.dismiss('cancel');
										  };
		};	
		  
	   
    var modalInstanceConfirm = $uibModal.open({
      templateUrl: './partials/modals/confirmation.html',
      controller: ModalConfirmationInstanceCtrl,  // a separate var do a search
      resolve: { // passes parameters to ModalConfirmationInstanceCtrl  
				// a promise,  This fires up before controller loads and templates rendered
                // can be used for aysnch getting of data 
        message  :   function () {
						   			return msg ;
									}  
		}
    }); // open
	
	 return modalInstanceConfirm; // let the caller handle the return values 
 
   } // showConfirmationModal2
 
 ///////////////////////////////  Confirmation Modal 2 buttons End
	 
///////////////////////////////  Modal Chooser

 // would need a separate version for each specific use if
 // data presentation is different
 var showModalChooser1_2 = function (imsg,idata) {
	 
	        var msg = imsg || { "title" : "Confirm", "text" : "the  message" }
			var data = idata || {"text" : "no data model provided"};
			
			// the controller for the dialog, takes over after the open
			var ModalInstanceCtrl = function ($scope, $modalInstance, message, dataObjectIn) {
                    // these funtions will be problem specific?
			                     // var data = dataObjectIn;
								  $scope.items = dataObjectIn;
								  
								  $scope.modalMessage = message;
								  $scope.selected = {
									item: $scope.items[0]
								  };

								  $scope.ok = function () {
									$modalInstance.close($scope.selected.item);
								  };

								  $scope.cancel = function () {
									$modalInstance.dismiss('cancel');
								  };	
			};								  
 
    var modalInstance = $uibModal.open({
      templateUrl: './partials/modals/modalChooser.html',
      controller: ModalInstanceCtrl,   // a separate var do a search
      resolve: { // a promise,  This fires up before controller loads and templates rendered
  
		message  :   function () {
						   			return msg ;
								},  
	      dataObjectIn: function () {
						  return data; // see instance its a parameter
						} 							
      }
    });
	
	return modalInstance; // let the caller handle the return values 
/*
    modalInstance.result.then(function (selectedItem) { // promise to catch the modal result
      $scope.selected = selectedItem;
	  console.log($scope.selected);	  
    }, function () {
      //$log.info('Modal dismissed at: ' + new Date());
	  console.log('Modal dismissed at: ' + new Date());
    });
	*/
  };
  
///////////////////////////////  Modal Chooser end 


///////////////////////////////  Modal Chooser Pagination 
 var showModalChooserPagination1_2 = function (imsg, idata, imeta) {
	 
	    var msg = imsg || { "title" : "Confirm", "text" : "the  message" }
			var data = idata || {"text" : "no data model provided"};
			var meta = imeta || {"toShow" : [{"field": "name"}], "filter2" : null };

			// the controller for the dialog, takes over after the open
			var ModalInstanceCtrl = function ($scope, $modalInstance, message, dataObjectIn, metaData) {
                    // these funtions will be problem specific?
					console.log("pagination ModalInstanceCtrl, still need large data set global paging");
			                     // var data = dataObjectIn;
 							 
							//	  $scope.items = dataObjectIn;
								  
								  $scope.modalMessage = message;
		 
								 // setup the pagination data 
								 
								 $scope.selectedChoice = null; // the current choice
								 $scope.query = {};
							  //  $scope.query.filter2 = "";
							   $scope.filter2 = "";   // this fields value will be allocated to $scope.fields_meta.filter2 for the actual $filter

								$scope.config = {
											itemsPerPage: 5,
											maxPages: 5,        // to show before condensing the naviagation
											fillLastPage: false
										  };		
										  
                                $scope.originalList = dataObjectIn
								$scope.filteredList = dataObjectIn // $scope.paginationChooserList;		 // filter may be empty								  
								$scope.validData = dataObjectIn.length;
								
 							
								$scope.fields_meta = {}
	    	//metaData. "toShow"   : [ {"field": "name"}, {"field": "county"}, {"field": "email"}];
			//metaData.filter2
			
			                    // prepare the fields to be displayed
								$scope.fields_meta.toShow = metaData.toShow ||  [{"field": "name"}];
                               // is there a second field filter present
								$scope.fields_meta.filter2 =  metaData.filter2 ||  null // this is 2nd filter
							//	$scope.fields_meta.filter2 = {"filter": "email"};  // this is 2nd filter
 					
								// functions for buttons and filtering
								  
					  			  $scope.updateFilteredList = function() {
												   // apply a filter to our data source
												   
												  $scope.query[$scope.fields_meta.filter2] = $scope.filter2
		 
													$scope.filteredList = $filter("filter")($scope.originalList, $scope.query);
									  };		
								  
							$scope.makeSelection = function(i) {
				                      //  alert(i + " need page no (0 based)= " + $scope.config.currentPage );
										var offset = $scope.config.currentPage * $scope.config.itemsPerPage + i;
										$scope.selectedChoice =  $scope.filteredList[offset];
										};
										
						$scope.clearFilter1 = function () {
									$scope.query.$ = "";
									$scope.filteredList = $filter("filter")($scope.originalList, $scope.query);
								  };	
								  
							$scope.clearFilter2 = function () {
								   $scope.filter2 = "";
									$scope.query[$scope.fields_meta.filter2] = "";
									$scope.filteredList = $filter("filter")($scope.originalList, $scope.query);
								  };												
 
							$scope.select = function () {
												$modalInstance.close($scope.selectedChoice);
											  };

							$scope.cancel = function () {
												$modalInstance.dismiss('cancel');
											  };	
			};								  
 
    var modalInstance = $uibModal.open({
      templateUrl: './partials/modals/modalChooserPagination.html',
      controller: ModalInstanceCtrl,   // a separate var do a search
      resolve: { // a promise,  This fires up before controller loads and templates rendered
  
		  message  :   function () {
						   			return msg ;
								},  
	      dataObjectIn: function () {
						  return data; // see instance its a parameter
						} ,
		 metaData  :   function () {
						   			return meta;
								},  
						
 						
      }
    });
	
	return modalInstance; // let the caller handle the return values 
	
	 };
///////////////////////////////  Modal Chooser Pagination End
	 
	 
// dynamic modal config

// Single Button for Warning, Error, Information

// Change the header for emphasis

	    var SingleButtonConfig2 =  function()
			{			
					return		{  "header"    : { "class": "", "style" : "" },		
												"footer"    : { "class": "", "style" : "" },													
												"body"    : { "class": "", "style" : ""},						
												"buttons" : { "cancel" : {"visible" : true, "text" : "Cancel", "class": "", "style" : ""} },
	             					"title" : { "text" : "","class": "", "style" : "" },
												"subtitle" : { "text" : "", "class": "", "style" : "" },																			
												"content" : [ { "text" : "", "class": "", "style" : "" }  ] 																	
												};
			};
			
			
			var getErrorConfig2 =  function()
			{			
					return		{  "header"    : { "class": "errorstateModal", "style" : "" },		
												"footer"    : { "class": "", "style" : "" },													
												"body"    : { "class": "", "style" : ""},						
												"buttons" : { "cancel" : {"visible" : true, "text" : "Cancel", "class": "", "style" : ""} },
	             					"title" : { "text" : "Error","class": "", "style" : "" },
												"subtitle" : { "text" : "", "class": "", "style" : "" },																			
												"content" : [ { "text" : "", "class": "", "style" : "" }  ] 																	
												};
			};

// Single Button End	 
	 
// confirmation amber style	      

	var confirmation2 =  function() {  
	                      return {
						
												"header"    : { "class": "confirmstate", "style" : "" },		
												"footer"    : { "class": "", "style" : "" },																													
												"body"    : { "class": "", "style" : ""},											 
												"buttons" : { "okay" : {"visible" : true, "text" : "Okay", "class": "", "style" : ""},
																		  "cancel" : {"visible" : true, "text" : "Cancel", "class": "", "style" : ""} 
																		},							
	             					"title" : { "text" : "About to submit data", 
																		"class": "", "style" : "" },
												"subtitle" : { "text" : "Confirm your data is ready:", 
																		"class": "", "style" : "font-size : 1.3em" },																																				
												"content" : [ { "text" : "line1", 
																		"class": "", "style" : "" }
                                  ] 																	
												};
	}
	 
		var information2 =  function() {  
	                      return {
						
												"header"    : { "class": "successstate", "style" : "" },		
												"footer"    : { "class": "", "style" : "" },																													
												"body"    : { "class": "", "style" : ""},											 
												"buttons" : { "okay" : {"visible" : true, "text" : "Okay", "class": "", "style" : ""},
																		  "cancel" : {"visible" : false	, "text" : "Cancel", "class": "", "style" : ""} 
																		},							
	             					"title" : { "text" : "About to submit data", 
																		"class": "", "style" : "" },
												"subtitle" : { "text" : "Confirm your data is ready:", 
																		"class": "", "style" : "font-size : 1.3em" },																																				
												"content" : [ { "text" : "line1", 
																		"class": "", "style" : "" }
                                  ] 																	
												};
	}
	  
	 
	// expose all the functions
	 
	 
	  return {
			showDynamicPrintModal : showDynamicPrintModal2,
			showDynamicModal : showDynamicModal2,
			showInformationModal : showInformationModal2,
		  showErrorModal : showErrorModal2,
		  showConfirmationModal : showConfirmationModal2, 
		  showModalChooser : showModalChooser1_2,
		  showModalChooserPagination   : showModalChooserPagination1_2 ,
			
			getSingleButtonConfig : SingleButtonConfig2,
			getErrorConfig : getErrorConfig2,
			getConfirmationModel : confirmation2,
			getInformationModel : information2
	  }
   
 }]); 