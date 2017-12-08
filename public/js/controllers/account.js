angular.module('app.controllers').controller('accountCtrl', function($scope, $timeout, $location, $route, AuthService, UsersService) {
    $scope.editMode = false;
    $scope.deactivateCounter = 0;
    $scope.loggedin = AuthService.isLoggedIn();
    $scope.warnEmail = false;
    $scope.warnPass = false;
    $scope.warnFullName = false;
    $scope.warnCountry = false;
    $scope.warnOrgName = false;

    $scope.$emit('simulateClick', 'accountBtn');

    $timeout(function() {
        angular.element(document.querySelector('#profileBtn')).triggerHandler('click');
    }, 0);

    if ($scope.loggedin) {
        UsersService.getUser(AuthService.getUserId()).then(function(res) {
            if (res.status == 200) {
                $scope.user = res.data.data;
            }
        });
    }

    $scope.checkemail = function() {
        console.log($scope.accountForm.emailinput);
        if (!$scope.accountForm.emailinput.$valid || !$scope.user.email || $scope.user.email.length < 5) {
            $scope.$emit('showErr', true, "invalid email address");
            $scope.warnEmail = true;
        } else {
            $scope.warnEmail = false;
        }
    }

    $scope.checkpassword = function() {
        if ($scope.user.password && $scope.user.password.length < 6) {
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

    $scope.handleEdit = function() {
        $scope.editMode = !$scope.editMode;
        if (!$scope.editMode){
            $scope.checkemail();
            $scope.checkpassword();
            $scope.checkfullname();
            $scope.checkorgname();
            $scope.checkcountry();
            if(!$scope.warnEmail && !$scope.warnPass && !$scope.warnFullName && !$scope.warnCountry && !$scope.warnOrgName) {
                $scope.user.email = $scope.user.email.toLowerCase();
                $scope.$emit('showloading', true);
                UsersService.updateUser($scope.user).then(function(res) {
                    $scope.$emit('showloading', false);
                    if (res.status == 200) {
                        $scope.user = res.data.data;
                    } else {
                        $scope.editMode = true;
                        if (res.data.message == "duplicate key value violates unique constraint \"users_email_key\"") {
                            $scope.warnEmail = true;
                            $scope.$emit('showErr', true, "email already in use");
                        } else {
                            $scope.$emit('showErr', true, "invalid fields");
                        }
                    }
                }); 
            } else {
                $scope.editMode = true;
                $scope.$emit('showErr', true, "invalid fields");
            }
        }
    }

    $scope.deactivateProfile = function() {
        $scope.$emit('showErr', true, "press again to confirm");
        $scope.deactivateCounter = $scope.deactivateCounter + 1;
        if ($scope.deactivateCounter == 2) {
            $scope.deactivateCounter = 0;
            $scope.$emit('showloading', true);
            UsersService.deactivateUser($scope.user.id).then(function(res) {
                $scope.$emit('showloading', false);
                if (res.status == 200) {
                    $scope.$emit('loguserout');
                } else {
                    $scope.$emit('showErr', true, "smoething went wrong");
                }
            });
        }
    }

    $scope.cancelDeactivateProfile = function() {
        $scope.deactivateCounter = 0;
        $scope.helperMsg = "";
    }
});