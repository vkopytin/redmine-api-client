define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        MainRouter = require('mainrouter'),
        Service = require('service'),
        c,
        app;

//$.support.cors = true;
$.ajaxSetup({
  beforeSend: function(xhr, options){
    //options.xhrFields = {withCredentials: true};
    //options.crossDomain = {crossDomain: true};
    //var url = options.url;
    //options.url = url.split('//').join('//che:guevara2012!@');
    //options.username = localStorage.getItem('username');
    //options.password = localStorage.getItem('password');
    xhr.setRequestHeader("Authorization", "Basic " + btoa(localStorage.getItem('username') + ":" + localStorage.getItem('password')));
  }
});

    return app = {
        initialize: function (cc) {
            c = cc;
            this.bindEvents();
            c || this.receivedEvent('deviceready');
        },
        getService: function () {
            return Service;
        },
        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicitly call 'app.receivedEvent(...);'
        onDeviceReady: function() {
            app.receivedEvent('deviceready');
        },
        // Update DOM on a Received Event
        receivedEvent: function(id) {
            if (c) {
                var parentElement = document.getElementById(id);
                var listeningElement = parentElement.querySelector('.listening');
                var receivedElement = parentElement.querySelector('.received');
           
                listeningElement.setAttribute('style', 'display:none;');
                receivedElement.setAttribute('style', 'display:block;');
       
                console.log('Received Event: ' + id);
            }
            this.router = new MainRouter({
                app: this
            });
       
            BB.history.start();
        }
    };
});
