define(function (require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        BB = require('backbone'),
        MainRouter = require('mainrouter'),
        Service = require('service'),
        c,
        app;

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
