angular.module('mobileos', ['angular-oauth2'])
    .constant('appConfig',{
        //baseUrl:'http://leiviton.com.br/direta_dev/public',
        //baseUrl:'https://direta.net.br/app/public',
        baseUrl:'http://localhost:8000',
        pusherKey: '9da90fc97b93c4ce952a',
        redirectAfterLogin:{
            client:'client.order',
            deliveryman:'deliveryman.home'
        }
    })
    .config(function (OAuthProvider,OAuthTokenProvider,appConfig,$provide,$urlRouterProvider,$stateProvider) {
        OAuthProvider.configure({
            baseUrl: appConfig.baseUrl,
            clientId: 'appid01',
            clientSecret: 'secret',
            grantPath: '/oauth/access_token'
        });

        OAuthTokenProvider.configure({
            name: 'token',
            options: {
                secure: false
            }
        });

        $stateProvider
            .state('login',{
                url:'/login',
                templateUrl:'templates/login.html',
                controller:'LoginCtrl'
            });
        $urlRouterProvider.otherwise("/login");

        $provide.decorator('OAuthToken',['$localStorage','$delegate',function ($localStorage,$delegate) {
            Object.defineProperties($delegate,{
                setToken:{
                    value:function (data) {
                        return $localStorage.setObject('token',data);
                    },
                    enumarable:true,
                    configurable:true,
                    writable:true
                },
                getToken:{
                    value:function () {
                        return $localStorage.getObject('token');
                    },
                    enumarable:true,
                    configurable:true,
                    writable:true

                },
                removeToken:{
                    value:function () {
                        return $localStorage.setObject('token',null);
                    },
                    enumarable:true,
                    configurable:true,
                    writable:true
                }
            });
            return $delegate;
        }]);
    })
    .controller('HomeCtrl',  function ($scope,$http) {
        $scope.orders = [];
        var getOrders = function () {
            var url = 'http://localhost:8000';
            $http.get('http://localhost:8000/admin/orders/all',function(data){
                  $scope.orders = data;

                  console.log(data);
            });
        };

        getOrders();
    })
    .controller('LoginCtrl',['$scope','OAuth','OAuthToken','$localStorage',
        function ($scope,OAuth,OAuthToken,$localStorage) {
            var key = 'user';
            $scope.User = {
                username: '',
                password: ''
            };

            $scope.login = function () {
                console.log($scope.User)
                {
                    console.log('online');
                    var promise = OAuth.getAccessToken($scope.User);
                    promise
                        .then(function (data) {
                            $localStorage.setObject('login', $scope.User);
                            console.log(data);
                        })
                        .then(function (data) {


                        }, function (responseError) {
                            console.debug(responseError);
                        });
                }
            }
        }])
    .factory('$localStorage',['$window',function ($window) {
        return {
            set: function (key,value) {
                $window.localStorage[key] = value;
                return $window.localStorage[key];
            },
            get: function (key,defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key,value) {
                $window.localStorage[key] = JSON.stringify(value);
                return this.get(key);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || null);
            }
        }
    }]);


