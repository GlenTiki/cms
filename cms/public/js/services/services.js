'use strict';

/* services.js */

// don't forget to declare this service module as a dependency in your main app constructor!
var appServices = angular.module('appServices', []);
 
appServices.factory('xxxx', function( ) {

 }); 
 // service / factory  
appServices.service('MyService', function($http,$q) {
    var myData = null;
	var fileFound = false;

	// change the filename to generate an error to see how handled
    var promise = $http.get('data.json').then(function (data) {    // always return to the form for feedback or reroute??
									  myData = data;
									  fileFound = true;
								//	  return $q.resolve(data);   // data going back twice
									},
									function (response) {
									// called asynchronously if an error occurs
									// or server returns response with an error status.
									   myData = { "error" : response };
									   fileFound = false;
									//   return $q.reject(myData);
								  });

    return {
					  promise : promise,             // then/error used in the controller also
					  setData : function (data) {
								  myData = data;
							  },
					  
					  getfileFound : function () { return fileFound; } ,
					  
					  doStuff : function () {
								  return myData;//.getSomeData();
							  }
				};
});

 