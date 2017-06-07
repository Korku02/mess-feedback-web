app.controller('MainCtrl', function($scope, $mdToast, $document, $http, $location, Auth) {
  $scope.hostels = ["Nilgiri", "Karakoram", "Aravali", "Jwalamukhi", "Kumaon", "Vindhyachal", "Shivalik",
                  "Zanskar", "Satpura", "Udaigiri", "Girnar", "Kailash", "Himadiri"];
  $scope.isPath= function(viewLocation) {
    return viewLocation === $location.path();
  };
  $scope.signUp=function (user) {
    console.log(user);
    var client_id;
    var client_secret;
    $http({
      url:"http://10.194.24.86:8080/api/register/",
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
    console.log(user);
    Auth.login(user).then(function(response) {
        $scope.userInfo = response;
        console.log(response);
        $mdToast.show(
          $mdToast.simple()
          .textContent('User sucessfully logged in!')
          .position('bottom right')
          .hideDelay(3000)
        );
      });
  };
  $scope.logOut = function () {
    Auth.logout().then(function (result) {
        $scope.userInfo = null;
        $mdToast.show(
          $mdToast.simple()
          .textContent('User logout sucessfully!')
          .position('bottom right')
          .hideDelay(3000)
        );
    }, function (error) {
      if (error.status=401) {
        console.log("Unauthorized");
        $window.localStorage["userInfo"] = null;
        $window.location.reload();
      }
    });
  };
});
