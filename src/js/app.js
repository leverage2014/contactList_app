var contactListApp = angular.module('contactListApp', ['ui.router', 'appControllers']);

contactListApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home',{
        url: '/home',
        views: {
            '': {
                 templateUrl: '/templates/home.html'
             },
            'contents@home': {
                templateUrl: '/templates/front_page.html'
            }
        }
    }).state('login', {
        url: '/login',
        views: {
            '': {
                templateUrl: '/templates/home.html'
            },
            'contents@login': {
                templateUrl: '/templates/login.html'
            }
        }
    }).state('signup',{
        url: '/signup',
        views:{
            '': {
                templateUrl: '/templates/home.html'
            },
            'contents@signup': {
                templateUrl: '/templates/signup.html'
            }
        }
    }).state('contacts', {
        url: '/contacts',
        views:{
            '': {
                templateUrl: '/templates/home.html'
            },
            'contents@contacts': {
                templateUrl: '/templates/contactsDisplay.html'
            }
        }
    });
}]);
