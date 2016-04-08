angular.module('Authorised',[]).
  factory('authorisedUser', function( ) {
 			var user;

			return{
				user : user, // watched for a changed to login/logut of parse
				setUser : function(aUser){
					user = aUser;
				},
				isLoggedIn : function(){
					return(user)? user : false;
				}
			  }
     
 });