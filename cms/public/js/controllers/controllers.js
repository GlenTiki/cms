var appControllers = angular.module('appControllers', []);


appControllers.controller('EventsCtrl', [ '$rootScope', '$scope' , '$location',  'EventState',  'CloudServices', 'rlModals',   'rlModals', 'OrganisationStateTemplate1', 'rlCloudServicesPagination', 'vcRecaptchaService',  '$sce',
function(  $rootScope, $scope, $location, eventState, cloudServices,rlModals  ,rlModals, orgState, rlCSP, vcRecaptchaService, $sce) {
  // TypeError: Can't add property $$hashKey, object is not extensible angular
  // https://jazmit.github.io/2015/03/17/angular-repeater-with-immutable-objects.html
  // hash key used to track changes, arrays may have no key to hash

  console.log("EventsCtl");

  var errorConfig = null;
  var recaptchaResponse = null;



  $scope.mode = "Testing Mode"; // <-- "Testing Mode" buts in buttons etc


  // use a .value() for this
  $scope.trustAsHtml = function(string) {
    return $sce.trustAsHtml(string);
  };

  $scope.reCapthchaShow = true;
  $scope.reCapthchaPublicKey = "get me"; //

  $scope.globalResetCounter = 0;
  $scope.globalResetFN = function() { return $scope.globalResetCounter; } ; // passed to child directives

  $scope.globalRedrawCounter = 0;
  $scope.globalRedrawFN = function() { return $scope.globalRedrawCounter; } ; // passed to child directives


  $scope.attendChildScope = null;
  $scope.cId = "xxx"; // eventState.fn.getAppCustomerId();
  $rootScope.cId = $scope.cId;





  // when this controller is called a promise in the $routeProvider has been resolved
  // in eventState.DS.eventConfigurations is the collection of Events on offer
  // and should be static per SPA session

  // these objects are needed on every visit to the view
  //    $scope.eventConfigurations = eventState.DS.eventConfigurations; // get all the configurations for the combo, leave here

  $scope.eventConfigurations = [];  // this is the list of events for the combo at the top right

  //xhrReq to get data from server
  $.ajax({
    url: '/data',
    async: false, // needed for compatibility with rlaceys code.
                  // cannot find how this event controller is working?
    success: function (res) {
      res.results.forEach(function (e) {
        $scope.eventConfigurations.push(e)
      })
    }
  })

  $scope.formData =  eventState.formData;
  $scope.formMeta =  eventState.formMeta;




  var reCAPTCHAid = -1;

  $scope.setreCAPTCHAid = function(id)
  {  // called from captchadiv on-create
    reCAPTCHAid = id ;
  }

  $scope.displayInstructions = function()
  {
    alert("displayInstructions");
  }

  $scope.putInTestData = function()
  {
    if     ($scope.eventSelected.template_meta.type == "template1_seminar")
    {
      var td1 =  getTestData("seminar");
      td1.eventId = $scope.eventSelected.objectId + "";
      // real effort puts in choice order attribute
      eventState.formData = td1;
      $scope.formData = td1;
    }
    else
    {
      var w1 = getTestData("workshop");

      w1.eventId = $scope.eventSelected.objectId + "";
      eventState.formData = w1;
      $scope.formData = w1;
    }

    // cascade updates to sub forms
    $scope.globalResetCounter  = $scope.globalResetCounter + 1;

  }    // putInTestData




  // ensure a change of event clears the data i.e. reset all the details as its based on the first selection


  ///////////////////////////////////

  var expCallback =	function ()
  {
    //	alert("expCallback");
  }





  $scope.clearReCAPTCHA = function()
  {
    if (reCAPTCHAid > -1)
    {
      grecaptcha.reset(reCAPTCHAid); // reset the google reCAPTCHA
    }
    $scope.formData.confirmation = false;
  }


  $scope.changeOfEvent = function()
  {
    // clear out the data state from the previous EventState
    $scope.clearReCAPTCHA();


    $scope.formData.confirmation = false;
    $scope.eventFormValid = false;
    // ui select event updates the model value eventState.formMeta.eventOffset
    if ( eventState.formMeta.eventOffset > -1 ) // the model
    {  // change the state
      $scope.eventSelected = $scope.eventConfigurations[$scope.formMeta.eventOffset];
      $scope.receiptID = null;

      //  $scope.eventSelected = angular.copy($scope.eventConfigurations[$scope.formMeta.eventOffset]);

      delete $scope.eventSelected.createdAt; // these parse fields not needed
      delete $scope.eventSelected.updatedAt;
      // data for the form UI
      $scope.DS = {};          // data source
      $scope.DS.overview = {};

      // reset the data
      eventState.fn.resetDefaults(eventState.formMeta.eventOffset);
      $scope.formMeta =  eventState.formMeta ;
      $scope.formData =  eventState.formData;
      $scope.formData.eventId  = $scope.eventSelected.objectId + ""; // its a string
      $scope.formData.eventName = $scope.eventSelected.name;
      $scope.formData.type = $scope.eventSelected.template_meta.type;

      // what is the state of a directives input state

      // next two passed to organisation for UI labels
      $scope.formMeta.organisationType = $scope.eventSelected.organisation.meta.ui_text_to_display
      $scope.formMeta.sectorUINoText = $scope.eventSelected.organisation.meta.sectorNo_text;

      // this value should not be greater than the value in cloud/main.js
      $scope.formMeta.maxAttendees = 10; // later from 	eventSelected subject to 10

      $scope.formMeta.contactValid = false;
      $scope.formMeta.organisationValid = false;
      $scope.formMeta.attendeesValid = false;


      $scope.organisationTemplateName = $scope.eventSelected.organisation.meta.template;
      // now let the organisationTemplateName set the required fields
      $scope.formData.organisation = {};  // = null was a bug
      $scope.formMeta.attendeePositions = $scope.eventSelected.attendees_meta.positions;


      // event meta data tidying
      // remove the visible = false offerings to lessen array size for column logic
      if  ($scope.eventSelected.template_meta.type == "template1_seminar")
      {       // template specific logic
        $scope.attendeeTemplateMode ="Seminar";
        $scope.formData.model_type ="Seminar";
        $scope.offerings =  $scope.eventSelected.offerings.data.filter(function(item) {         return item.visible==true })
        //      $scope.eventSelected.offerings.data = $scope.eventSelected.offerings.data.filter(function(item) {       return item.visible==true })
      }
      else
      if ($scope.eventSelected.template_meta.type == "template1_workshops")

      {       // template specific logic
        $scope.attendeeTemplateMode = "Workshop";
        $scope.formData.model_type ="Workshop";
        $scope.formMeta.workshopsMeta = $scope.eventSelected.workshops_meta;

      }
      // $scope.eventSelected.organisation.meta.visible_also   is event specific organisational meta data

    }
    else
    { // new state
      $scope.eventSelected = null;
      $scope.formMeta.eventOffset = -1;
      $scope.eventSelected = $scope.eventConfigurations[0];   //  remove these two lines later for testing
      $scope.formMeta.eventOffset = 0;
    }
    // cascade updates to sub forms
    $scope.globalResetCounter  = $scope.globalResetCounter + 1;
  } // changeOfEvent


  // show the data if only one value available
  if ( $scope.eventConfigurations.length == 1 )
  {
    eventState.formMeta.eventOffset = 0; // show the only option
    $scope.changeOfEvent();
  }



  if ($scope.mode == "Testing Mode")
  {
    if ( $scope.eventConfigurations.length > 0 && eventState.formMeta.eventOffset == -1 )
    {
      eventState.formMeta.eventOffset = 0; //remove later
      $scope.changeOfEvent();

      $scope.putInTestData();

    }
  }


  $scope.emailsMatch = function()
  {
    return $scope.formData.email  === $scope.formData.email2;
  };
  $scope.showSeminarColumns = function()
  { // should a column or columns appear, if 0 matches prevent an error with Unavailable as appears in error message
    $scope.attendeeTemplateMode = $scope.attendeeTemplateMode || "Unavailable";
    return $scope.attendeeTemplateMode.toLowerCase() =='seminar' && $scope.eventSelected.offerings.meta.visible == true
  };


  $scope.columnRange = function(colNo) {

    if ($scope.eventSelected == null) return [];

    $scope.columnRanges = []

    var totalColumns = $scope.eventSelected.offerings.meta.columns; // supplied by the user


    var offeringsCount = $scope.eventSelected.offerings.data.length;
    var perColumn = parseInt(offeringsCount / totalColumns , 10);

    // loses odd vale   return _.chunk($scope.eventSelected.offerings,perColumn)[colNo];


    var column0 = 0;

    if (perColumn * totalColumns < offeringsCount)
    {
      column0++;
    }

    if ( colNo == 0 && perColumn * totalColumns < offeringsCount)
    {
      perColumn++; // first column gets the extra value
    }
    if ( colNo == 0 )
    {
      //  console.log($scope.eventSelected.offerings.slice(0,perColumn));
      return    $scope.eventSelected.offerings.data.slice(0,perColumn);
    }
    else
    {
      var start = column0 + colNo * perColumn;
      //  console.log($scope.eventSelected.offerings.slice(start  ,start + perColumn));
      return    $scope.eventSelected.offerings.data.slice(start  ,start + perColumn);
    }

  } // columnRange


  var validateEventForm = function(){

    errorConfig = errorConfig || rlModals.getErrorConfig();
    errorConfig.title.text = "Error(s): Invalid Data State";
    errorConfig.subtitle.text = "You have not provided all necessary data.";
    errorConfig.content = [];

    var m = "";
    if ($scope.formData.attendees.length == 0)
    {
      errorConfig.content.push({"text": "You have supplied no attendee names." });
      $scope.formData.confirmation = false;
    }
    else
    { // ensure workshops not left in a bad state i.e. the
      // the data entry is complete
      if ($scope.attendeeTemplateMode == "Workshop" && $scope.formMeta.attendeesValid == false)
      {  // the seminar person panel may be red, but none of the workshops can be
        errorConfig.content.push({"text": "You have not completed/tidied the attendees data.    " });
        $scope.formData.confirmation = false;
      }
    }


    if ($scope.eventSelected.organisation.meta.enabled==true)
    { // need to validate these fields
      if ($scope.formMeta.organisationValid == false)
      {
        errorConfig.content.push({"text": "Complete the organisation input(s) correctly." });
        $scope.formData.confirmation = false;
      }
    }

    if ($scope.eventSelected.contact.meta.enabled==true)
    { // need to validate these fields
      if ($scope.formMeta.contactValid == false)
      {
        errorConfig.content.push({"text": "Complete the contacts input(s) correctly." });
        $scope.formData.confirmation = false;
      }
    }

    if (vcRecaptchaService)
    recaptchaResponse = vcRecaptchaService.getResponse(reCAPTCHAid);
    else
    {
      recaptchaResponse = "";
    }

    if( recaptchaResponse === ""){ //if string is empty
      errorConfig.content.push({"text": "Complete 'I`m not Robot' / reCAPTCHA test, which is valid for 2 minutes." });
      $scope.formData.confirmation = false;
    }



    if ($scope.formData.confirmation == true)   // other checks/validations later
    {
      $scope.eventFormValid = true
    }
    else
    {
      errorConfig.content.push({"text": "Inputs with red boundary require valid user input. [Except Seminar Attendees(s)]" });
      errorConfig.content.push({"text": "Red indicates a validation error, too long or incorrect format etc." });


      var modalInstance = rlModals.showDynamicModal(errorConfig);
      // wait for the result and process the buttons
      modalInstance.result.catch(function () { }); // do nothing
    }
  }


  $scope.toggleConfirmation = function( ) {
    if ($scope.formData.confirmation == true) // user ticks this, an extra thinking step for them
    {
      validateEventForm();
    }
    else
    {
      $scope.eventFormValid = false;
    }
  }

  var printForm = function()
  {
    window.print();
  }

  var confirmResult;  // a promise
  $scope.confirmSubmit = function()
  {

    // this message is template specific for feedback
    var confirmation1 = rlModals.getConfirmationModel();

    confirmation1.title.text ="About to submit form data";
    confirmation1.subtitle.text ="Are all the details correct?";
    confirmation1.buttons.okay.text = "Submit Form";
    confirmation1.content = [];

    var attendeesCount =    $scope.formData.attendees.length;
    var organisation = $scope.formData.organisation

    confirmation1.content.push({ "text" : "Event = " + $scope.eventSelected.name, "class": "", "style" : "" });

    confirmation1.content.push({ "text" : "Number of Attendees = " + attendeesCount, "class": "", "style" : "" });
    confirmation1.content.push({ "text" : "Organisation = " + organisation.name, "class": "", "style" : "" });
    confirmation1.content.push({ "text" : "Organisation email = " + organisation.email, "class": "", "style" : "" });

    confirmation1.content.push({ "text" : "Please wait for the response from the server", "class": "", "style" : "font-size:1.5em" });

    var dynamicResult   =   rlModals.showDynamicModal(confirmation1);


    dynamicResult.result.then(function (Res) { // promise to catch the modal result,

      $scope.submitEventForm()
    }, function () {
      $scope.formData.confirmation = false;
      $scope.eventFormValid = false;
    });
  }


  $scope.submitEventForm = function( ){
    $scope.isSavingForm = true;
    console.log("submitEventForm");

    // fix this later
    console.log("sanitize here and in the beforeSave");
    // remove email2

    var max = $scope.formMeta.maxAttendees || 10; // if 10 changed, ensure server follows cloud/main.js

    //  This trimming, for some reason causes attendees to disappear
    // from the view, hence no printing, still in array.
    //  var xx = $scope.formData.attendees.splice(0, max);
    // 	$scope.formData.attendees = xx; // trim out unwanted attendees

    var dataToSave = angular.copy($scope.formData);

    dataToSave.attendees = dataToSave.attendees.splice(0, max); // trim out unwanted attendees

    try {
      delete $scope.formData.organisation.email2;
    } catch(e) {};

    try {
      $scope.formData.contact.email2;
    } catch(e) {};

    delete dataToSave.email2;        // remove these fields
    delete dataToSave.confirmation;


    // pass up the reCAPTCHA response
    dataToSave['g_recaptcha_response']  =   recaptchaResponse ; //- replaced by _ for parse.com keys




    cloudServices.saveGeneric("eventRequest", dataToSave)
    .then(function(obj){
      $scope.reportSaveSuccess(obj);
      //	window.print();
    },
    function(err) { // error
      $scope.reportError(err)
    });


  };

  $scope.reportSaveSuccess = function(obj)
  {
    $scope.isSavingForm = false;
    $scope.isDataEntryMode = false; // for receipt format
    $scope.receiptID = obj.id;
    obj.receiptID = obj.id
    $scope.$apply();

    // request the email here from cloud code


    var confirmation2 = rlModals.getConfirmationModel();

    confirmation2.title.text ="Data Received";
    confirmation2.subtitle = {"text": "Tracking No: " + $scope.receiptID, "style" : "font-size:1.5em"};

    confirmation2.buttons.cancel.text = "Exit";
    confirmation2.buttons.okay.text = "Print";
    confirmation2.buttons.okay.fn  = function() {window.print();};


    confirmation2.content = [];
    var organisation = $scope.formData.organisation.name


    confirmation2.content.push({ "text" : "Event = " + obj.attributes.eventName, "class": "", "style" : "font-size:1.5em" });
    confirmation2.content.push({ "text" : "Attendee Number = " + obj.attributes.attendees.length, "class": "", "style" : "font-size:1.5em" });
    confirmation2.content.push({ "text" : "Keep a copy for your records.", "class": "", "style" : "" });

    if (obj.attributes.changes)
    {
      $scope.changes = obj.attributes.changes;
      confirmation2.content.push({ "text" : "The following changes were made before saving.", "class": "", "style" : "font-size:1.5em" });

      obj.attributes.changes.forEach(function(entry) {
        console.log(entry);
        confirmation2.content.push({ "text" : "Change = " + entry.m, "class": "", "style" : "" });

      });
    }

    var dynamicResult   =   rlModals.showDynamicPrintModal(confirmation2);

    dynamicResult.result.then(function (Res) { // promise to catch the modal result,
      // always a cancel

    }, function () {
      // $scope.resetForm(); this throws up a prompt, not relevant here

      $scope.changeOfEvent(); // reset to current event
    });
  };

  $scope.reportError = function(err)
  {

    var m2 = cloudServices.normaliseErrorMessage(err);

    var m = "Error saving data, error no = " +  err.code + " /  " +  m2 + " ";
    m = m + "You can try again, but unfortunately if this does not work, you will have to try again at a later time";
    var imsg = { "title" : 'Error', "text" : m };

    errorConfig = errorConfig || rlModals.getErrorConfig();
    errorConfig.title.text = "Error Saving Data";
    errorConfig.subtitle.text = "Your data was not saved.";
    errorConfig.content = [];

    errorConfig.content.push({"text": err.code + " /  " +  m2, "style" : "margin-bottom:10px; font-size:1.5em" });

    errorConfig.content.push({"text": "You can try again, but unfortunately if this does not work, you will have to try again at a later time.", "style" : "margin-bottom:10px; font-size:1.2em" });

    errorConfig.content.push({"text": "If your reCAPTCHA has expired, verify again and retry." });

    var modalInstance = rlModals.showDynamicModal(errorConfig);
    // wait for the result and process the buttons
    modalInstance.result.catch(function () {
      // not resetting the form, it may be expiry of reCAPTCHA response
      $scope.isSavingForm = false; // just in case
      $scope.eventFormValid = false;
      $scope.formData.confirmation = false;

    }); // do nothing


    /*
    var modalInstance = rlModals.showErrorModal(imsg);
    // wait for the result and process the buttons
    modalInstance.result.catch(  function () {
    // not resetting the form, it may be expiry of reCAPTCHA response
    console.log('Save Error at: ' + new Date());
    $scope.isSavingForm = false; // just in case
    $scope.eventFormValid = false;
  });
  */
}





$scope.resetForm = function(form) {

  var confirmation1 = rlModals.getConfirmationModel();

  confirmation1.title.text = "Reset Form?"
  confirmation1.subtitle.text = "You will lose all data on the form!"
  confirmation1.content = [];

  var dynamicResult   =   rlModals.showDynamicModal(confirmation1);


  dynamicResult.result.then(function (Res) { // promise to catch the modal result,
    $scope.changeOfEvent();  // reset the form for the current event


    if (form && form.eventForm) { // form is only valid after loading
      form.$setPristine();
      form.$setUntouched();
    }

  }, function () {
    //   console.log('Dynamic dismissed at: ' + new Date());
  });
};

/////////////////////////////////

console.log("events end");

}]); // EventsCtrl

function getTestData(required)
{
  if     (required == "seminar")
  {
    var td1 =  {
      "eventId":"OciNCnAtoC",
      "eventName":"AAAAAAAAAAAAAAAAAAAA - Module 2 2 cols",
      "model_type":"Seminar",
      "confirmation":false,
      "template_type":"template1_workshops",
      "attendees":[
        {
          "order" : 3,
          "choice":"aaaaaaaaaa - 01/10/2015",
          "firstname":"Patrick1",
          "lastname":"Bloggs",
          "position":"tba",
          "lunch":false
        },
        {
          "order" : 9,
          "lastname":"Bloggs",
          "firstname":"Patrick",
          "position":"tba",

          "choice":"bbbbbbbbbb - 07/10/2015",
          "lunch":true
        }

      ],
      "organisation":{
        "id":"WIT",
        "name":"WIT",
        "email":"wit@wit.ie",
        "email2":"wit@wit.ie",
        "orgContactFirstname": "Joe",
        "orgContactLastname": "Bloggs",
        "address1":"abcdefghijklmnopqrztuvwxyz",
        "address2":"abcdefghijklmnopqrztuvwxyz",
        "address3":"abcdefghijklmnopqrztuvwxyz",
        "address4":"abcdefghijklmnopqrztuvwxyz",
        "postcode":"abcdefghijklmnopqrztuvwxyz",
        "telephone":"051051051",
        "fax":"051050051"
      },
      "contact":{
        "lastname":"Bloggs",
        "firstname":"Patrick",
        "email":"joe@joe.ie",
        "email2":"joe@joe.ie"
      },
      "receiptID":""
    };

    return td1;
  }
  else
  {
    var w1 =
    {
      "eventId":"Nj2HRL2B6F",
      "eventName":"Workshop 1",
      "model_type" : "Workshop",
      "confirmation":false,
      "template_type":"template1_workshops",
      "attendees":[


        {
          "lastname":"Jones222",
          "firstname":"Paddy",
          "position":"Delta",
          "choices":[
            {
              "session":"14:30-15:45",
              "workshop":"TAS2"
            },
            {
              "session":"11:45-12:45",
              "workshop":"Data Protection"
            }
          ]
        },
        {
          "lastname":"Smith234",
          "firstname":"Alan",
          "position":"Rho",
          "choices":[
            {
              "session":"13:30-14:45",
              "workshop":"TAS"
            },
            {
              "session":"11:45-12:45",
              "workshop":"Data Protection2"
            }
          ]
        }

      ],

      "organisation":{
        "id":"WIT",
        "name":"WIT",
        "email":"wit@wit.ie",
        "email2":"wit@wit.ie",
        "address1":"abcdefghijklmnopqrztuvwxyz",
        "address2":"abcdefghijklmnopqrztuvwxyz",
        "address3":"abcdefghijklmnopqrztuvwxyz",
        "address4":"abcdefghijklmnopqrztuvwxyz",
        "postcode":"qwerty",
        "telephone":"051051051",
        "fax":"051050051",
        "orgContactFirstname": "Joe",
        "orgContactLastname": "Bloggs"
      },
      "contact":{
        "lastname":"Bloggs",
        "firstname":"Joe",
        "email":"joe@joe.ie",
        "email2":"joe@joe.ie"
      },
      "receiptID":""
    }

    return w1;
  }

}    // getTestData













// not to be confused with AppCtrl next for the page view
appControllers.controller('AppMainCtrl', ['$rootScope','$scope', '$route', '$routeParams', 'authorisedUser'  , 'nrzLightify', 'CloudServices', 'vcRecaptchaService',
function($rootScope,$scope, $route, $routeParams, authorisedUser, nrzLightify ,cloudServices , vcRecaptchaService   ) {
  // a global controller in case needed
  console.log("AppMainCtrl");


  $rootScope.loggedIn = false;   // available to all views

  authorisedUser.setUser(Parse.User.current().attributes); //Update the state of the user in the app
  $rootScope.currentUser = Parse.User.current().attributes; // another way of sharing global data


  $rootScope.reportSaveSuccess = function(obj)
  {
    $scope.notifyMe("info",3000 , "Data Saved" );
  }

  $rootScope.reportError = function(result, err)
  {
    $scope.notifyMe("warning",5000 , "Error saving data<br>error no = " +  err.code + "<br>" +  err.message );
  }

  // used by selectionClass element directives

  // flash warning

}]); //  AppMainCtrl






appControllers.controller('HomeCtrl', ['$scope', '$routeParams','Data',
function($scope, $routeParams, Data) {
  console.log("HomeCtrl");
  $scope.aboutText =  "content from the HomeCtrl";

  $scope.uName =   Data.getuName();

  $scope.$watch('uName', function (newValue, oldValue) {
    if (newValue !== oldValue) Data.setuName(newValue);
  });

}]); // HomeCtrl


appControllers.controller('AboutCtrl', ['$scope', '$routeParams',
function($scope, $routeParams) {
  console.log("AboutCtrl");
  $scope.aboutText =  "This text is set in the controller AboutCtrl";
  $scope.menus = [
    { title:'Paging',  href: 'paging', disabled: false, active:false},
    { title:'Parse01',  href: 'parse01', disabled: true, active:false }
  ];
}]); // AboutCtrl






// In var

var prettyResult = function (data){
  var str = JSON.stringify(data, undefined, 4);   // tidy for presentation
  var prettied = syntaxHighlight(str);
  return prettied;
}

var syntaxHighlight = function (json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}



///////////
