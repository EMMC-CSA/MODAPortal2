angular.module('app.controllers').controller('aboutCtrl', function($scope, $timeout, $window) {
    $timeout(function() {
    	$window.scrollTo(0, 0);
        angular.element(document.querySelector('#aboutBtn')).triggerHandler('click');
    }, 5);

});