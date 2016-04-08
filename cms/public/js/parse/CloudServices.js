// see http://ericterpstra.com/2012/10/angularjs-signit-interchangeable-parse-stackmob-and-backbone-services/

angular.module('CloudServices', [])

// refactored functions to use 

 .factory('CloudServices', ['$http','$rootScope', '$q' , function($http, $rootScope, $q){

 
    var cachedData = {};
 
  // pro-tip: swap these keys out for PROD keys automatically on deploy using grunt-replace
    	Parse.initialize(parseAppKey, parseJSKey); // just initialize parse, may not be logged in!!!
 
	//	var Question = Parse.Object.extend("Questions");
	//	var QuestionCollection = ExtendParseSDK.extend({ model: Question });
		var Subject = Parse.Object.extend("Subjects");
	//	var SubjectCollection = Parse.Collection.extend({ model: Subject });
		
		var  cloudReadSemaphore = 0; // ++ for every cloud read, -- success/error, used by the isloading visual

		var normaliseResults = function(results)   // uses lodash map
		{  // take.parse.com returned array of objects and make nice for client  side with .id promoted attributes level
		   // i.e. results does not have the id in the attibutes for each instance

		   // also make a deep copy 
		  var temp;
			var prepared = _.map( results,  function(item, index) { 
			                                          temp = angular.copy(item.attributes);
																								temp.id = item.id; // just place the id with the rest of the object
			                                        //  item.attributes.id = item.id; // just place the id with the rest of the object
																						    delete temp.createdAt; // cased angular $$ hash errors
																								delete temp.updatedAt;
//												   console.log(item.id + " / " + item.attributes.name);
														return    temp }//  there may be no benefit to clone here as issues elsewhere do _.clone(item.attributes, true); if issues???
											);	  	
           return prepared;	
		};
		
		var errorHandlerGeneric = function(results, err) {
			console.log("error: " + err);
		};
		
		// these two are problem settable
		var genericSuccessCallback = function()
		{
			 console.log("cloudServices Success");
		}
		var genericErrorCallback = function(results, err)
		{
			 console.log("cloudServicesError: " + err);
		}		

	 
		 // returns a promise
		var getAllClassGeneric2 = function (target, iLimit, fromCache) {
				var tLimit = iLimit || 200;
 
				var targetClass = Parse.Object.extend(target);
				var query = new Parse.Query(targetClass);
				query.limit(tLimit);
 			
				// have to do the cache check here
 		
				if  (fromCache && cachedData[target]) 
				{
					console.log("cache hit with: "+ target);
					return Parse.Promise.as(cachedData[target]);
				}
				else
				{
							cloudReadSemaphore = cloudReadSemaphore +1 ;
							return query.find().then( function (results) {
																			  var tidied = normaliseResults(results); // results is an array
																			  cloudReadSemaphore = cloudReadSemaphore -1 ;
																			  cachedData[target] = tidied;
																			  return Parse.Promise.as(tidied);
																	},
																	 function (errorResults)
																		  {
																			   cloudReadSemaphore = cloudReadSemaphore -1 ;	
																				cachedData[target] = null;																			   
																			    return Parse.Promise.error(errorResults);
																		  }
																);
					}
			};
		
	var applyConstraintsArray = function (queryArray, constaintName, arrayOfConstraints  )
{
// pagination uses two queries so they are passed in as an array to make life easier	

	 for (var offset in arrayOfConstraints) { // get each constraint from the array
 
                var arrayItem = arrayOfConstraints[offset];
				
			    var classkey =    Object.keys(arrayItem) ; // should only be one key per object in the array
     	 
				/*  if (query) query.equalTo(classkey,arrayItem[classkey]); */
			 
			 // generically set the relevant query method for each passed in query
			 
			 for (var query in queryArray) 
				{   // eg = to query.equalTo(a,b) == query["equalTo"](a,b)
		
								queryArray[query][constaintName](classkey,arrayItem[classkey]);
			    // query[constaintName](classkey,arrayItem[classkey]);
				}
	 	}	
}	 		 
	


var 	paginationStructure = function () 
	 {  // currently not returning targetClass in the meta data
	    return {
		    "_metadata": {	 
						"page_no": 0,
						"per_page_limit": 0,
						"page_record_count" : 0,
						"page_count": 0,
						"total_recordcount": 0  ,
						
                "sorting" : { "ascending" : "", "descending" : "" },
		        "links": {
						"self": "/current page",
						"first": "/first page",
						"previous": "/previous page",
						"next": "/next page",
						"last": "/last page"
		        },
				"constraints" : [],
			
		    },
		    "records": [
		        {
		            "id": 1,
		            "name": "alpha",
		            "uri": "/1"
		        }
		    ]
		};
		} // paginationStructure
 
 
var totalPagesValue = function (recordCount, noRowsPerPage) { // bring to correct integer
			var div = Math.floor(recordCount /  noRowsPerPage );
			div += ((recordCount %  noRowsPerPage ) > 0) ? 1 : 0;
			return div;
		 }
		 
	
// examine the sorting and apply them to the query	 
var queryApplyAllSorts = function(query,sorts)
{
	
	if (sorts.length > 0)
		 {
  					for (var key in sorts) { // iterate through the sorts to handle accordingly
					   var obj = sorts[key];
					   
					   	for (var prop in obj) {

							if(obj.hasOwnProperty(prop)){
								var sortSyntax = obj[prop].replace(" ","");
			 						
								// prop === "containsAll"  ????
								if (prop === "ascending"       || 
								    prop === "descending"   )
									{
//										console.log("build sort");
										query[prop](sortSyntax);
									}
								else
								{
									console.log("Not Processing: " + prop + " = " + JSON.stringify(sortSyntax) + "<br>")
								}   									
							  }
					   }  
					}	
		 } // we had sorts			
} // queryApplyAllSorts		
	
	
// examine the constraints and apply them to the queries	 
var queryApplyAllConstraints = function(queryArray,constraints)
{
	
	if (constraints.length > 0)
		 {
		 
	
  					for (var key in constraints) { // iterate through the constraints to handle accordingly
					   var obj = constraints[key];
					   
					   	for (var prop in obj) {
						  // important check that this is objects own property 
						  // not from prototype prop inherited
							if(obj.hasOwnProperty(prop)){
								var constraintSyntax = obj[prop];
 
								// prop === "containsAll"  ????
								if ( // turn this in to a js object with these as fields?
									prop === "equalTo"              || 
								    prop === "containedIn"          || 
									prop === "notEqualTo"           || 
									prop === "notContainedIn"       ||
									prop === "lessThan"             ||
									prop === "lessThanOrEqualTo"    ||
									prop === "greaterThan"          ||
									prop === "greaterThanOrEqualTo" ||
									prop === "containsAll"								
									)
									applyConstraintsArray(queryArray,prop,constraintSyntax);
								else 
								/*	
								  if (prop === "containsAll")
								  { // these expect a key followed by an array
										applyConstraintsArray(queryArray,prop,constraintSyntax);
								  }
								  else
								*/
									if (   					// is it a key with an array of values
								        prop === "select"   // caught at a higher level as not a contraint
								       )
									{   // the constraint takes an array of key names/values but there is no key
									    queryArray[0][prop](constraintSyntax);
									  	queryArray[1][prop](constraintSyntax);
										//queryArray[1].select(constraintSyntax);
									}
									
								else
								{
									console.log("Not Processing: " + prop + " = " + JSON.stringify(constraintSyntax) + "<br>")

								}
                                 									
							  }
					   }  
					}	
		 } // we had constraints			
} // queryApplyAllConstraints		 
	



// returns a promise to the caller
	
	var getGenericPageAsPromise = function (request, response){  // rlacey  2015 pagination
// uses two promises to perform pagination on a record set subject to constraints
// Promise 1 is needed to generate the total record count that is needed by
// Promise 2 that finds the actual records. There P1.then->P2.then returns the actual pagination data

	var promise = new Parse.Promise();
/*
code : 119 means no access
let ACLs handle this
	  if( ! Parse.User.current() ) {
			  console.log("1a Are you logged in?");
				promise.reject('Are you logged in?');
		    return promise;
	  }
	*/	
    	var targetClass = request.params.targetClass ? request.params.targetClass : "";
		
		if (targetClass.length == 0 ){
					console.log("1b No class provided.");
		    
				promise.reject('No class provided');			
				return promise; // needed on the client side to abort processing
	  }
		
	// angular error	Parse.Cloud.useMasterKey();
		
        // the two promises that are the queries
				
		
	  var p1_recordCount = new Parse.Query(targetClass);
    var p2_query = new Parse.Query(targetClass);		
		
 
		
		
		var skipValue = 0; // may change
		var totalRecords = 0;
		var totalPages = 0;	 
		var dataToReturn = new paginationStructure();
		// cannot simply assign ._metadata = request.params as structures may not match
		dataToReturn._metadata.targetClass = targetClass; // allows call cacheing on the client side
		
		// read any query modifying parameters
		var pageno = request.params.page_no ? request.params.page_no : 1; // may change later
		var perPageLimit = request.params.per_page_limit ? request.params.per_page_limit : 20;
		var whereByEquals = request.params.whereByEquals ? request.params.whereByEquals : "";
	  var constraints = request.params.constraints ? request.params.constraints : [];	
		var sorting = request.params.sorting ? request.params.sorting : [];
		
	
		if ( perPageLimit > 100 ) { perPageLimit = 100 };
 

		
        queryApplyAllConstraints([p1_recordCount, p2_query] ,constraints);
        queryApplyAllSorts(p2_query,sorting);
 	    
	    p1_recordCount.count() // get the count of records
	       .then(function(countOfP1) {
	    	     // need logic here to stay with the total amount of records	    	   
	    	     totalRecords = countOfP1;
	    	     totalPages = totalPagesValue(totalRecords,perPageLimit)
	    	     
	    	     if  (pageno > totalPages)  {pageno = totalPages };
	    	     if  (pageno < 1)  {pageno = 1 };
	    	     skipValue = (pageno - 1 ) * perPageLimit;
	    	     
	    		 p2_query.limit(perPageLimit);
	    		 p2_query.skip(skipValue);
				 
				 if  (request.params.select)
				 {
					 	p2_query.select(request.params.select ); // specified fields
				 }
  
	    	     return p2_query.find()
	             })
	       .then(function(results) {
		    			    	 
				  var jsonArray = [];

				    var recordCount = results.length;
			        for(var i = 0; i < recordCount; i++) {
						results[i].attributes.uri = "https://api.parse.com/1/classes/" + targetClass + "/" + results[i].id; 
			           jsonArray.push(results[i].toJSON());
			        } 
			        
			        dataToReturn.records = jsonArray;
			        
					var current_page = pageno * 1;
					dataToReturn._metadata.page_no = current_page;	
					dataToReturn._metadata.page_count = totalPages;
			    dataToReturn._metadata.per_page_limit = perPageLimit * 1;
			    dataToReturn._metadata.page_record_count = recordCount;
			    dataToReturn._metadata.total_recordcount = totalRecords;
					dataToReturn._metadata.constraints = constraints;
					dataToReturn._metadata.sorting = sorting;
					
					// using restful idea within the payload, but the parse.com call consumes the primary rest call
					dataToReturn._metadata.links.self     = current_page;
					dataToReturn._metadata.links.first    = 1;
					dataToReturn._metadata.links.previous = (current_page > 1) ? --current_page   : totalPages;
					current_page = pageno * 1; // may have be changed above
					dataToReturn._metadata.links.next     = (current_page < totalPages) ? ++current_page : 1;
					dataToReturn._metadata.links.last     = totalPages;
 
			      
						promise.resolve(dataToReturn);						 
		    },
		    function(errorResult)
		    {
		      //dataToReturn._metadata.error = "error";
		       
					 promise.reject(errorResult	);
		    }
		    );	 
				
			return promise;	 // pass back to the caller for .then etc
	} //asPromise

	
		
		
		
		
		
		
		
		
		// is this used now?????????????
							  // GET ALL Class Generic
		var getAllClassGeneric = function (Target ,callback, errorHandlerIn) {
			
			          errorHandler = errorHandlerIn || errorHandlerGeneric; // ensure we have an error handler
			
			            cloudReadSemaphore = cloudReadSemaphore +1 ;
					//	$rootScope.$apply();
						
						var Item = Parse.Object.extend(Target);
						var ItemCollection = Parse.Collection.extend({ model: Item });
						var items = new ItemCollection();
						items.fetch({
								 success: function (results) {
									  var x = normaliseResults(results);
									  cloudReadSemaphore = cloudReadSemaphore -1 ;
									  $rootScope.$apply();
									  callback(x);
								  },
									error: function (results, err)
										  {
											  cloudReadSemaphore = cloudReadSemaphore -1 ;
											  $rootScope.$apply();
											  errorHandler(results, err); 
										  }
						});
					  };
					  
					  
					  
		var getTemplate2 = function(templateId)
		{
			// logic here later to take this from eventTemplates
			
				var test_template = {   "message" : "Training will commence at 9.15am and finish with lunch at 2.00pm. Please indicate which venue you wish to attend by filling in the Number of Attendees box and if you will stay for lunch.",
		                           "dates" : [ { "date": "16/10/2015", 
		                                            "sessions": [ {"location": "Dublin", "venue":"Clarion Hotel Liffey Valley", "attendees" : 0 ,  "maxAtt": null, "lunch": false },
													                    {"location": "Cork", "venue":"Fota Island Resort", "attendees" : 0 , "maxAtt": 6 , "lunch": false  },
																		{"location": "Athlone", "venue":"Hodson Bay Hotel" ,"attendees" : 0 ,  "maxAtt": 7, "lunch": false  }
												                      ]
													},
													
													{ "date": "17/10/2015", 
		                                            "sessions": [ {"location": "Dublin", "venue":"Clarion Hotel Liffey Valley", "attendees" : 0 ,  "lunch": false  },
													                    {"location": "Cork", "venue":"Fota Island Resort", "attendees" : 0 ,   "lunch": false  },
																		{"location": "Athlone", "venue":"Hodson Bay Hotel" ,"attendees" : 0 ,   "lunch": false  }
												                      ]
													}
													
													
												]
								};
								
				return test_template;
		}			
		
		
		var normaliseParseErrorMessage = function (err)
		{ // make the parse error messages novice friendly
		  var e = err || { "message" : "Cloud Related Error", "code" : -1};
			var m = e.message; // default response
			  switch (e.code)
			  {
				  case 119:  m = "You do not have permission to save to the database resource";
				                     break;
			  }
			  return m;
		};	
		
		// nopromise here compares to the use of $q.defer() in v2 to respond back to caller
			 var cloudFunctionCallnopromise2  = function (fname, jsonData)
			 {
				  // must call success / error , then does not appear to work with Cloud.run
					
				  Parse.Cloud.run(fname, jsonData,
						  function(dataResult){			            
										return dataResult;
										},
						  function(errorResults) {			  				 
										 return errorResults;
										 }
					);	 
			 }	;	
			 
			String.prototype.hashCode = function() {
				// http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
					var hash = 0, i, chr, len;
					if (this.length == 0) return hash;
					for (i = 0, len = this.length; i < len; i++) {
						chr   = this.charCodeAt(i);
						hash  = ((hash << 5) - hash) + chr;
						hash |= 0; // Convert to 32bit integer
					}
					return hash;
				}; 
			 
			 
			 
			var cloudFunctionCallpromise2  = function (fname, jsonData, fCache)
			 {
				  var fromCache = fCache || false;
				  var deferred = $q.defer();
					var targetClass = jsonData.targetClass;
			 
			    var tempHash =  (JSON.stringify(jsonData)).hashCode();
					
					console.log("json = " + jsonData);
					console.log("temp.hashCode = " + tempHash);
					if (fromCache && cachedData[targetClass]) 
							{
								if (cachedData[targetClass].hash == tempHash)
								console.log("cache hit with: "+ targetClass);
							   //return deferred.resolve(cachedData[targetClass].value);	
								 
								 return Parse.Promise.as(cachedData[targetClass].value);
								//return Parse.Promise.as(cachedData[targetClass]);
							}
 		   
	/*				  Parse.Cloud.run(fname, jsonData,
						  function(dataResult){			   
                                        deferred.resolve(dataResult);						  
								//		return Parse.Promise.as(dataResult);
										},
						  function(errorResults) {		
										 deferred.reject(		errorResults)				  
								//		 return Parse.Promise.error(errorResults);
										 }
					);	 
		*/			
		     // lost some time on this the above  .then code always went through the then even if failure the older style below works
						  Parse.Cloud.run(fname, jsonData, {
						  success: function(dataResult){	
											cachedData[targetClass] ={ "hash" : tempHash, "value" :dataResult };
										 									
											deferred.resolve(dataResult);		
																				 
								//		return Parse.Promise.as(dataResult);
										},
						  error: function(errorResults) {		
											cachedData[targetClass]  = null;
										 	
										 deferred.reject(errorResults)				  
								//		 return Parse.Promise.error(errorResults);
										 }
						  }
					);	 
		
					 return deferred.promise;  // the caller will use this to wait for the asynch result
			 }	;	
			 
	 
			 
			 /*
			 
			 var cloudFunctionCall2  = function (fname, jsonData)
			 {
				  Parse.Cloud.run(fname, jsonData).then(
						  function(dataResult){			            
										return Parse.Promise.as(dataResult);
										},
						  function(errorResults) {			  				 
										 return Parse.Promise.error(errorResults);
										 }
					);	 
			 }	;		
			 
*/			 
			 
 
		var ParseService = {  // expose functionality externally
 			 
					  initialize : function  () {
						            cloudReadSemaphore = 0;
									Parse.initialize(parseAppKey, parseJSKey);
					  },	
				 	  
					  logOut : function  () {
								Parse.User.logOut();	
					  },		
					  
					  getTemplate : getTemplate2,
					  
					  normaliseErrorMessage : normaliseParseErrorMessage,
			 	    cloudFunctionCallpromise  : cloudFunctionCallpromise2,
					  cloudFunctionCallnopromise : cloudFunctionCallnopromise2,
					  
			 
					attendeePositions :	  function (fromCache, incallback, inerrorHandler) {
						// some data is static in nature hence benefits from caching
						// fromCache = true means a cached version can be used, false/undefined and fresh data is found
						 
						
						if  (fromCache && cachedData.attendeePositions) 
							return   cachedData.attendeePositions;
						else
						{
						
									positionOptions = [
										{'id' : 1,  'name' : 'Principal'  }, 
										{ 'id' : 2, 'name': 'Chairperson'  }, 
										{'id' : 3,  'name': 'Assistant Principal' },
										{'id' : 4,  'name': 'Teacher'    },
										{'id' : 5,  'name': 'Board Member'  }
										];
										
										callback        = incallback        ||   function(x){}; // do nothing if successful
										errorHandler = inerrorHandler ||   function(results,err) { cachedData.attendeePositions = null;
										                                                                                         console.log("error: attendeePositions -" + err);}
										var cc = "attendeePositions";
								        positionOptions = getAllClassGeneric   (cc ,callback, errorHandler)		
										
								cachedData.attendeePositions = positionOptions; 		
						}
						return   cachedData.attendeePositions;
									},
									 
					  
					  
					  isCloudReadSemaphore : function() {
						                                                           return cloudReadSemaphore;  // >0 is true, 0 is false
																				},
					  
					  resetCloudReadSemaphore : function() {  cloudReadSemaphore = 0;
						                                                                return cloudReadSemaphore;
																						},

					  // GET ALL Class Generic
					  getAllClass : getAllClassGeneric,
					  
					  getAllClass2 : getAllClassGeneric2,
 			  
 					
						saveGeneric : function(target,data)
					  {
						  
						  cloudReadSemaphore++;
						  var tt =   Parse.Object.extend(target);
						  var t = new tt();
						  return t.save( data, {
								success: function (obj) {
																		cloudReadSemaphore--;
																		return Parse.Promise.as(obj);
																	 
																	   },
								error:   	function (result, err) {
																		cloudReadSemaphore--;
																		return Parse.Promise.as(err);
																	 
																	   }
						});
					  },
					  
					getCourses : function (callback)
						{
						// get the data locally
						//	$http.get('courses.json').success(callback);
					//	Parse.User.logOut();
						getAllClassGeneric("zzzCourses",callback, function(){
							                                                                                 console.log("error: getAllClass")
																											 });
						},
						
					getSubjects : function (callback)
						{
							// get the data locally
							//$http.get('subjects.json').success(callback);
						getAllClassGeneric("Subjects",callback, function(){console.log("error: getAllClass")});
							
						} 					
 			
	
    }; // ParseService object of functions

    return ParseService;			
 
 
}] );

 








 