app.controller('MainCtrl', function($scope, $mdToast, $document, $http, $location, Auth, $rootScope) {
  $rootScope.hostels = ["Nilgiri", "Karakoram", "Aravali", "Jwalamukhi", "Kumaon", "Vindhyachal", "Shivalik",
                  "Zanskar", "Satpura", "Udaigiri", "Girnar", "Kailash", "Himadiri"];

  $rootScope.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  $rootScope.mealType = ["breakfast", "lunch", "dinner"];
  $scope.isPath= function(viewLocation) {
    return viewLocation === $location.path();
  };

  $scope.signUp=function (user) {
    $http({
      url:URL_PREFIX+"api/register/",
      method:"POST",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8'
      },
      data:{
        'user_name':user.username,
        'user_id':user.userid.toUpperCase(),
        'user_hostel':user.hostel,
        'email':user.email,
        'password':user.password
      }
    }).then(function sucessCallback(response) {
      if (response.status===200){
        $location.path("/login");
        $mdToast.show(
          $mdToast.simple()
          .textContent('User created sucessfully!')
          .position('bottom right')
          .hideDelay(3000)
        );
      }
    }, function errorCallback(error) {
      if (error.status===302){
        $mdToast.show(
          $mdToast.simple()
          .textContent('Something went wrong, Please try again!')
          .position('bottom right')
          .hideDelay(3000)
        );
      }
    });
  };
  $scope.logInUser=function (user) {
    if (user===undefined) {
      $mdToast.show(
        $mdToast.simple()
        .textContent('Please check your input field')
        .position('bottom right')
        .hideDelay(3000)
      );
    }
    Auth.login(user).then(function(response) {
      $scope.userDetails = response;
      $location.path("/dashboard");
      $mdToast.show(
        $mdToast.simple()
        .textContent('User sucessfully logged in!')
        .position('bottom right')
        .hideDelay(3000)
      );
    });
  };


  $scope.checkIfEnterKeyWasPressed = function($event, user){

    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
        // Do that thing you finally wanted to do
        console.log(keyCode);
        $scope.logInUser(user);
    }

  };

// $scope.qrstring = 'text';
$scope.makeqr = false;

  $scope.getQr=function (email) {
    $http({
      url:URL_PREFIX+"generateqr/",
      method:"POST",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8'
      },
      data:{
        'email':email
      }
    }).then(function sucessCallback(response) {
        console.log(response.data);

        $scope.qrstring =email+" "+response.data.qrhash;
        console.log($scope.qrstring);
        $scope.makeqr = true;
    }, function errorCallback(error) {
        console.log(error);
    });
  };


  


});
