require.config({
  baseUrl: 'js/',
  paths: {
    text: 'libs/text',
    jquery: 'libs/jquery-1.11.2',
    hogan: 'libs/hogan-3.0.2.amd',
    underscore: 'libs/underscore',
    backbone: 'libs/backbone',
    bootstrap: 'bootstrap'
  },
  shim: {
      bootstrap : { 'deps' :['jquery'] },
	  localStorage: {
	    deps: ['backbone'],
	    exports: 'Backbone'
	  }
  }
});
if (isPhoneGap) {
    require(['cordova.js', 'app', 'bootstrap'], function(cordova, App){
        App.initialize(cordova);
    });
} else {
    require(['app', 'bootstrap'], function(App){
        App.initialize(false);
    });
}
