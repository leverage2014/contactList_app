var contactListApp = angular.module('contactListApp', []);

contactListApp.controller('listCtrl', ['$scope', '$http', function($scope, $http){
	$scope.greeting = 'Contact List App';
	$scope.addFlag = false;
	$scope.contact = {};
	
	$scope.getData = function(){
        $http.get('/contacts').success(function (response) {
            console.log("i got the data from server: \n");
            console.log(response);
            $scope.contactList = response;
            $scope.contact = {};
        });
	}

	$scope.getData();

    $scope.addContact = function(){

    	if(typeof $scope.contact.name === 'undefined' ||
    	   typeof $scope.contact.email === 'undefined' ||
    	   typeof $scope.contact.number === 'undefined'){
    		alert('Illegal input');
    		return;
    	}

    	$http.post('/contacts', $scope.contact).success(function (response) {
            console.log("resposne:" +response);
            $scope.getData();
        });
    };

    $scope.updateContact = function(){
        $http.put('/contacts/'+$scope.contact._id, $scope.contact).success(function (response) {
            $scope.getData();
        });
        $scope.addFlag = false;
    };

    $scope.remove = function(id){
    	console.log(id);
    	$http.delete('/contacts/'+id).success(function (response) {
            $scope.getData();
        });
    };

    $scope.edit = function(one){

    	// cut off the connection between selected and input 
    	angular.copy(one, $scope.contact);
    	$scope.addFlag = true;
    };

    $scope.deselect = function(){
    	$scope.contact = null;
    }

}]);