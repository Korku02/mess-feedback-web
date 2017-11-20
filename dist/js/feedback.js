app.controller('DashCtrl', function($scope, $mdToast, $document, $http, $location, Auth, $window, $mdDialog, $rootScope) {
  var CONTENT_TYPE='application/json; charset=UTF-8';
  // cheking if user is authenticated. If authenticated than parse accessToken
  if (Auth.getuserDetails().accessToken!==undefined){
    var AUTHORIZATION='Bearer '+Auth.getuserDetails().accessToken;
  }
  $scope.userDetails = JSON.parse($window.localStorage.userDetails);
  $scope.getMealData=function () {
    $http({
      url:URL_PREFIX+"api/meal/",
      method:"GET",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization':AUTHORIZATION
      }
    }).then(function sucessCallback(response) {
      $scope.meals=response.data;
      console.log($scope.meals);
      var i = 0;
      var j = 0;
      var len = $scope.meals.length;
      var mealDates = [];
      var mealRatings = [];
      for(i; i<=(len-1); i++){
        mealDates[i] = $scope.meals[i].created;

      }
      for(j; j<=(len-1); j++){
        mealRatings[j] = $scope.meals[j].rating;

      }

      console.log(mealDates);
      console.log(mealRatings);
      console.log("korku");
    }, function errorCallback(error) {
      console.log(error);
    });
  };


  $rootScope.getRebateData=function () {
    $http({
      url:URL_PREFIX+"api/rebate/",
      method:"GET",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization':AUTHORIZATION
      }
    }).then(function sucessCallback(response) {
      $rootScope.rebates=response.data;
      console.log($scope.rebates);

    }, function errorCallback(error) {
      console.log(error);
    });
  };

  $scope.getGraphData=function () {
    $http({
      url:URL_PREFIX+"api/getdata/",
      method:"GET",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization':AUTHORIZATION
      }
    }).then(function sucessCallback(response) {
      $scope.graphData=response.data;
      console.log($scope.graphData.Daily.Kailash.breakfast.count);
      // $scope.DailybreakfastAverage = $scope.graphData.Daily.Kailash.breakfast.average.rating__avg
      // [$scope.graphData.Daily.Kailash.breakfast.average.rating__avg,$scope.graphData.Daily.Kailash.lunch.average.rating__avg,$scope.graphData.Daily.Kailash.dinner.average.rating__avg],
      // [$scope.graphData.Weekly.Kailash.breakfast.average.rating__avg,$scope.graphData.Weekly.Kailash.lunch.average.rating__avg,$scope.graphData.Weekly.Kailash.dinner.average.rating__avg],
      // [$scope.graphData.Monthly.Kailash.breakfast.average.rating__avg,$scope.graphData.Monthly.Kailash.lunch.average.rating__avg,$scope.graphData.Monthly.Kailash.dinner.average.rating__avg]

    }, function errorCallback(error) {
      console.log(error);
    });
  };

  $scope.getFilterData = function(filter){
    $http({
      url:URL_PREFIX+"api/getdata/",
      method:"POST",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization':AUTHORIZATION
      },
      data:{
          'meal_type':filter.meal_type,
          'hostel':filter.hostel,
          'start_date':filter.start_date.toISOString().substr(0,10),
          'end_date':filter.end_date.toISOString().substr(0,10)
      }
    }).then(function sucessCallback(response) {
      $scope.filterData=response.data;
      var i = 0;
      var j = 0;
      var k = 0;
      var len = $scope.filterData.length;
      var mealDates = [];
      var mealRatings = [];
      for(i; i<=(len-1); i++){
        mealDates[i] = $scope.filterData[i].created;
        $scope.datax =   mealDates;

      }
      for(j; j<=(len-1); j++){
        mealRatings[j] = $scope.filterData[j].rating;
        $scope.datay = mealRatings;

      }

      // for(k; k<=($scope.datax.length-1); k++ ){
      //
      //
      //   averageRatings = [];
      //   averageDates = [];
      //
      //   if(mealDates[k] != mealDates[k+1]){
      //     averageDates.push(mealDates[k])
      //     averageRatings.push(mealRatings[k])
      //   }
      //   else {
      //     averageRatings.push(mealRatings[k]+mealRatings[k+1]/(k+2))
      //   }
      // }
      // console.log(averageDates);
      // console.log(averageRatings);


      console.log(response);
        }, function errorCallback(error) {
      console.log(error);
    });
  }
  // don't worry  if you modify this function and remove if condition
  // you are still not able to get the user list.
  if ($scope.userDetails.role.admin || $scope.userDetails.role.supervisior) {
    $http({
      url:URL_PREFIX+"api/users/",
      method:"GET",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization':AUTHORIZATION
      }
    }).then(function sucessCallback(response) {
      $scope.users=response.data;
      console.log($scope.users);
    }, function errorCallback(error) {
      console.log(error);
    });
  }
  $scope.propertyName = 'created';
  $scope.reverse = true;
  $scope.sortBy = function(propertyName) {
    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  };
  $scope.userPropertyName = 'created';
  $scope.userReverse = true;
  $scope.sortByUser = function(userPropertyName) {
    $scope.userReverse = ($scope.userPropertyName === userPropertyName) ? !$scope.userReverse : false;
    $scope.userPropertyName = userPropertyName;
  };
  $scope.logOut = function () {
    Auth.logout().then(function (result) {
        // $location.path("/");
        localStorage.clear();
        $window.location.reload();
        $mdToast.show(
          $mdToast.simple()
          .textContent('User logout sucessfully!')
          .position('bottom right')
          .hideDelay(3000)
        );
    }, function (error) {
      if (error.status=401) {
        console.log("Unauthorized");
        $window.localStorage.userDetails= null;
        $window.location.reload();
      }
    });
  };
  $scope.getMealData();
  $rootScope.getRebateData();
  $scope.getGraphData();
  $scope.modifyUser = function(ev, user) {
    $mdDialog.show({
      controller: function ($mdDialog, $scope) {
                 var vm = this;
                 vm.currentUser = {};
                 vm.currentUser = user;  //your task object from the ng-repeat
                 $scope.hide = function () {
                   $mdDialog.hide();
                 };
                 $scope.cancel = function () {
                   $mdDialog.cancel();
                 };
                 $scope.updateUser = function (user) {
                   $http({
                     url:URL_PREFIX+"api/users/",
                     method:"PUT",
                     headers:{
                       'Content-Type': 'application/json; charset=UTF-8',
                       'Authorization':AUTHORIZATION
                     },
                     data:user
                   }).then(function sucessCallback(response) {
                    //  console.log(response);
                      $scope.hide();
                      $scope.cancel();
                      $mdToast.show(
                        $mdToast.simple()
                        .textContent('Updated sucessfully!')
                        .position('bottom right')
                        .hideDelay(3000)
                      );
                   }, function errorCallback(error) {
                    //  console.log(error);
                   });
                 };
             },
      controllerAs: 'modal',
      templateUrl: 'templates/user.edit.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
    }, function() {
    });
  };

  $scope.approveRebate = function(ev, rebate) {
    $rootScope.rebatePk = rebate.pk;
    $rootScope.rebateData = rebate;

    console.log(rebate);
    $mdDialog.show({
      controller: function ($mdDialog, $scope, $rootScope) {
                $scope.rebate = $rootScope.rebateData;
                 $scope.hide = function () {
                   $mdDialog.hide();
                 };
                 $scope.cancel = function () {
                   $mdDialog.cancel();
                 };
                 $scope.approve = function (is_approved) {

                   console.log(is_approved);
                   $http({
                     url:URL_PREFIX+"api/rebate/"+$rootScope.rebatePk+"/",
                     method:"PUT",
                     headers:{
                       'Content-Type': 'application/json; charset=UTF-8',
                       'Authorization':AUTHORIZATION
                     },
                     data:{
                       'is_approved':is_approved
                     }
                   }).then(function sucessCallback(response) {
                    //  console.log(response);
                      $scope.hide();
                      $scope.cancel();
                      $mdToast.show(
                        $mdToast.simple()
                        .textContent('Updated sucessfully!')
                        .position('bottom right')
                        .hideDelay(3000)
                      );
                        $rootScope.getRebateData();
                   }, function errorCallback(error) {
                    //  console.log(error);
                   });
                 };
             },
      controllerAs: 'modal',
      templateUrl: 'templates/rebate.edit.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
    }, function() {
    });
  };
  $scope.submitRebate=function(user){
    console.log(user.start_date.toISOString().substr(0,10));
    $http({
      url:URL_PREFIX+"api/rebate/",
      method:"POST",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization':AUTHORIZATION
      },
      data:{
        'email':user.email,
        'hostel':user.hostel,
        'start_date':user.start_date.toISOString().substr(0,10),
        'end_date':user.end_date,
        'days':user.days,
        'reason':user.reason,
        'user_name':user.user_name
      }
    }).then(function sucessCallback(response) {
      if (response.status===200){
        $location.path("/dashboard");
        $mdToast.show(
          $mdToast.simple()
          .textContent('Submitted Successfully')
          .position('bottom right')
          .hideDelay(3000)
        );
      }
    }, function errorCallback(error) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('Something went wrong, Please try again!')
          .position('bottom right')
          .hideDelay(3000)
        );

    });
  };

  //for chart js --- starts here
  // $scope.labels = ["dates"];
  // $scope.series = ['Rating'];
  // $scope.data = [
  //   [1,2.5,0.5],
  //   [1.5,3.5,0.5],
  //   [2,2.5,1.5],
  // ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };

  //for chartjs --- ends here

});

app.controller('MainCtrl', function($scope, $mdToast, $document, $http, $location, Auth, $rootScope) {
  $rootScope.hostels = ["Nilgiri", "Karakoram", "Aravali", "Jwalamukhi", "Kumaon", "Vindhyachal", "Shivalik",
                  "Zanskar", "Satpura", "Udaigiri", "Girnar", "Kailash", "Himadiri"];

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


});

app.controller('VerificationCtrl', function($scope, $mdToast, $document, $http, $location, Auth, $rootScope) {

VERIFY_URL_PREFIX = 'http://127.0.0.1:8080/verifyemail?email_token=';
$scope.getMsg = function(){
  if($location.search().email_token){
    var email_token = $location.search().email_token;
    $http.get(VERIFY_URL_PREFIX+email_token)
      .then(function(response) {
          $scope.verificationMsg = response.data.response;
          // console.log(response);
      },
      function errorCallback(error) {
            $scope.verificationMsg = error.data.error;
            // console.log("bro");
          });

  }
  else{
    $scope.verificationMsg = "Error 404";
  }
}

});
