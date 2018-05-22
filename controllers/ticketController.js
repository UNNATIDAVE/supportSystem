myApp.controller('addTickets',['$location', 'ticketService', '$rootScope', 'Upload', function($location, ticketService, $rootScope, Upload){

	var main = this;
	main.token = JSON.parse(localStorage.getItem('currentUser')).token;

	main.addTicket = function(){
		main.checkFile();
	};

	main.checkFile = function(){
		if(main.file){
			main.upload(main.file);
		}
		else{
			main.add();
		}
	};

	main.add = function(){
		var data = {
			title: main.title,
			description: main.description,
			filename: main.filename,
			token: main.token
		};

		ticketService.addTicket(data).then(function successCallback(res){
			alert(res.data.message);
			$location.path('/dashboard');
		},  function errorCallback(res){
			console.log(res);
		});
	};

	main.uploadfile = function(file){
		upload.uploadfile({
			url: 'http://localhost:3000/user/upload',
			data: {
				file: file
			}
		}).then( function (res){
			console.log(res);
			main.filename = res.data.data;
			main.add();
		}, function(res){
			console.log(res);
		}, function(evt){
			var progressPercent = parseInt(100.0 * evt.loaded / evt.total);
			main.progress = 'progress: ' + progressPercent + '% ';
		});
	};

}]);