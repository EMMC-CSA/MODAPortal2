angular.module('app.services').factory('UsersService', function(api, $http) {
    var user = null;

    function exists(email) {
        var req = {
            method: 'GET',
            url: api.baseUrl + '/users/' + email
        }

        return $http(req)
            .then(function successCallback(res) {
                return res;
            }, function errorCallback(res) {
                return res;
            });
    }

    function getUser(id) {
        var req = {
            method: 'GET',
            url: api.baseUrl + '/users/' + id
        }

        return $http(req)
            .then(function successCallback(res) {
                return res;
            }, function errorCallback(res) {
                return res;
            });
    }

    function getUserByEmail(email) {
        var req = {
            method: 'GET',
            url: api.baseUrl + '/users/' + email
        }

        return $http(req)
            .then(function successCallback(res) {
                return res;
            }, function errorCallback(res) {
                return res;
            });
    }

    function updateUser(user) {
        var req = {
            method: 'PUT',
            url: api.baseUrl + '/users/' + user.id,
            data: user
        }

        return $http(req)
            .then(function successCallback(res) {
                return res;
            }, function errorCallback(res) {
                return res;
            });
    }

    function deactivateUser(userid) {
        var req = {
            method: 'DELETE',
            url: api.baseUrl + '/users/' + userid
        }

        return $http(req)
            .then(function successCallback(res) {
                return res;
            }, function errorCallback(res) {
                return res;
            });
    }

    return ({
        exists: exists,
        getUser: getUser,
        getUserByEmail: getUserByEmail,
        updateUser: updateUser,
        deactivateUser: deactivateUser
    });
});