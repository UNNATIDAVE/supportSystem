myApp.service('ticketService', function($http){
	var main = this;

	this.baseUrl = "http://localhost:3000/";
	this.getUserTickets = function(token){
		return $http.get(main.baseUrl + 'user/tickets',{
			headers: {
				'x-access-token': token
			}
		});
	};

	this.getSingleTicket = function(data){
		return $http.get(mainbaseUrl + 'user/ticket/' + data.ticketId, {
			headers: {
				'x-access-token': data.token
			}
		});
	};

	this.addTicket = function(data){

		return $http.post(main.baseUrl + 'user/create', data, {
			headers: {
				'x-access-token': data.token
			}
		});
	};

	this.changeStatus = function(data){
		console.log(data);
		var email = {
			email: data.email
		};
		return $http.post(main.baseUrl + 'user/ticket/statusChange/' + data.id, email, {
			headers: {
				'x-access-token': data.token
			}
		});
	};

	this.deleteTicket = function(data){
		return $http.delete(main.baseUrl + 'user/deletetcket/' + data.id, {
			headers: {
				'x-access-token': data.token
			}
		});
	};

	this.sendMsg = function(data){
		var message = {
			message: data.message
		};

		return $http.get(main.baseUrl + 'user/message', {
			headers: {
				'x-access-token': data.token
			}
		});
	};

	this.allTickets = function(data){

		return $http.get(main.baseUrl + 'user/admin/tickets', {
			headers: {
				'x-access-token': token
			}
		});
	};

	this.sendMsg = function(data){
		var message = {
			message: data.message,
			username: data.username
		};

		return $http.get(main.baseUrl + 'user/admin/message/' + data.id, message, {
			headers: {
				'x-access-token': data.token
			}
		});
	};

});