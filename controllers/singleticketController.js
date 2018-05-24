myApp.controller('singleTicket', ['$routeParams', '$route', '$location', 'ticketService', function($routeParams, $route, $location, ticketService){

	console.log($routeParams.ticketId);
	var main = this;

	this.username = JSON.parse(localStorage.getItem('currentUser')).username;
    this.token = JSON.parse(localStorage.getItem('currentUser')).token;

	this.ticketId = $routeParams.ticketId;
	ticketService.getSingleTicket({
		ticketId: main.ticketId,
		token: main.token
	}).then(function successCallback(res){
		console.log(res);
		main.ticket = res.data.data;
		main.email = res.data.email;
	}, function errorCallback(res){
		console.log(res);
	});

	this.changeStatus = function(id){
		var data = {
			id: id,
			email: main.email,
			token: main.token
		};

		ticketService.changeStatus(data).then(function successCallback(res){
			alert(res.data.message);
			$location.path('/dashboard');
		}, function errorCallback(res){
			console.log(res);
		});
	};

	this.deleteTicket = function(data){
		ticketService.deleteTicket({
			id: data,
			token: main.token
		}).then(function successCallback(res){
			console.log(res);
			alert(res.data.message);
			$location.path('/dashboard');
		}, function errorCallback(res){
			console.log(res);
		});
	};

	this.checkAdmin = function(id){
		if(JSON.parse(localStorage.getItem('currentUser')).username == "admin@supportsystem.com"){
			main.adminMessage(id);
		}
		else{
			main.sendMessage(id);
		}
	};

	this.sendMessage = function(id){
		var data = {
			message: main.message,
			id: id,
			token: main.token
		};
		//console.log(data.id);

		ticketService.sendMessage(data).then(function successCallback(res){
			console.log(res);
			$route.reload();
		}, function errorCallback(res){
			console.log(res);
		});
	};

	this.adminMessage = function(id){
		var data = {
			message : main.message,
			id: id,
			username: main.email,
			token: main.token
		};

		ticketService.adminMessage(data).then(function successCallback(res){
		$route.reload();	
		}, function errorCallback(res){
			console.log(res);
		});
	};
}]);