var genericApp =  angular.module('genericApp');

genericApp.directive('viewLoading', function(){
// show a loading data ... for asynch cloud call
  return {
    templateUrl: "js/directives/templates/loading.html"
  }
});

 
 
 