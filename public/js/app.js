var contactListApp = angular.module('contactListApp', []);

contactListApp.controller('listCtrl', ['$scope', function($scope){
	$scope.greeting = 'Contact List App';
	$scope.addFlag = false;

	var person1 = {
        name: 'Time',
        email: 'tim@gmail.com',
        number: '(111)-111-1111'
    };
    
    var person2 = {
        name: 'Emily',
        email: 'emily@gmail.com',
        number: '(222)-222-2222'
    };
    
    var person3 = {
        name: 'John',
        email: 'john@gmail.com',
        number: '(333)-333-3333'
    };
    
    var contactlist = [person1, person2, person3];
    
    $scope.contactList = contactlist;

    $scope.addContact = function(){
    	var newContact = $scope.contact;
    	$scope.contactList.push($scope.contact);
    	console.log('enter addContact');
    	console.log($scope.contact);
    	$scope.contact = null;
    };

    $scope.updateContact = function(){
    
    	if(typeof $scope.contact === 'undefined'){
    	    throw new Error("Pease select a contact to edit!");
    	}
    	$scope.contactList[$scope.contact.index] = $scope.contact;
    	$scope.contact = null;
    	$scope.addFlag = false;
    };

    $scope.remove = function(name){
    	var foundIndex;
    	$scope.contactList.forEach(function(contact,index){
    		if(contact.name === name){
    			foundIndex = foundIndex;
    		}
    	});

    	$scope.contactList.splice(foundIndex, 1);
    };

    $scope.edit = function(one){
    	$scope.contact = one;
    	var index = $scope.contactList.indexOf(one);
    	console.log(index);
    	$scope.contact.index = index;
    	$scope.addFlag = true;
    };

    $scope.deselect = function(){
    	$scope.contact = null;
    }

}]);