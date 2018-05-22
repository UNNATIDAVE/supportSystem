myApp.controller('userController', ['$location', '$rootScope', 'accountService', 'jwtHelper', function($location, $rootScope, accountService, jwtHelper){

	var main = this;

	this.loginMsg = "Login to your Account";
	this.registerMsg = "Create an account";
	this.changePass = "Enter a new password";
	this.uniqueMsg = "Enter Unique String";
	this.error = "";
	this.firstName = "";
	this.lastName = "";
	this.email = "";
	this.mobile = "";
	this.password = "";
	this.res="";
	this.registerForm = "";
	this.otp = "";
	this.check = "";
	this.newPass = "";
	this.newPass1 = "";
	$rootScope.show = false;
	this.closeButton = "";

	this.register = function(){
		var data = {
			firstName : main.firstName,
			lastName : main.lastName,
			email : main.email,
			mobile: main.mobile,
			password : main.password
		};

		accountService.register(data).then(function successCallBack(res){
			main.error = res.data.error;
			main.registerMsg = res.data.message;
		}, function errorCallback(res){
			alert("Some error Occured");
		});
		this.firstName = "";
		this.lastName = "";
		this.email = "";
		this.mobile = "";
		this.password = "";
	};

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
				console.log("Error");
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
			email: main.email
		};

		accountService.forgotPassword(data).then(function successCallBack(res){
			main.email = "";
		}, function errorCallback(res){
			console.log(data);
		});
	};

	this.verifyUnique = function(){
		var otp = main.otp;
		accountService.verifyUnique(otp).then(function successCallBack(res){
			main.check = res.data.error;
			main.uniqueMsg = res.data.message;
			main.otp = "";
		}, function errorCallback(res){
			console.log(res.data);
		});
	};

	this.resetPassword = function(){
		if(this,newPass != this.newPass1){
			alert("Password didn't match");
			main.newPass = "";
			main.newPass1 = "";
		}
		else{
			var data = {
				password: main.newPass
			};
			accountService.resetPassword(data).then(function successCallBack(res){
				main.changePass = res.data.message;
				main.newPass = "";
				main.newPass1 = "";
			}, function errorCallback(res){
				console.log(res);
			});
		}
	};

	this.logOut = function(){
		alert("You are loged Out now!!!!");
		localStorage.removeItem('currentUser');
		localStorage.removeItem('username');
		$rootScope.show = false;
		$location.path('/');
	};

}]);
