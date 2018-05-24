myApp.controller('userController', ['$location', '$rootScope', 'accountService', 'jwtHelper', function($location, $rootScope, accountService, jwtHelper){

	var main = this;

	this.registerMsg = "Create an account";
	this.changePassword = "password change successfully";
	this.error = "";
	this.firstName = "";
	this.lastName = "";
	this.email = "";
	this.mobile = "";
	this.password = "";
	this.response="";
	this.registerForm = "";
	this.newPass = "";
	$rootScope.show = false;
	this.closeButton = "";

	this.register = function(){
		 console.log(main.email);
		var data = {
			firstName : main.firstName,
			lastName : main.lastName,
			email : main.email,
			mobile: main.mobile,
			password : main.password
		};
		console.log("data successCallback" + data);

		accountService.register(data).then(function successCallback(response) {
            console.log(response.data.error);
            console.log(response.data.message);
            main.error = response.data.error;
            main.registerMessage = response.data.message;

        }, function errorCallback(response) {
            alert("Some error Occured");
        });
        this.firstname = "";
        this.lastname = "";
        this.email = "";
        this.mobile = "";
        this.password = "";

    }; // end register module


	this.login = function(){
		var temp = main.email;
		var data = {
			email: main.email,
			password: main.password
		};

		accountService.login(data).then(function successCallBack(res){
			main.error = res.data.error;
			main.loginMsg = res.data.message;
			if(res.data.error){
				alert("Please Enter valid mail ID");
			}	
			else{
				main.closeButton = res.data.error;
				$rootScope.show = true;
				var token ={
					username: temp,
					token: res.data.token
				};
				console.log(token);
				var userinfo = jwtHelper.decodeToken(res.data.token);

				console.log(userinfo);
				localStorage.setItem('username', userinfo.firstName + ' ' + userinfo.lastName);
				localStorage.setItem('currentUser', JSON.stringify(token));
				$location.path('/dashboard');
			}
		},
		function errorCallback(res){
			alert("Some error occured");
		});

		this.email = "";
		this.password = "";
	};

	this.forgotPass = function(){
		var data = {
			email: main.email,
			password: main.newPass
		};
		accountService.forgotPass(data).then(function successCallBack(res){
			 console.log(res.data.error);
            console.log(res.data.message);
            main.error = res.data.error;
            main.changePass = res.data.message;
		}, function errorCallback(res){
			console.log(data);
		});
		this.email = "";
        this.newPass = "";
	};

	this.logOut = function(){
		alert("You are loged Out now!!!!");
		localStorage.removeItem('currentUser');
		localStorage.removeItem('username');
		$rootScope.show = false;
		$location.path('/');
	};

}]);