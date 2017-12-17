angular.module('app.services').factory('AuthService', function(api, $http, $cookies) {

    function isLoggedIn() {
        if ($cookies.get('emmcusercookie')) {
            return true;
        } else {
            return checkUserStatus();
        }
    }

    function getUserId() {
        return $cookies.get('emmcusercookie');
    }

    function checkUserStatus() {
        var req = {
            method: 'GET',
            url: api.baseUrl + '/auth/status'
        }
        
        return $http(req)
        .then(function successCallback(res) {
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 365);
            $cookies.put('emmcusercookie', res.data.data.id, { 'expires': expireDate });
            return true;
        }, function errorCallback(res) {
            if (res.status == 401) {
                $cookies.remove('emmcusercookie');
            }
            return false;
        });
    }


    function login(email, password) {
        var reqdata = { username: email, password: password };
        var req = {
            method: 'POST',
            url: api.baseUrl + '/auth/login',
            data: reqdata
        }

        return $http(req)
        .then(function successCallback(res) {
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 365);
            $cookies.put('emmcusercookie', res.data.data.id, { 'expires': expireDate });
            return res;
        }, function errorCallback(res) {
            return res;
        });
    }

    function logout() {
        var req = {
            method: 'GET',
            url: api.baseUrl + '/auth/logout'
        }

        return $http(req)
        .then(function successCallback(res) {
            $cookies.remove('emmcusercookie');
            return res;
        }, function errorCallback(res) {
            return res;
        });
    }

    function register(reqdata) {
        var req = {
            method: 'POST',
            url: api.baseUrl + '/auth/register',
            data: reqdata
        }

        return $http(req)
        .then(function(res) {
            return res;
        }, function(res) {
            return res;
        });
    }

    function forgotpassword(email) {
        var req = {
            method: 'POST',
            url: api.baseUrl + '/auth/forgotpass',
            data: { email: email }
        }

        return $http(req)
        .then(function(res) {
            return res;
        }, function(res) {
            return res;
        });
    }

    return ({
        isLoggedIn: isLoggedIn,
        checkUserStatus: checkUserStatus,
        getUserId: getUserId,
        login: login,
        logout: logout,
        register: register,
        forgotpassword: forgotpassword
    });
});