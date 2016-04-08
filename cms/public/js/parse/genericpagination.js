angular.module('rlCloudServicesPagination', [])

// updated 20151024  
// quiz version behind regarding select


// gp.js

// this is the client side version of the generic pagination coded for parse.com by rl.
// there is a CLOUD SERVER side version for deploying
// note: Cloud.run needs a success/error logic NOT .then
// to faciliate .then etc use success/error to resolve/reject the promise returned to the caller



// tests in 
// C:\Users\rlacey\Dropbox\Opus\javascript\Quiz_2014_s2\images\scripts\testing_random.js



/*
getGenericPage (
*/
 
 .factory('rlCloudServicesPagination', ['$http','$rootScope', '$q' , function($http, $rootScope, $q){
 
    var cachedData = {};
 		// prepare the typically queries in advance						   
		var classQueries = 
					{ "attendeePositions01" : {"params" :  {"targetClass" : "attendeePositions", "page_no" : 1, "per_page_limit": 20, "select" : ["name", "cId"]  ,
													 "constraints" : [  {"equalTo": [{"cId" : "xyz001"}, {"grouping": "xyz001"} ]}  ]   , "sorting" : [ { "ascending" : "name"}    ]     }}	   						  
					};
					
    var cachedData = {};	
	
		var findRecordsToPromise = function (request, response){ 
 
// getGenericPage and this share filtering code etc

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
		
		//Parse.Cloud.useMasterKey();
		
        // the two promises that are the queries
 
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
 	
        queryApplyAllConstraints([p2_query] ,constraints);
        queryApplyAllSorts(p2_query,sorting);	  
		return p2_query.find();
}

// promises version below
				
var getGenericPage = function (request, response){  // rlacey  2015 pagination
// uses two promises to perform pagination on a record set subject to constraints
// Promise 1 is needed to generate the total record count that is needed by
// Promise 2 that finds the actual records. There P1.then->P2.then returns the actual pagination data
	  if( ! Parse.User.current() ) {
			console.log("1a Are you logged in?");
		    response.error('Are you logged in?');
				 
			return; // needed on the client side to abort processing
	  }
		
    	var targetClass = request.params.targetClass ? request.params.targetClass : "";
		
		if (targetClass.length == 0 ){
			console.log("1b No class provided.");
		    response.error('No class provided');
	 			
		//	return; // needed on the client side to abort processing
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
 
			        response.success(dataToReturn);	    
						 						 
		    },
		    function()
		    {
		       dataToReturn._metadata.error = "error";
		      response.error( dataToReturn );
					  
		    }
		    );	 
	}
	
	
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

	
	
	
//	Parse.Cloud.define("getGenericPage", getGenericPage);
	// ); 
	// getGenericPage
 
 
 
 
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
							  
								$("#output").append(prop + " = " + JSON.stringify(sortSyntax) + "<br>")
								
								// prop === "containsAll"  ????
								if (prop === "ascending"       || 
								    prop === "descending"   )
									{
//										console.log("build sort");
										query[prop](sortSyntax);
									}
								else
								{
									$("#output").append("Not Processing: " + prop + " = " + JSON.stringify(sortSyntax) + "<br>")
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
							  
								 $("#output").append(prop + " = " + JSON.stringify(constraintSyntax) + "<br>")
								
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
									    $("#output").append(prop + " keys = " + constraintSyntax);
									    queryArray[0][prop](constraintSyntax);
									  	queryArray[1][prop](constraintSyntax);
										//queryArray[1].select(constraintSyntax);
									}
									
								else
								{
									$("#output").append("Not Processing: " + prop + " = " + JSON.stringify(constraintSyntax) + "<br>")
									console.log("Not Processing: " + prop + " = " + JSON.stringify(constraintSyntax) + "<br>")

								}
                                 									
							  }
					   }  
					}	
		 } // we had constraints			
} // queryApplyAllConstraints		 
		 
var applyConstraintsArray = function (queryArray, constaintName, arrayOfConstraints  )
{
// pagination uses two queries so they are passed in as an array to make life easier	
//	$("#output").append("<br>applyConstraint " + constaintName + "<br>");
	
	 for (var offset in arrayOfConstraints) { // get each constraint from the array
 
                var arrayItem = arrayOfConstraints[offset];
				
			    var classkey =    Object.keys(arrayItem) ; // should only be one key per object in the array
                $("#output").append("<br>Constraint = " + constaintName + "<br>");	
				$("#output").append(classkey + " : " + arrayItem[classkey] + "<br>");	
				/*  if (query) query.equalTo(classkey,arrayItem[classkey]); */
			 
			 // generically set the relevant query method for each passed in query
			 $("#output").append("queryArray[query][constaintName](classkey,arrayItem[classkey]);<br>");
			 for (var query in queryArray) 
				{   // eg = to query.equalTo(a,b) == query["equalTo"](a,b)
		
			$("#output").append(  query + " / " + constaintName + " / " + classkey + " / " + arrayItem[classkey] +"<br>");		
					queryArray[query][constaintName](classkey,arrayItem[classkey]);
			    // query[constaintName](classkey,arrayItem[classkey]);
				}
	 	}	
}	 		 
		 
      
// });  // ready
  
 var simulate_response  = {
	 error : function(data)
	 {
		 $("#output").append(data);
	 },	 
	success : function(data)
	 {
		// alert(data.response);
		// $("body").append("<h5><pre>"  + prettyResult(data) + "</pre></h5>" ); 
	 }
 }		



return {
	
			getGenericPage : getGenericPage,
			paginationStructure  : paginationStructure,
			totalPagesValue       : totalPagesValue,
			queryApplyAllSorts    : queryApplyAllSorts,
			 
			queryApplyAllConstraints : queryApplyAllConstraints,
			 
			applyConstraintsArray     : applyConstraintsArray,
			
			simulate_response : simulate_response,
			findRecordsToPromise : findRecordsToPromise,
			getGenericPageAsPromise : getGenericPageAsPromise

       }

  } ] );//alpha
 