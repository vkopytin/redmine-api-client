require.config({
  paths: {
    text: '/js/libs/text',
    jquery: '/js/libs/jquery-1.11.2',
    hogan: '/js/libs/hogan-3.0.2.amd',
    underscore: '/js/libs/underscore',
    backbone: '/js/libs/backbone',
    localStorage: '/js/libs/backbone.localStorage'
  },
  shim: {
	  localStorage: {
	    deps: ['backbone'],
	    exports: 'Backbone'
	  }
  }
});
if (isPhoneGap) {
    require(['cordova.js', 'app'], function(cordova, App){
        App.initialize(cordova);
    });
} else {
    require(['app'], function(App){
        App.initialize(false);
    });
}
