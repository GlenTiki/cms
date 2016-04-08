
// https://docs.angularjs.org/guide/concepts
// http://leftshift.io/8-tips-for-angular-js-beginners/

var genericApp =  angular.module('genericApp', [ // list the required modules, angular, third party, app specific
  'ng',
  'ngRoute',
	'ngAnimate',
	'ui.bootstrap',   // modal etc
	'ui',
  'appControllers',
	'CloudServices', /* parse as well */
	'Authorised',
	'nrzLightify',
	'angularModalService',  // ? remove this
	'vcRecaptcha',
	'angular-table',
	'rlModalsServices',
	 
	'rlCloudServicesPagination',
	'ViewStates',
	'appServices'   // resolve promise to controller example
	// load error  'angular-tabs'
 ]);

genericApp.config(['$routeProvider','$httpProvider', '$provide',  '$locationProvider',
      function($routeProvider, $httpProvider, $provide,  $locationProvider ) {
// You can not ask for instance during configuration phase - you can ask only for providers.	 
console.log("genericApp.config")	  // runs once only

//  Force AngularJS to call our JSON Web Service with a 'GET' rather than an 'OPTION' 
//  Taken from: http://better-inter.net/enabling-cors-in-angular-js/	  
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];	  
	  
		  
		
		
			$routeProvider.
			
					  when('/seminar', {						 
								templateUrl : './partials/events.html',
								controller : 'EventsCtrl'  ,
								resolve : {
						 	    'EventStateData'  : function(EventState){  // notice parameter is Uppercase, key is placebo
									 	 	       return EventState.eventPromise("xyz001");  // simply returning the promise
							 	  } 
								} 	
 							
					  }).					
					  when('/home', {
						templateUrl: './partials/home.html',
						controller: 'HomeCtrl'
					  }).
	
					  when('/events/:appCustomerId', {
								templateUrl : './partials/events.html',
								controller : 'EventsCtrl'  ,
								resolve : {
						 	    'EventStateData'  : function(EventState,$route, $location){  // notice parameter is Uppercase, key is placebo
									 // $routeParams is only availabe after the route change
									 console.log($location.path());
									 console.log($route.current.params.appCustomerId);
					 
								// console.log("cId = "+ EventState.DS.filter.constraints[0].equalTo[0].cId)
								       // the promise needs to know the customer id
 						 	 	       return EventState.eventPromise($route.current.params.appCustomerId);  // simply returning the promise			   
							 	  }
							//		,
							//	 'EventStateDataPositions'  : function(EventState,$route)
							//	 {
							//		 return EventState.eventPromisePositions($route.current.params.appCustomerId);
							//	 }
								} 			 
					  }).						
					  when('/events', {
						 		// this page should allow for choice of customer if none provided			
					 
								templateUrl : './partials/events.html',
								controller : 'EventsCtrl'   

						 
 							
					  }).					  
					  when('/about', {
						templateUrl: './partials/about.html',
						controller: 'AboutCtrl'
					  }).		  
					  otherwise({
						redirectTo: '/events'
					  });
						
			   //routing DOESN'T work without html5Mode
      // caused route issues home#events etc  $locationProvider.html5Mode(true); //   <base href="/"> index.html
				
	// http://stackoverflow.com/questions/24091513/get-state-of-angular-deferred	
	// add more logic to deffer promises to check state
	 $provide.decorator('$q', function ($delegate) {
    var defer = $delegate.defer;
    $delegate.defer = function() {
      var deferred = defer();
      
      deferred.promise.state = deferred.state = 'pending';
      
      deferred.promise.then(function() {
        deferred.promise.state = deferred.state = 'fulfilled';
      }, function () {
        deferred.promise.state = deferred.state = 'rejected';
      }); 
      
      return deferred;
    };
    return $delegate;
  });					
						
  }]);


// Parse is initialised by injecting the ParseService into the Angular app
 genericApp.run([   '$rootScope',  '$route', 'Data', '$location', 'authorisedUser', 'CloudServices',   'nrzLightify', 'ModalService',  
                     function( $rootScope, $route, Data, $location, authorisedUser, cloudServices , nrzLightify , ModalService   ) { 
 
						 
	/* main, kickstart code */	

//	cloudServices.initialize(); //  	
  $rootScope.cId = "xyz001";
	console.log("genericApp.run");
	$rootScope.redirectTo = "/home";


 
 // remember previous login status
 // this is for login and login
  $rootScope.user = {}; 
  
  	
		$rootScope.$watch(function() {return cloudServices.isCloudReadSemaphore();}, function (newValue, oldValue) {
				$rootScope.CloudReadSemaphore = newValue; 
				if  (newValue == 0)
				{
			 	$("#backgroundPopup").fadeOut("normal");
					 
				}
			 
			},true);	
		  
 
		$rootScope.notifyMe = function(type, delaySeconds, msg,positionI) {
					// type = success || info || warning || danger  
					nrzLightify({
				type: type,
				text: msg,
				position : positionI || "bottom-right"
				}, delaySeconds);
                 };	
		
   
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
		/* detect route changes */
	// only works forfiles	console.log('$routeChangeStart: trying for: ' + next.$$route.templateUrl);
		
		//$rootScope.isCloudReadSemaphore = 0;   // semaphore in case of quick changes to 
		
	//	$rootScope.isCloudReadSemaphore = cloudServices.resetCloudReadSemaphore();
		
		
		$rootScope.redirectTo = next.originalPath;
		
		// lodash this
		// next.$$route.controller might be more flexible
		
		// PUBLIC PAGES requiring no login
		// next.$$route.originalPath
		console.log("next.$$route.originalPath: " + next.$$route.originalPath);
		if ( 	
		
 
		    next.$$route.originalPath == "/about" 	||
				next.$$route.originalPath == "/login"	||
			//	next.$$route.originalPath == "/tests"	||
				next.$$route.originalPath.indexOf("/events") > -1 ||
				next.$$route.originalPath.indexOf("/seminars") > -1 ||
				next.$$route.originalPath.indexOf("/workshops") > -1  
				)
		{
			 ; // allow through to unsecure pages i.e. not authorised
		}
		else
		
		if (! authorisedUser.isLoggedIn())
		{
			console.log('not authorised');
			//event.preventDefault();
		 	$location.path('/login');
		}
		else
		{
			console.log('Allow route');
		}	
 
		});		  
		  
		   
			  // watch for a change in status to the authorisedUser
		  $rootScope.$watch(authorisedUser.user, function (value, oldValue) {
				console.log('authorisedUser.isLoggedIn change, oldValue = ' + oldValue	);
									if(!value && oldValue) {
										 //	event.preventDefault();										event.preventDefault();
											console.log("Disconnect");
									//		$rootScope.loggedIn = false;
											Parse.User.logOut();
											authorisedUser.setUser(null);
											$rootScope.currentUser = null;
											$rootScope.user = {}; // clear the form data
										 
									//  $location.path('/login'); // route elsewhere
									}

									if(value) {
									//		$rootScope.loggedIn = true;
											console.log("Connected");
											$route.reload();  // or go to a  route
									  //Do something when the user is connected
									}

								  }, true);			  
		  
	
	  $rootScope.globalTest = function(callee) {   // global function available to all controllers  as in $rootScope via  $scope.globalTest()
						console.log('hello via globalTest, from ' + callee + ' created in app.run()');
					  }
 
   Data.setuName("**shared data between /home and /login, edit me and check");


 // Parse.initialize(parseAppKey, parseJSKey ); // this is asynch hence next line will run before possible value?
 // $rootScope.scenario = 'Sign up';
  $rootScope.scenario = 'Log in'
  
   
  
    $rootScope.navAuthentication = function(mode) { // display a login or signup form
				$rootScope.scenario = mode;
				authorisedUser.setUser(null);  // triggers a watch to logout the user and reset data
				$location.path("/login");
  };	
 
  
}]); //App.run()


 // allow for sharing data across controllers
 genericApp.factory('Data', function(){
    var data =
        {
            uName: ''
        };
    
    return {
        getuName: function () {
            return data.uName;
        },
        setuName: function (uN) {
            data.uName = uN;
        }
    };
});


genericApp.filter('parseInt', function() {
    return function(input) {
      return parseInt(input, 10);
    }
});
 
/*
var genericApp =  angular.module('genericApp');

 
 genericApp.value('uiSortableConfig',{}) // http://jsfiddle.net/hKYWr/784/
   .directive('uiSortable', [ 'uiSortableConfig',
        function(uiSortableConfig) {
        return {
          require: '?ngModel',
          link: function(scope, element, attrs, ngModel) {

              function combineCallbacks(first,second){
                  if( second && (typeof second === "function") ){
                      return function(e,ui){
                          first(e,ui);
                          second(e,ui);
                      };
                  }
                  return first;
              }

            var opts = {};

            var callbacks = {
                receive: null,
                remove:null,
                start:null,
                stop:null,
                update:null
            };

            angular.extend(opts, uiSortableConfig);

            if (ngModel) {

              ngModel.$render = function() {
                element.sortable( "refresh" );
              };

              callbacks.start = function(e, ui) {
                // Save position of dragged item
                ui.item.sortable = { index: ui.item.index() };
              };

              callbacks.update = function(e, ui) {
                // For some reason the reference to ngModel in stop() is wrong
                ui.item.sortable.resort = ngModel;
              };

              callbacks.receive = function(e, ui) {
                ui.item.sortable.relocate = true;
                // added item to array into correct position and set up flag
                ngModel.$modelValue.splice(ui.item.index(), 0, ui.item.sortable.moved);
              };

              callbacks.remove = function(e, ui) {
                // copy data into item
                if (ngModel.$modelValue.length === 1) {
                  ui.item.sortable.moved = ngModel.$modelValue.splice(0, 1)[0];
                } else {
                  ui.item.sortable.moved =  ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0];
                }
              };

              callbacks.stop = function(e, ui) {
                // digest all prepared changes
                if (ui.item.sortable.resort && !ui.item.sortable.relocate) {

                  // Fetch saved and current position of dropped element
                  var end, start;
                  start = ui.item.sortable.index;
                  end = ui.item.index();

                  // Reorder array and apply change to scope
                  ui.item.sortable.resort.$modelValue.splice(end, 0, ui.item.sortable.resort.$modelValue.splice(start, 1)[0]);

                }
                if (ui.item.sortable.resort || ui.item.sortable.relocate) {
                  scope.$apply();
                }
              };

            }


              scope.$watch(attrs.uiSortable, function(newVal, oldVal){
                  angular.forEach(newVal, function(value, key){

                      if( callbacks[key] ){
                          // wrap the callback
                          value = combineCallbacks( callbacks[key], value );
                      }

                      element.sortable('option', key, value);
                  });
              }, true);

              angular.forEach(callbacks, function(value, key ){

                    opts[key] = combineCallbacks(value, opts[key]);
              });

              // Create sortable

            element.sortable(opts);
          }
        };
      }
]);
*/