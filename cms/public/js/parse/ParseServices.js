angular.module('ParseServices', ['ExternalDataServices' ])

// exposes: ExtendParseSDK, ParseSDK
// http://brandid.github.io/parse-angular-demo/#/
.factory('ExtendParseSDK', ['ParseAbstractService', function(ParseAbstractService) {

		Parse.Object.extendAngular = function(options) {
			var x  = ParseAbstractService.EnhanceObject(Parse.Object.extend(options));
		//	return ParseAbstractService.EnhanceObject(Parse.Object.extend(options));
		return x;
		  };

	//	Parse.Collection.extendAngular = function(options) {
	//		return ParseAbstractService.EnhanceCollection(Parse.Collection.extend(options));
	//	  };
		  
		  	return {
					extendObject:Parse.Object.extendAngular
			//		extendCollection:Parse.Collection.extendAngular
				};

}]);
/*
// .factory('ParseQueryAngular',['$q','$timeout',function ($q, $timeout) { 
.factory('ParseSDK',     function(ExtendParseSDK  ) {

} );
*/