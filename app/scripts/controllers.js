angular.module('starter.controllers', ['config'])
.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    //rest of route code
})
.controller('AppCtrl', function(env, $scope, $http, $state, $ionicHistory, $rootScope) {

  $scope.loggedin = false;
  $scope.loginData = {};
  $scope.welcome = 'register';
  $scope.tags = [];
  $rootScope.myTags = [];

  $scope.$on('logged', function(event, data) { 
    $scope.loggedin = data;
    if(data){
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      if(pathway){
        $state.go('app.t',{ tag: pathway });
      }else{
        $state.go('app.browse')
      }
    }else{

    }
  });

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
      for(var i = 0; i < $scope.tags.length; i++){
        $scope.tags[i].title = $scope.tags[i].title.split(" ").join("_")
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
  $scope.checkLogin = function(){
    $http.get(env.api+'/user/check').then(function(data){
      console.log(data)
      $scope.loggedin = data.data.logged;
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      if(!$scope.loggedin){
        $state.go('app.welcome');
      }else{

      }
    })
  }
  $scope.checkLogin();
})

.controller('welcomeCtrl', function($rootScope,$scope,$stateParams,$http,env,$ionicHistory,$state,$auth) {
 $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
         console.log(response);
    $http.post(env.api+'/user/socialLogin',
      {token:response}).
      then(function(resp){
        $rootScope.$broadcast('logged', resp.data.data.login);
        console.log(resp.data);
      })
        })
      .catch(function(response) {
         // Something went wrong.
        });
    };
    //Error handling
    /*Very broken
    var email = $scope.registerData.email;
    $scope.emailError = false;
    $scope.regValidation = function () {
        console.log(email);
        if(email == null){
        $scope.emailError = true;
        }
    }
    */
   $scope.registerData = {};
   $scope.emailError = false;

  $scope.doLogin = function(){
    $http.post(env.api+'/user/login',
      {email:$scope.loginData.email,password:$scope.loginData.password}).
      then(function(resp){
        $rootScope.$broadcast('logged', resp.data.data.login);
      })
  }
  $scope.doRegister = function(){
    if($scope.registerData.email.indexOf('@') !== -1){
      $http.post(env.api+'/user',{email:$scope.registerData.email,password:$scope.registerData.password}).then(function(resp){
        if(resp.data == 'already used') {
          alert('already used');
          return;
        }else{
          $http.post(env.api+'/user/login',
          {email:$scope.registerData.email,password:$scope.registerData.password}).
          then(function(resp){
            $rootScope.$broadcast('logged', resp.data.data.login);
          })
        }
      })
    }else{
      $scope.emailError = true;
    }
  }
})


.controller('PlaylistCtrl', function($scope, $stateParams) {
})


.controller('sorryCtrl', function($scope, $stateParams) {

})

.controller('createCtrl', function(env, $scope, $stateParams, $rootScope, $http) {
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
  $scope.sorry = false;
  $scope.reset = function(){
    $scope.data = {};
    $scope.data.sliderModel = 5;
    $scope.createVoteData = {};
    $scope.question = {};

    $http.get(env.api+'/tag/'+$stateParams.tag).then(function(data){
      console.log(data.data);
      if(data.data == 'finished set' || data.data == 'no question'){
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
    $scope.sendSlider = function(){
      $scope.voteQuestion($scope.data.sliderModel);
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
