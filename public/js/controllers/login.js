angular.module('app.controllers').controller('loginCtrl', function($scope, $location, $route, $routeParams, AuthService, $timeout) {

    $scope.warnEmail = false;
    $scope.warnPass = false;
    $scope.user = {};

    $timeout(function() {
        angular.element(document.querySelector('#loginBtn')).triggerHandler('click');
    }, 5);

    $scope.checkemail = function() {
        if (!$scope.authForm.emailinput.$valid || !$scope.user.email || $scope.user.email.length < 5) {
            $scope.$emit('showErr', true, "invalid email address");
            $scope.warnEmail = true;
        } else {
            $scope.warnEmail = false;
        }
    }

    $scope.checkpassword = function() {
        if (!$scope.user.password || $scope.user.password.length < 6) {
            $scope.$emit('showErr', true, "password is too short");
            $scope.warnPass = true;
        } else {
            $scope.warnPass = false;
        }
    }

    $scope.login = function() {
        $scope.checkemail();
        $scope.checkpassword();
        if($scope.user.email && $scope.user.password && !$scope.warnEmail && !$scope.warnPass){
            $scope.$emit('showloading', true);
            AuthService.login($scope.user.email, $scope.user.password).then(function(res) {
                $scope.$emit('showloading', false);
                if (res.status == 200) {
                    $scope.$emit('loggedIn', res.data.data);
                    $location.path('/');
                } else if (res.status == 403) {
                    $scope.$emit('showErr', true, "wrong password. please retry");
                }  else if (res.status == 404) {
                    $scope.$emit('showErr', true, "account doesn't exist");
                } else {
                    $scope.$emit('showErr', true, "something went wrong. please retry");
                }
            });
        } else {
            $scope.$emit('showErr', true, "invalid fields");
        }
    }
});