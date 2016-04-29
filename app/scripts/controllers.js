angular.module('starter.controllers', ['config'])
.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    //rest of route code
})
.controller('AppCtrl', function(env, $scope, $http, $state, $ionicHistory) {
  $scope.loggedin = false;
  $scope.loginData = {};
  $scope.registerData = {};
  $scope.welcome = 'login';
  $scope.tags = [];
  $scope.getTags = function(){
    $http.get(env.api+'/tag').then(function(data){
      $scope.tags = [];
      var tags = data.data.data;
      for(t in tags){
        $scope.tags.push(tags[t])
      }
    });
  }
  $scope.getTags();
  $scope.switchWelcome = function(str){
    $scope.welcome = str;
  }
  $scope.doLogout = function(){
    $http.get(env.api+'/user/logout').then(function(){
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.welcome');
    })
  }
  $scope.doLogin = function(){
    $http.post(env.api+'/user/login',{email:$scope.loginData.email,password:$scope.loginData.password}).then(function(resp){
      $scope.loggedin = resp.data.data.login;
      if($scope.loggedin){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.browse');
      }
    })
  }
  $scope.checkLogin = function(){
    $http.get(env.api+'/user/check').then(function(data){
      console.log(data)
      $scope.loggedin = data.data.logged;
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      if(!$scope.loggedin){
        $state.go('app.welcome');
      }
    })
  }
  $scope.doRegister = function(){
    $http.post(env.api+'/user',{email:$scope.registerData.email,password:$scope.registerData.password}).then(function(resp){
      if(resp.data=='already used') {
        return;
      }else{
        $http.post(env.api+'/user/login',{email:$scope.registerData.email,password:$scope.registerData.password}).then(function(resp){
          $scope.loggedin = resp.data.data.login;
          if($scope.loggedin){
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $state.go('app.browse');
            location.reload();
          }
        })
      }
    })
  }
  $scope.checkLogin();
})

.controller('welcomeCtrl', function( $scope) {
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})


.controller('sorryCtrl', function($scope, $stateParams) {

})

.controller('myquestionsCtrl', function( env, $scope, $http) {
  $scope.userData = {};
  $http.get(env.api+'/user/questions').then(function(data){
    $scope.userData = data.data;
  })
})

.controller('questionCtrl', function(env, $scope, $stateParams, $http, $state, $ionicHistory) {
  $scope.reset = function(){
    $scope.sorry = false;
    $scope.question = {};
    $http.get(env.api+'/tag/'+$stateParams.tag).then(function(data){
      if(data.data == 'finished set'){
        $scope.sorry = true;
      }else{
        $scope.question = data.data;
      }
    })
    $scope.voteQuestion = function(i){
      $http.get(env.api+'/question/vote/'+$scope.question._id+'/'+i).then(function(data){
        $scope.reset();
      })
    }
  }
  $scope.reset();
});
