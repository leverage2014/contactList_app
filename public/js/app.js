var contactListApp = angular.module('contactListApp', []);

contactListApp.controller('listCtrl', ['$scope', '$http', function($scope, $http){
	$scope.greeting = 'Contact List App';
	$scope.addFlag = false;

	$scope.getData = function(){
        $http.get('/contacts').success(function (response) {
            console.log("i got the data from server: \n");
            console.log(response);
            $scope.contactList = response;
        });
	}

	$scope.getData();

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