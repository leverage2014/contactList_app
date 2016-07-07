var appControllers = angular.module('appControllers', ['ui.router', 'ngCookies']);

appControllers.controller('appCtrls', ['$scope', '$http', '$state', '$cookies', '$interval', function($scope, $http, $state, $cookies, $interval){

    $scope.auth = '';
	$scope.addFlag = false;
	$scope.contact = {};
    $scope.user = {};

    $scope.stopTimer = function(){
        $interval.cancel($scope.idleIntervalTimer);
    }
    $scope.stopTimer();

    // detect inactivity
    $scope.idleTime = 0;
    $(document).mousemove(function (e) {  // reset $scope.idleTime
        $scope.idleTime = 0;
    });
    $(document).keypress(function (e) {  // reset $scope.idleTime
        $scope.idleTime = 0;
    });

    $scope.timerIncrement = function () {
        $scope.idleTime = $scope.idleTime + 1;
        console.log("idleTime is " + $scope.idleTime);

        if ($scope.idleTime > 4) { // 25 seconds
            $http({
                method: "DELETE",
                url: "/users/logout",
                headers: {
                    Auth: $scope.auth,  // add Auth to HTTP header
                }
            }).then(function(successRes){
                $scope.auth = ''
                $scope.user.email = $cookies.get('email');
                $scope.user.password = '';
                alert('You will logout due to no activities!');

                $scope.stopTimer();
                $state.go('login');

            }, function(failedRes){
               // alert('The server is busy! Please try again later!');
            });
        }
    }


    if(typeof $cookies.get('email') !== 'undefined'){
        console.log('getcookies');
        console.log($cookies.get('email'));
        $scope.user.email = $cookies.get('email');
    }

    console.log('cookies: ==>');
    console.log($cookies.get('email'));
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

    $scope.login = function(user, rememberMe){
        console.log('login user');
        console.log(user);

        $http.post('/users/login', user).then(function(successRes){
            $scope.auth = successRes.headers().auth;  // obtain Auth info in the HTTP header

            if(rememberMe){                    // click 'remember me' to remember email info
                console.log('--- remember me ? ----');
              //  $cookies.put('auth', $scope.auth);
                $cookies.put('email', user.email);
                console.log($cookies.get('email'));
            }

            console.log(rememberMe);
            console.log('cookies: ==>');
            console.log($cookies.get('email'));

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

                // start interval timer to detect inactivity
                $scope.idleIntervalTimer = $interval($scope.timerIncrement, 5000);  // inteval set to 5s

            }, function(failRes){
                if(parseInt(failRes.status) === 401 ){
                    alert('Email or Password is invalid!');
                } else if(parseInt(failRes.status) === 500 ){
                    alert('The server is busy! Please try again later!');
                }
            });

        }, function(failRes){
            console.log(failRes);
            if(parseInt(failRes.status) === 401 ){
                alert('Email or Password is invalid!');
            } else if(parseInt(failRes.status) === 500 ){
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
                $scope.user.email = $cookies.get('email');
                $scope.user.password = '';
                $state.go('login');

                // stop timer
                $scope.stopTimer();

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