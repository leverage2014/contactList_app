var appControllers = angular.module('appControllers', ['ui.router']);

appControllers.controller('appCtrls', ['$scope', '$http', '$state', function($scope, $http, $state){

    $scope.auth = '';
	$scope.addFlag = false;
	$scope.contact = {};

    //  $scope.location = {};
    // $scope.getlocation = function(){
    //     $http.get('http://ipinfo.io').success(function(data){
    //        console.log(data);
    //        $scope.location.city = data.city;
    //        $scope.location.region = data.region;
    //     });
    // }
    // $scope.getlocation();

    $scope.createUser = function(user){
        console.log('sign up user');
        console.log(user);

        // POST /users
        $http.post('/users', user).success(function(user){
            console.log(user);
            if(confirm("You have successfully registered! Please login!")){
                $state.go('login');
            }
        }).error(function(err){
            if(err === 'duplicated email found!'){
                alert('The email was registed!');
                $scope.reset(user);
            }
        });

    }

    $scope.reset = function(user){
        console.log(user);
        user.email = '';
        user.password = '';
        $scope.agreeTerm = false; // no effects??
    }

    $scope.login = function(user){
        console.log('login user');
        console.log(user);

        $http.post('/users/login', user).then(function(successRes){
            $scope.auth = successRes.headers().auth;  // obtain Auth info in the HTTP header

            console.log('===== obtained token ========');
            console.log($scope.auth);

            $http({
                method: "GET",
                url: "/contacts",
                headers: {
                    Auth: $scope.auth  // add Auth to HTTP header
                }
            }).then(function(successRes){
                console.log('successfull!');
                console.log(successRes);
                $scope.contactList = successRes.data;

                console.log('----------');
                console.log($scope.contactList);
                $scope.contact = {};
                $state.go('contacts');

            }, function(failRes){
                if(parseInt(failRes.headers().status) === 401 ){
                    alert('Email or Password is invalid!');
                } else if(parseInt(failRes.headers().status) === 500 ){
                    alert('The server is busy! Please try again later!');
                }
            });

        }, function(failRes){
            console.log(failRes);
            if(parseInt(failRes.headers().status) === 401 ){
                alert('Email or Password is invalid!');
            } else if(parseInt(failRes.headers().status) === 500 ){
                alert('The server is busy! Please try again later!');
            }

        });
    }

    $scope.logout = function(){
        var logout = confirm('Do you really want to logout?');
        console.log(logout);

        if(logout){
            $http({
                method: "DELETE",
                url: "/users/logout",
                headers: {
                    Auth: $scope.auth,  // add Auth to HTTP header
                }
            }).then(function(successRes){
                $scope.auth = ''
                $state.go('home');
             //   alert('You have successfully logout!');
            }, function(failedRes){
                alert('The server is busy! Please try again later!');
            });
        }


    }

    $scope.addContact = function(){

    	if(typeof $scope.contact.name === 'undefined' ||
    	   typeof $scope.contact.email === 'undefined' ||
    	   typeof $scope.contact.number === 'undefined'){
    		alert('Illegal input');
    		return;
    	}

      //  console.log($scope.contact);

        $http({
            method: "POST",
            url: "/contacts",
            headers: {
                Auth: $scope.auth,  // add Auth to HTTP header
                'Content-Type': 'application/json'
            },
            data: $scope.contact
        }).then(function(successRes){
            console.log('contact received');
            console.log(successRes.data);

            // re-obtain the list
            $http({
                method: "GET",
                url: "/contacts",
                headers: {
                    Auth: $scope.auth  // add Auth to HTTP header
                }
            }).then(function(successRes){
                console.log('successfull!');
                console.log(successRes);
                $scope.contactList = successRes.data;

                console.log('----------');
                console.log($scope.contactList);
                $scope.contact = {};
                $state.go('contacts');

            }, function(failRes){
                console.log('failed!');
                console.log(failRes);
                alert('The server is busy! Please try again later!');
            });
        }, function(failedRes){
            console.log(failedRes.data);
        });
    };

    $scope.updateContact = function(user){
        console.log(user);

        $http({
            method: "PUT",
            url: "/contacts/" + user._id,
            headers: {
                Auth: $scope.auth,  // add Auth to HTTP header
                'Content-Type': 'application/json'
            },
            data: user
        }).then(function(successRes){
            console.log('contact received');
            console.log(successRes.data);

            // re-obtain the list
            $http({
                method: "GET",
                url: "/contacts",
                headers: {
                    Auth: $scope.auth  // add Auth to HTTP header
                }
            }).then(function(successRes){
                console.log('successfull!');
                console.log(successRes);
                $scope.contactList = successRes.data;

                console.log('----------');
                console.log($scope.contactList);
                $scope.contact = {};
                $state.go('contacts');

            }, function(failRes){
                console.log('failed!');
                console.log(failRes);
                alert('The server is busy! Please try again later!');
            });
        }, function(failedRes){
            console.log(failedRes.data);
        });

        $scope.contact = {};
        $scope.addFlag = false;
    };

    $scope.remove = function(id){
    	console.log(id);

        $http({
            method: "DELETE",
            url: "/contacts/"+id,
            headers: {
                Auth: $scope.auth,  // add Auth to HTTP header
            }
        }).then(function(successRes){
            console.log('contact received');
            console.log(successRes.data);

            // re-obtain the list
            $http({
                method: "GET",
                url: "/contacts",
                headers: {
                    Auth: $scope.auth  // add Auth to HTTP header
                }
            }).then(function(successRes){
                console.log('successfull!');
                console.log(successRes);
                $scope.contactList = successRes.data;

                console.log('----------');
                console.log($scope.contactList);
                $scope.contact = {};
                $state.go('contacts');

            }, function(failRes){
                console.log('failed!');
                console.log(failRes);
                alert('The server is busy! Please try again later!');
            });


        }, function(failedRes){
            console.log(failedRes.data);
        });

    };

    $scope.edit = function(one){
    	// cut off the connection between selected and input
    	angular.copy(one, $scope.contact);
        console.log(one);

    	$scope.addFlag = true;
    };

    $scope.deselect = function(){
    	$scope.contact = {};
        $scope.addFlag = false;
    }

}]);