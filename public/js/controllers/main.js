angular.module('app.controllers', []).controller('mainCtrl', function($scope, $location, $route, $timeout, AuthService) {
    $scope.loggedin = AuthService.isLoggedIn();
    $scope.showLoading = false;
    $scope.showErr = false;
    $scope.errMsg = "";
    
    $scope.$on('simulateClick', function(event, data) {
        $timeout(function() {
            angular.element(document.querySelector("#" + data)).triggerHandler('click');
        }, 0);
    });

    $scope.$on('showloading', function(event, data) {
        $scope.showLoading = data;
    });

    $scope.$on('showErr', function(event, data, msg) {
        $scope.errMsg = msg;
        $scope.showErr = data;
        $timeout(function() {
            $scope.showErr = false;
        }, 2000);
    });

    $scope.$on('loggedIn', function(event, data) {
        $scope.loggedin = true;
        $scope.is_employer = data.is_employer;
    });

    $scope.$on('loguserout', function(event, data) {
        $scope.logout();
    });


    $scope.logout = function() {
        $scope.showLoading = true;
        angular.element(document.querySelector("#about")).find("h5").removeClass("underlined");
        AuthService.logout().then(function(res) {
            $scope.showLoading = false;
            if (res.status = 200) {
                $scope.loggedin = false;
                $location.path('/');
                $route.reload();
            }
        });
    }
});