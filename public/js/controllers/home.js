angular.module('app.controllers').controller('homeCtrl', function($scope, AuthService, UsersService, $window, $routeParams, $timeout, $location, $route) {
    $scope.loggedin = AuthService.isLoggedIn();

    $timeout(function() {
        angular.element(document.querySelector(".footerBtn")).find("h5").removeClass("underlined");
        angular.element(document.querySelector("#toolbar")).find("h5").removeClass("underlined");
    }, 20);

    if ($scope.loggedin) {
        UsersService.getUser(AuthService.getUserId()).then(function(res) {
            if (res.status == 200) {
                $scope.user = res.data.data;
            }
        });
    }

});