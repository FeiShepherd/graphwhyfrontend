angular.module('starter.controllers', ['config'])
.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    //rest of route code
})
.controller('AppCtrl', function(env, $scope, $http, $state, $ionicHistory, $rootScope) {
  $scope.loggedin = false;
  $scope.loginData = {};
  $scope.registerData = {};
  $scope.welcome = 'login';
  $scope.tags = [];
  $rootScope.myTags = [];

  $scope.addTag = function(t){
    for(var i = 0; i < $scope.myTags.length; i++){
      if(t == $scope.myTags[i]) return;
    }
    $rootScope.myTags.push(t)
  }
  $scope.removeTag = function(t){
    for(var i = 0; i < $scope.myTags.length; i++){
      if(t == $scope.myTags[i]){
        $scope.myTags.splice(i,1);
        return;
      }
    }
  }
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
      $scope.loggedin = false;
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

.controller('createCtrl', function(env, $scope, $stateParams, $rootScope,$http) {
  $scope.questionData = {};
  $scope.options = ['','']
  $scope.answers = []
  var TagsUsedToIdArray = function(){
    var tempArr = [];
    for(var i = 0; i < $rootScope.myTags.length; i++){
      tempArr.push($rootScope.myTags[i]._id)
    }
    return tempArr;
  }
  $scope.addOption = function(){
    $scope.options.push('')
  }
  $scope.createQuestion = function(){
    var _arr = $scope.answers;
    var _prompt = $scope.questionData.prompt;
    var _explain = $scope.questionData.explain;
    var _tag = TagsUsedToIdArray();

    console.log(_arr,_prompt,_explain,_tag)

    $http.post(env.api+"/question", {
      prompt:_prompt,
      explain: _explain,
      answers: _arr,
      tags: _tag
    }).success(function(data){
      console.log(data);
    })

  }
})

.controller('myquestionsCtrl', function( env, $scope, $http) {
  $scope.userData = {};
  $http.get(env.api+'/user/questions').then(function(data){
    $scope.userData = data.data;
  })
})

.controller('questionCtrl', function(env, $scope, $stateParams, $http, $state, $ionicHistory) {
  $scope.reset = function(){
    $scope.createVoteData = {};
    $scope.sorry = false;
    $scope.question = {};
    $http.get(env.api+'/tag/'+$stateParams.tag).then(function(data){
      if(data.data == 'finished set'){
        $scope.sorry = true;
      }else{
	console.log(data.data);
        $scope.question = data.data;
      }
    })
    $scope.voteQuestion = function(i){
      $http.get(env.api+'/question/vote/'+$scope.question._id+'/'+i).then(function(data){
        $scope.reset();
      })
    }
    $scope.createAnswer = function(){
      $http.post(env.api+'/question/addvote/'+$scope.question._id,{option:$scope.createVoteData.customoption
      }).then(function(data){
        console.log($scope.createVoteData.customoption)
        $scope.reset();
      })
    }
  }
  $scope.reset();
});
