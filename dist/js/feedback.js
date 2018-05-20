app.controller('DashCtrl', function($scope, $mdToast, $document, $http, $location, Auth, $window, $mdDialog, $rootScope) {
  var CONTENT_TYPE='application/json; charset=UTF-8';
  // cheking if user is authenticated. If authenticated than parse accessToken
  if (Auth.getuserDetails().accessToken!==undefined){
    var AUTHORIZATION='Bearer '+Auth.getuserDetails().accessToken;
  }
  $scope.userDetails = JSON.parse($window.localStorage.userDetails);

  $scope.test = function () {
    console.log("testing");
  }
  var dateobj = new Date();
  $scope.dateToday = dateobj.toISOString().substr(0,10);
  console.log(dateobj.toISOString().substr(0,10));
  var dateToday
  $scope.getMealData=function (date) {
    if(date){
      date.setDate(date.getDate() + 1);
      dateToday = date.toISOString().substr(0,10);
      $scope.dateToday = dateToday;
    }
    else{
      dateToday = dateobj.toISOString().substr(0,10);
    }

    $http({
      url:URL_PREFIX+"api/testdata/",
      method:"POST",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization':AUTHORIZATION
      },
      data:{
        'datecreated':dateToday
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
    console.log(propertyName);
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



  $scope.selected = [];
  $scope.limitOptions = [5, 10, 15];

  $scope.options = {
    rowSelection: true,
    multiSelect: true,
    autoSelect: true,
    decapitate: false,
    largeEditDialog: false,
    boundaryLinks: false,
    limitSelect: true,
    pageSelect: true
  };

  $scope.query = {
    order: 'name',
    limit: 5,
    page: 1
  };

  $scope.desserts = {
    "count": 9,
    "data": [
      {
        "name": "Frozen yogurt",
        "type": "Ice cream",
        "calories": { "value": 159.0 },
        "fat": { "value": 6.0 },
        "carbs": { "value": 24.0 },
        "protein": { "value": 4.0 },
        "sodium": { "value": 87.0 },
        "calcium": { "value": 14.0 },
        "iron": { "value": 1.0 }
      }, {
        "name": "Ice cream sandwich",
        "type": "Ice cream",
        "calories": { "value": 237.0 },
        "fat": { "value": 9.0 },
        "carbs": { "value": 37.0 },
        "protein": { "value": 4.3 },
        "sodium": { "value": 129.0 },
        "calcium": { "value": 8.0 },
        "iron": { "value": 1.0 }
      }, {
        "name": "Eclair",
        "type": "Pastry",
        "calories": { "value":  262.0 },
        "fat": { "value": 16.0 },
        "carbs": { "value": 24.0 },
        "protein": { "value":  6.0 },
        "sodium": { "value": 337.0 },
        "calcium": { "value":  6.0 },
        "iron": { "value": 7.0 }
      }, {
        "name": "Cupcake",
        "type": "Pastry",
        "calories": { "value":  305.0 },
        "fat": { "value": 3.7 },
        "carbs": { "value": 67.0 },
        "protein": { "value": 4.3 },
        "sodium": { "value": 413.0 },
        "calcium": { "value": 3.0 },
        "iron": { "value": 8.0 }
      }, {
        "name": "Jelly bean",
        "type": "Candy",
        "calories": { "value":  375.0 },
        "fat": { "value": 0.0 },
        "carbs": { "value": 94.0 },
        "protein": { "value": 0.0 },
        "sodium": { "value": 50.0 },
        "calcium": { "value": 0.0 },
        "iron": { "value": 0.0 }
      }, {
        "name": "Lollipop",
        "type": "Candy",
        "calories": { "value": 392.0 },
        "fat": { "value": 0.2 },
        "carbs": { "value": 98.0 },
        "protein": { "value": 0.0 },
        "sodium": { "value": 38.0 },
        "calcium": { "value": 0.0 },
        "iron": { "value": 2.0 }
      }, {
        "name": "Honeycomb",
        "type": "Other",
        "calories": { "value": 408.0 },
        "fat": { "value": 3.2 },
        "carbs": { "value": 87.0 },
        "protein": { "value": 6.5 },
        "sodium": { "value": 562.0 },
        "calcium": { "value": 0.0 },
        "iron": { "value": 45.0 }
      }, {
        "name": "Donut",
        "type": "Pastry",
        "calories": { "value": 452.0 },
        "fat": { "value": 25.0 },
        "carbs": { "value": 51.0 },
        "protein": { "value": 4.9 },
        "sodium": { "value": 326.0 },
        "calcium": { "value": 2.0 },
        "iron": { "value": 22.0 }
      }, {
        "name": "KitKat",
        "type": "Candy",
        "calories": { "value": 518.0 },
        "fat": { "value": 26.0 },
        "carbs": { "value": 65.0 },
        "protein": { "value": 7.0 },
        "sodium": { "value": 54.0 },
        "calcium": { "value": 12.0 },
        "iron": { "value": 6.0 }
      }
    ]
  };


  $scope.toggleLimitOptions = function () {
    $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
  };


  $scope.onPaginate = function(page, limit) {
    console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
    console.log('Page: ' + page + ' Limit: ' + limit);

    $scope.promise = $timeout(function () {

    }, 2000);
  };


  $scope.addMenu=function(user){

    console.log(user);
    $http({
      url:URL_PREFIX+"api/getmenu/",
      method:"POST",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization':AUTHORIZATION
      },
      data:{
        'day':user.day,
        'hostel':user.hostel,
        'meal_type':user.meal_type,
        'item':user.item,
      }
    }).then(function sucessCallback(response) {

        $mdToast.show(
          $mdToast.simple()
          .textContent(response.data.response)
          .position('bottom right')
          .hideDelay(3000)
        );

    }, function errorCallback(error) {
      console.log(error);
        $mdToast.show(
          $mdToast.simple()
          .textContent(error.data.error)
          .position('bottom right')
          .hideDelay(3000)
        );

    });
  };


  $scope.getMenu=function(user){

    console.log(user);
    $http({
      url:URL_PREFIX+"api/getmenu/",
      method:"GET",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization':AUTHORIZATION
      }
    }).then(function sucessCallback(response) {

      $scope.menuData = response.data;

      console.log(response);
    }, function errorCallback(error) {
        console.log(error);
    });
  };
  $scope.getPaperMeal=function(user){

    console.log(user);
    $http({
      url:URL_PREFIX+"api/papermeal/",
      method:"GET",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization':AUTHORIZATION
      }
    }).then(function sucessCallback(response) {

      $scope.payperData = response.data;

      console.log(response);
    }, function errorCallback(error) {
        console.log(error);
    });
  };
  $scope.getPaperAttendance=function(user){

    console.log(user);
    $http({
      url:URL_PREFIX+"api/paperattendance/",
      method:"POST",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization':AUTHORIZATION
      }
    }).then(function sucessCallback(response) {

      $scope.payperData = response.data;

      console.log(response);
    }, function errorCallback(error) {
        console.log(error);
    });
  };


  $scope.getMenu();
  $scope.getPaperMeal();
  // $scope.getPaperAttendance();


  // $scope.dayList = ?

  $scope.myDate = new Date();

  $scope.minDate = new Date(
    $scope.myDate.getFullYear(),
    $scope.myDate.getMonth() ,
    $scope.myDate.getDate() + 2
  );

  $scope.maxDate = new Date(
    $scope.myDate.getFullYear(),
    $scope.myDate.getMonth() ,
    $scope.myDate.getDate() + 2
  );

  $scope.payperMeal=function (user) {

    date = new Date(user.date);
    date.setDate(date.getDate() + 1);
    date = date.toISOString().substr(0,10);

    // console.log(date.toISOString().substr(0,10));
    $http({
      url:URL_PREFIX+"api/papermeal/",
      method:"POST",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization':AUTHORIZATION
      },
      data:{
        'date':date,
        'meal_type':user.meal_type,
      }
    }).then(function sucessCallback(response) {
        console.log(response);
    }, function errorCallback(error) {
        console.log(error);
    });
  };

});

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

app.controller('IphoneCtrl', function($scope, $mdToast, $document, $http, $location, Auth, $rootScope) {

  var client = new ClientJS();

  var curr_os = client.getOS();

  console.log(curr_os);

  $scope.ratings = ["1.0","1.5","2.0","2.5","3.0","3.5","4.0","4.5","5.0","5.5"];

  $scope.submitRating = function(data) {
    console.log("bro");
  }


});

app.controller('updatemenuCtrl', function($scope, $mdToast, $document, $http, $location, Auth, $rootScope) {

console.log('heelo');

});

app.controller('VerificationCtrl', function($scope, $mdToast, $document, $http, $location, Auth, $rootScope) {

VERIFY_URL_PREFIX = 'http://127.0.0.1:8080/verifyemail?email_token=';
$scope.getMsg = function(){
  if($location.search().email_token){
    var email_token = $location.search().email_token;
    $http.get(VERIFY_URL_PREFIX+email_token)
      .then(function(response) {
          $scope.verificationMsg = response.data.response;
          console.log(response);
      },
      function errorCallback(error) {
            $scope.verificationMsg = error.data.error;
            console.log("bro");
          });

  }
  else{
    $scope.verificationMsg = "Error 404";
  }
}







});
