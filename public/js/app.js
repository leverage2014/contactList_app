var contactListApp = angular.module('contactListApp', []);

contactListApp.controller('listCtrl', ['$scope', function($scope){
	$scope.greeting = 'This is a contact list app';
	
}]);