myApp.service('accountService', function($http){

	var main = this;
	this.indexUrl = "http://localhost:3000";

	this.register = function(data){
		return $http.post(main.indexUrl + '/register', 'data');
	};
	this.login = function(data){
		return $http.post(main.indexUrl + '/login', 'data');
	};

	this.forgotPassword = function(data){
		return $http.post(main.indexUrl + '/forgot-pass', 'data');
	};
});