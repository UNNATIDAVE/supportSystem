(function() {
    'use strict';

    myApp.component('navigation', {
           templateUrl: 'views/header-view.html',
           controller: "userController",
           controllerAs: "account",
            bindings: {
                navigation: '<'
            }
        });
})();