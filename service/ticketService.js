myApp.service('ticketService', function($http){
	var main = this;

	this.baseUrl = "http://localhost:3000/";

	// to get all the tickets
	this.getUserTickets = function(token){
		return $http.get(main.baseUrl + 'user/tickets',{
			headers: {
				'x-access-token': token
			}
		});
	};

	// to get single ticket
	this.getSingleTicket = function(data){
		return $http.get(main.baseUrl + 'user/ticket/' + data.ticketId, {
			headers: {
				'x-access-token': data.token
			}
		});
	};

	//to add ticket
	this.addTicket = function(data){

		return $http.post(main.baseUrl + 'user/create', data, {
			headers: {
				'x-access-token': data.token
			}
		});
	};

	// for status change
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

	// for delete ticket
	this.deleteTicket = function(data){
		return $http.delete(main.baseUrl + 'user/deleteticket/' + data.id, {
			headers: {
				'x-access-token': data.token
			}
		});
	};

	// for user send message
	this.sendMessage = function(data){
		var message = {
			message: data.message
		};
		console.log(data.id);

		return $http.post(main.baseUrl + 'user/message/' + data.id , message , {
			headers: {
				'x-access-token': data.token
			}
		});
	};

	//for admin all tickets
	this.allTickets = function(token){

		return $http.get(main.baseUrl + 'user/admin/tickets', {
			headers: {
				'x-access-token': token
			}
		});
	};

	// message for admin
	this.adminMessage = function(data){
		var message = {
			message: data.message,
			username: data.username
		};

		return $http.post(main.baseUrl + 'user/admin/message/' + data.id, message, {
			headers: {
				'x-access-token': data.token
			}
		});
	};

});