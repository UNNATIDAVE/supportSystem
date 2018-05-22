myApp.config(['$routeProvider', '$locationProvider', 'jwtInterceptorProvider', function($routeProvider, $locationProvider, $rootScope, jwtInterceptorProvider){

	$routeProvider
		.when('/', {
			templateUrl: '/views/home.html',
			controller: 'userController',
			controllerAs: 'account'
		})

		.when('/dashboard', {
			templateUrl: '/views/dashboard.html',
			resolve: {
				"check": function($location, $rootScope, jwtHelper){
					if(localStorage.getItem('currentUser')){

						var token = JSON.parse(localStorage.getItem('currentUser')).token;
						if(jwtHelper.isTokenExpired(token)){
							alert("Token Expired...");
							$location.path('/');
							$rootScope.show = false;
						}
						else{
							$rootScope.show = true;
						}
					}
					else{
						$location.path('/');
						$rootScope.show = false;
					}
				}
			},
			controller: 'mainCtrl',
			controllerAs: 'main'
		})	

		.when('/ticketView/:ticketId', {
			templateUrl: 'views/singleTicket.html',
			controller: 'singleTicket',
			controllerAs: 'single',
			resolve: {
				"check": function($location, $rootScope, jwtHelper){
					if(localStorage.getItem('currentUser')){
						var token = JSON.parse(localStorage.getItem('currentUser')).token;

						if(jwtHelper.isTokenExpired(token)){
							alert("Token Expired");
							$location.path('/');
							$rootScope.show = false;
						}
						else{
							$rootScope.show = true;
						}
					}
					else{
						$location.path('/');
						$rootScope.show = false;
					}
				}
			}
		})


		.when('/addTicket', {
			templateUrl: 'views/addTicket.html',
			controller: 'addTickets',
			controllerAs: 'add',
			resolve: {
				"check" : function($location, $rootScope, jwtHelper){
					if(localStorage.getItem('currentUser')){
						var token = JSON.parse(localStorage.getItem('currentUser')).token;

						if(jwtHelper.isTokenExpired(token)){
							alert("Token Expired");
							$location.path('/');
							$rootScope.show = false;
						}
						else{
							$rootScope.show = true;
						}
					}	
					else{
						$location = '/';
						$rootScope = false;
					}			
				}
			}
		})
		.otherwise({
			redirectTo: '/'
		});

		$locationProvider.html5Mode({
			enabled: false,
			requireBase: false
		});
}]);