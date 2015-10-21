require.config({
  baseUrl: 'js/',
  paths: {
    text: 'libs/text',
    jquery: 'libs/jquery-1.11.3',
    'jquery.ui': 'libs/jquery-ui/jquery-ui',
    hogan: 'libs/hogan-3.0.2.amd',
    underscore: 'libs/underscore',
    backbone: 'libs/backbone',
    bootstrap: 'bootstrap',
    'jquery.mixitup': 'libs/jquery.mixitup'
  },
  waitSeconds: 150,
  shim: {
      bootstrap : { 'deps' :['jquery'] },
	  localStorage: {
	    deps: ['backbone'],
	    exports: 'Backbone'
	  },
      'jquery.ui': {
        deps: ['jquery'],
        exports: 'jQuery.fn.scrollParent'
      },
      'jquery.mixitup': {
        deps: ['jquery'],
        exports: 'jQuery.fn.mixItUp'
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
