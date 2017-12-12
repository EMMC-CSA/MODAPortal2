 var app = angular.module('app', ['ngRoute', 'ngCookies', 'app.controllers', 'app.services', 'app.directives', 'ngSanitize', 'angularjs-dropdown-multiselect']);

 app.config(function($routeProvider, $locationProvider) {
   $routeProvider
   .when('/', {
     templateUrl: 'templates/home.html',
     controller: 'homeCtrl',
     access: { restricted: false }
   })

   .when('/login', {
     templateUrl: 'templates/login.html',
     controller: 'loginCtrl',
     access: { restricted: false }
   })

   .when('/register', {
     templateUrl: 'templates/register.html',
     controller: 'registerCtrl',
     access: { restricted: false }
   })

   .when('/account', {
     templateUrl: 'templates/account.html',
     controller: 'accountCtrl',
     access: { restricted: true }
   })

   .when('/modas', {
     templateUrl: 'templates/modas.html',
     controller: 'modasCtrl',
     access: { restricted: true }
   })

   .when('/modas/:modaIdParam', {
     templateUrl: 'templates/moda.html',
     controller: 'modaCtrl',
     access: { restricted: true },
   })

   .when('/newmoda', {
     templateUrl: 'templates/moda.html',
     controller: 'modaCtrl',
     access: { restricted: true }
   })

   .when('/about', {
     templateUrl: 'templates/about.html',
     controller: 'aboutCtrl',
     access: { restricted: false }
   })

   .otherwise({
     redirectTo: '/',
     access: { restricted: true }
   });


   $locationProvider.html5Mode(true);
 });

 app.constant('api', {
   baseUrl: '/api'
 });


 app.run(function($rootScope, $location, $route, AuthService) {
   AuthService.checkUserStatus();
   $rootScope.$on('$routeChangeStart',
     function(event, next, current) {
       if (next.access.restricted) {
         var nextPath = next.originalPath;
         if (nextPath == "/:modaIdParam") {
           nextPath = "/" + next.params.modaIdParam;
         }
         if (!AuthService.isLoggedIn()) {
          $location.path('/login').search({ next: nextPath.substring(1) });
          $route.reload();
        }
      }
      if (next.params.next && AuthService.isLoggedIn()) {
       var newPath = '/' + next.params.next;
       $location.path(newPath);
       $location.url($location.path());
       $route.reload();
     }
   });
 });