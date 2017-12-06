angular.module('app.services').factory('ModasService', function(api, $http) {
    var user = null;

    function addModa(moda) {
        var payload = new FormData();
        payload.append('modajson', JSON.stringify(moda));
        
        var req = {
            method: 'POST',
            url: api.baseUrl + '/modas/',
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity,
            data: payload
        }

        return $http(req)
        .then(function successCallback(res) {
            return res;
        }, function errorCallback(res) {
            return res;
        });
    }

    function updateModa(moda, modaId) {
        var payload = new FormData();
        payload.append('modajson', JSON.stringify(moda));

        if (moda.oldfilepath)
            payload.append('oldfilepath', moda.oldfilepath);

        var req = {
            method: 'POST',
            url: api.baseUrl + '/modas/' + modaId,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity,
            data: payload
        }

        return $http(req)
        .then(function successCallback(res) {
            return res;
        }, function errorCallback(res) {
            return res;
        });
    }

    function getAllModas(offset) {
        var req = {
            method: 'GET',
            url: api.baseUrl + '/modas/all/' + offset
        }

        return $http(req)
        .then(function successCallback(res) {
            return res;
        }, function errorCallback(res) {
            return res;
        });
    }

    function getUserModas(offset) {
        var req = {
            method: 'GET',
            url: api.baseUrl + '/modas/usermodas/' + offset
        }

        return $http(req)
        .then(function successCallback(res) {
            return res;
        }, function errorCallback(res) {
            return res;
        });
    }

    function getModa(modaId) {
        var req = {
            method: 'GET',
            url: api.baseUrl + '/modas/' + modaId
        }

        return $http(req)
        .then(function successCallback(res) {
            return res;
        }, function errorCallback(res) {
            return res;
        });
    }

    function deleteModa(modaId) {
        var req = {
            method: 'DELETE',
            url: api.baseUrl + '/modas/' + modaId
        }

        return $http(req)
        .then(function successCallback(res) {
            return res;
        }, function errorCallback(res) {
            return res;
        });
    }

    return ({
        addModa : addModa,
        updateModa : updateModa,
        getAllModas : getAllModas,
        getUserModas : getUserModas,
        getModa: getModa,
        deleteModa : deleteModa
    });
});