
// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])
.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})
 
.factory('myService',function(){
    objeto = {
        foto: null,
        latitud: null,
        longitud: null,
        altura: null,
        orientacion: null,
        velocidad: null,
        imei:null,
        phone:null,
        mensaje:null
    };
    return objeto;
})
.controller('DeviceController', function($ionicPlatform, $scope, $cordovaDevice, myService, $timeout) {
    $ionicPlatform.ready(function() {
          
        $timeout(function() {
            var device = $cordovaDevice.getDevice();
            myService.imei = device.uuid;
            $scope.uuid = device.uuid;

        });
    });
})
.controller("ExampleController", function ($scope, $cordovaCamera, myService) {
    $scope.takePhoto = function () {
        var options = {
            //para mas calidad en la imagen con 100 la totalida de pixceles
            quality: 75,
            //rl fotmato del valor de retorno de la imagen en este con base 64
            destinationType: Camera.DestinationType.DATA_URL,
            //elige el formato de retorno, ajusta la fuente de la imagen
            sourceType: Camera.PictureSourceType.CAMERA,
            //allowEdit: true,
            mediaType:Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth:300,
            targetHeight:300,
            //popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true
        };
        $cordovaCamera.getPicture(options).then(function (imageData) {
            myService.foto=imageData;
            $scope.fotos=imageData;
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
            
        }, function (err) {
            // An error occured. Show a message to the user
        });
    }
    $scope.choosePhoto = function () {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            //allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
           // popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true
        };
        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.base="data:image/base64;base64,";
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
            
        }, function (err) {
            // An error occured. Show a message to the user
        });
    }
})

.controller('GeolocationCtrl', function($scope, $cordovaGeolocation,myService) {
    $scope.textoss="";
      
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
          myService.latitud = position.coords.latitude;
          myService.longitud = position.coords.longitude;
          myService.altura = ''+position.coords.altitude;
          myService.velocidad= ''+position.coords.speed;

          console.log("-----------------------------");
          console.log(myService.latitud);
          console.log(myService.longitud);
          console.log("-----------------------------");
          /*
          alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
          */

/*
         if(myService.latitud === null)
         {
           myService.latitud="";
         }  
         if(myService.longitud === null)
         {
           myService.longitud="";
         }         
          if(myService.altura === null)
         {
           myService.altura="";
         }
           if(myService.velocidad === null)
         {
           myService.velocidad="";
         }
*/

      },function(err) {
        //alert("encienda su GPS");
    }
    );

})

.controller('envia',function($scope,$cordovaDeviceOrientation,$http,$cordovaGeolocation,myService){
    
    document.addEventListener("deviceready", function () {
        $cordovaDeviceOrientation.getCurrentHeading().then(function(result) {
            myService.orientacion = ''+result.magneticHeading;
            //alert(myService.orientacion + "orientacion");
            if(myService.orientacion === null)
            {
               myService.orientacion = 0.0;
            }
        }, function(err) {
            myService.orientacion = 0.0;
            // An error occurred
        })
    });
 

    $scope.enviarDatos=function(){
        myService.mensaje = $scope.textoss;
       
        objeto = {
            foto: myService.foto,
//            foto: "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAQAAABpN6lAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2tpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw",
            latitud: myService.latitud,
            longitud: myService.longitud,
            altura: myService.altura,
            orientacion: myService.orientacion,
            velocidad: myService.velocidad,

/*
            latitud: -1232323,
            longitud: -2342344,
            altura: 50,
            orientacion: 30,
            velocidad: 3,
*/
            imei: myService.imei,
            //imei: " nina nawi v2 ",
            number_phone:72200000,
            mensaje: myService.mensaje, 
            //mensaje: "hola como estas benjamin"
        };
        var msgdata =  {
            photo : objeto.foto,
            latitude: objeto.latitud,
            longitude: objeto.longitud,
            altitude : objeto.altura,
            orientation : objeto.orientacion,
            speed : objeto.velocidad,
            imei_device : objeto.imei,
            number_phone : objeto.number_phone,
            message : objeto.mensaje,
        };
        console.log(msgdata)
        $http.post('http://incendios.scesi.org/appmobile/', msgdata)
            .then(function(data, error){
                window.test = data;
                alert("Gracias por su denuncia");
            }, function(err) {
                alert(err);
                ionic.Platform.exitApp();
            });
    }
})
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("button");
    $ionicConfigProvider.navBar.alignTitle("center");
    $stateProvider
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })
    .state('tab.chats', {
        url: '/chats',
        views: {
            'tab-chats': {
                templateUrl: 'templates/tab-chats.html',
            }
        }
    })
    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
            }
        }
    });
    $urlRouterProvider.otherwise('/tab/dash');
})
