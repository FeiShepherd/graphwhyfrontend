// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var pathway;
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  if(typeof pathway !== 'undefined'){
    if(pathway.substr(1).indexOf('/') == -1){
      pathway = window.location.pathname.substr(1)
    }
  }

  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('app.welcome', {
      url: '/welcome',
      views: {
        'menuContent': {
          templateUrl: 'templates/welcome.html',
          controller: 'welcomeCtrl'
        }
      }
    })
    .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.myquestions', {
      url: '/myquestions',
      views: {
        'menuContent': {
          templateUrl: 'templates/myquestions.html',
          controller: 'myquestionsCtrl'
        }
      }
    })
    .state('app.graphs', {
      url: '/graphs',
      views: {
        'menuContent': {
          templateUrl: 'templates/database.html',
          controller: 'graphsCtrl'
        }
      }
    })
    .state('app.create', {
      url: '/create',
      views: {
        'menuContent': {
          templateUrl: 'templates/create.html',
          controller: 'createCtrl'
        }
      }
    })
    .state('app.aboutus', {
      url: '/aboutus',
      views: {
        'menuContent': {
          templateUrl: 'templates/aboutus.html'
        }
      }
    })
    .state('app.toupp', {
      url: '/toupp',
      views: {
        'menuContent': {
          templateUrl: 'templates/toupp.html'
        }
      }
    })
    .state('app.dmca', {
      url: '/dmca',
      views: {
        'menuContent': {
          templateUrl: 'templates/dmca.html'
        }
      }
    })
    .state('app.t', {
      url: '/t/:tag',
      views: {
        'menuContent': {
          templateUrl: 'templates/question.html',
          controller: 'questionCtrl'
        }
      }
    })
    $locationProvider.html5Mode(true);
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/welcome');
});
