require.config({
  baseUrl: 'js/',
  paths: {
    text: 'libs/text',
    jquery: 'libs/jquery-1.11.2',
    hogan: 'libs/hogan-3.0.2.amd',
    underscore: 'libs/underscore',
    backbone: 'libs/backbone'
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
