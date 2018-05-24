myApp.controller('mainCtrl',['$location', '$rootScope', 'ticketService', function($location, $rootScope,ticketService){

	var main = this;

	this.tickets = '';
	this.status = '';
	this.search = '';

	main.username = JSON.parse(localStorage.getItem('currentUser')).username;

	main.token = JSON.parse(localStorage.getItem('currentUser')).token;
   
	this.add = function(){
		$location.path('/addTicket');
	};

	this.open = function(){
		main.status = "open";
	};
	this.close = function(){
		main.status = "close";
	};

	this.all = function(){
		main.status = '';
	};

	this.userTickets = function(){
		ticketService.getUserTickets(main.token).then(function successCallback(res){
			console.log(res.data.data);
			main.tickets = res.data.data;
		}, 
		function errorCallback(res){
			console.log(res);
		});
	};

	this.allTickets = function(){
		ticketService.allTickets(main.token).then(function successCallback(res){
			main.tickets = res.data.data;
		},
		function errorCallback(res){
			console.log(res);
		});
	};

	if(JSON.parse(localStorage.getItem('currentUser')).username == "admin@supportsystem.com"){
		main.allTickets();
		main.admin = true;
	}else{
		main.userTickets();
		main.admin = false;
	}
}]);