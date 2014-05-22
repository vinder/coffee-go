var vumigo = require('vumigo_v02');
var fixtures = require('./fixtures');
var AppTester = vumigo.AppTester;
var assert = require('assert');


describe("app", function() {
    describe("GoApp", function() {
        var app;
        var tester;

        beforeEach(function() {
            app = new go.app.GoApp();

            tester = new AppTester(app);

            tester
                .setup.config.app({
                    name: 'test_app'
                })
                .setup(function(api) {
                    fixtures().forEach(api.http.fixtures.add);
                });
        });

        describe("when the user starts a session", function() {
            it("should show them the menu", function() {
                return tester
                    .start()
                    .check.interaction({
                        state: 'states:start',
                        reply: [
                            'Welcome to VME COFFEE MACHINE! (or rooibos tea):',
                            '1. Brew a cup',
                            '2. Is it ready?',
                            '3. Preferences',
                            '4. Exit'
                        ].join('\n')
                    })
                    .run();
            });
        });

        describe("when the user is at the main menu", function() {
            it("should brew a cup on 1", function() {
                return tester
                    .setup.user.state('states:start')
                    .input('1')
                    .check.interaction({
                        state: 'states:brew',
                        reply: [
                            'Brewing!',
                        ].join('\n')
                    })
                    .run();
            });

            it("should check status on 2", function() {
                return tester
                    .setup.user.state('states:start')
                    .input('2')
                    .check.interaction({
                        state: 'states:status',
                        reply: [
                            'Status pending.'
                        ].join('\n')
                    })
                    .run();
            });

            it("should set preferences on 3", function() {
                return tester
                    .setup.user.state('states:start')
                    .input('3')
                    .check.interaction({
                        state: 'states:prefs',
                        reply: [
                            'What is your beverage of choice?',
                            '1. Coffee',
                            '2. Tea'
                        ].join('\n')
                    })
                    .run();
            });

            it("should should save their response", function() {
                return tester
                    .setup.user.state('states:prefs')
                    .input('1')
                    .check(function(api) {
                        var contact = api.contacts.store[0];
                        assert.equal(contact.extra.brew, 'coffee');
                    })
                    .run();
            });

            it("should should post their response", function() {
                return tester
                    .setup.user.state('states:prefs')
                    .setup.user.addr('1234567')
                    .input('1')
                    .check(function(api) {
                        var req = api.http.requests[0];
                        assert.equal(req.url, 'http://powerful-sierra-2165.herokuapp.com/api/v1/person/1234567/brew/coffee');
                    })
                    .run();
            });

            it("should exit on 4", function() {
                return tester
                    .setup.user.state('states:start')
                    .input('4')
                    .check.interaction({
                        state: 'states:end',
                        reply: [
                            'Bye!'
                        ].join('\n')
                    })
                    .run();
            });
        });
    });

});
