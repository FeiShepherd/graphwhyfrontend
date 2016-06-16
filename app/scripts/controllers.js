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

.controller('welcomeCtrl', function($rootScope,$scope,$stateParams,$http,env,$ionicHistory,$state) {
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
  $scope.reset = function(){
    $scope.data = {};
    $scope.data.sliderModel = 5;
    $scope.createVoteData = {};
    $scope.sorry = false;
    $scope.question = {};

    $http.get(env.api+'/tag/'+$stateParams.tag).then(function(data){
      console.log(data);
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
})

.controller('graphsCtrl', function(env, $scope, $http){
  $scope.database = [];
  $scope.correlations = [];
  $scope.newCorrelations = [];
  $scope.show = 'polls';
  
  $scope.switchShow = function(t){
    $scope.show = t;
  }
  $scope.roundOff = function(n){
    return parseInt(n)
  }
  $http.get(env.api+'/question').then(function(data){
    var _database = data.data.data;
    for(var c in _database){
      $scope.database.push(_database[c])
    }
    for(var i = 0; i < $scope.database.length; i++){
      var sum = 0;
      for(var a = 0; a < $scope.database[i].answers.length; a++){
        sum += $scope.database[i].answers[a].votes;
      }
      $scope.database[i].sum = sum;
    }
  })
  $http.get(env.api+'/question/correlation').then(function(data){
    var _correlations = data.data;
    for(var c in _correlations){
      var push = false;
      if(_correlations[c][Object.keys(_correlations[c])[0]][Object.keys(_correlations[c][Object.keys(_correlations[c])[0]])[0]].prompt != ""){
        push = true;
      }
      if(push){
        $scope.correlations.push(_correlations[c])
      }
    }
      for(var _a in $scope.correlations){
        var _array = [];
        for(var _b in $scope.correlations[_a]){
          for(var _c in $scope.correlations[_a][_b]){
            _array.push($scope.correlations[_a][_b][_c]);
          }
        }
        $scope.newCorrelations.push(_array)
      }
  })
  $scope.switchVal = function(index,answer,option){
    if(option=='answer1'){
      $scope.newCorrelations[index].percentSelect = $scope.newCorrelations[index].answer1Select
      $scope.newCorrelations[index].answer2Select = $scope.newCorrelations[index].answer1Select
    }else if(option=='answer2'){
      $scope.newCorrelations[index].answer1Select = $scope.newCorrelations[index].answer2Select
      $scope.newCorrelations[index].percentSelect = $scope.newCorrelations[index].answer2Select
    }else{
      $scope.newCorrelations[index].answer1Select = $scope.newCorrelations[index].percentSelect
      $scope.newCorrelations[index].answer2Select = $scope.newCorrelations[index].percentSelect
    }
   // angular.element(document.querySelector('#answer1-0'));
  }
});

