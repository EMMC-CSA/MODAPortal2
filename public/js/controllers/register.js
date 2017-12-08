angular.module('app.controllers').controller('registerCtrl', function($scope, $location, $route, $routeParams, AuthService, 
    UsersService, $timeout) {

    $scope.warnEmail = false;
    $scope.warnPass = false;
    $scope.warnFullName = false;
    $scope.warnCountry = false;
    $scope.warnOrgName = false;
    $scope.user = {};

    $timeout(function() {
        angular.element(document.querySelector('#registerBtn')).triggerHandler('click');
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

    $scope.checkfullname = function() {
        if (!$scope.user.name || $scope.user.name.length < 4) {
            $scope.$emit('showErr', true, "invalid name");
            $scope.warnFullName = true;
        } else {
            $scope.warnFullName = false;
        }
    }

    $scope.checkorgname = function() {
        if (!$scope.user.org_name || $scope.user.org_name.length < 2) {
            $scope.$emit('showErr', true, "invalid name");
            $scope.warnOrgName = true;
        } else {
            $scope.warnOrgName = false;
        }
    }

    $scope.checkcountry = function() {
        if (!$scope.user.country || $scope.user.country.length < 2) {
            $scope.$emit('showErr', true, "invalid country");
            $scope.warnCountry = true;
        } else {
            $scope.warnCountry = false;
        }
    }

    $scope.register = function() {
        $scope.checkemail();
        $scope.checkpassword();
        $scope.checkfullname();
        $scope.checkorgname();
        $scope.checkcountry();
        if($scope.user.email && $scope.user.password && $scope.user.name && $scope.user.org_name && $scope.user.country && !$scope.warnEmail && !$scope.warnPass && !$scope.warnFullName && !$scope.warnCountry && !$scope.warnOrgName){
            $scope.$emit('showloading', true);
            AuthService.register($scope.user).then(function(res) {
                $scope.$emit('showloading', false);
                if (res.status == 201) {
                    $scope.login();
                } else {
                    $scope.$emit('showErr', true, "something went wrong. please retry");
                }
            });
        } else {
            $scope.$emit('showErr', true, "invalid fields");
        }
    }

    $scope.login = function() {
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
    }
});