go.app = function() {
    var vumigo = require('vumigo_v02');
    var App = vumigo.App;
    var Choice = vumigo.states.Choice;
    var ChoiceState = vumigo.states.ChoiceState;
    var MenuState = vumigo.states.MenuState;
    var EndState = vumigo.states.EndState;

    var GoApp = App.extend(function(self) {
        App.call(self, 'states:start');

        self.states.add('states:start', function(name) {
            return new MenuState(name, {
                question: 'Welcome to VME COFFEE MACHINE! (or rooibos tea):',

                choices: [
                    new Choice('states:brew', 'Brew a cup'),
                    new Choice('states:status', 'Is it ready?'),
                    new Choice('states:prefs', 'Preferences'),
                    new Choice('states:end', 'Exit')],
            });
        });

        self.states.add('states:brew', function(name) {
            return new EndState(name, {
                text: 'Brewing!',
                next: 'states:start'
            });
        });

        self.states.add('states:status', function(name) {
            return new EndState(name, {
                text: 'Status pending.',
                next: 'states:start'            });
        });

        self.states.add('states:prefs', function(name) {
            return new ChoiceState(name, {
                question: 'What is your beverage of choice?',
                choices: [
                    new Choice('coffee', 'Coffee'),
                    new Choice('tea', 'Tea'),
                ],
                next: 'states:start'
            });
        });

        self.states.add('states:end', function(name) {
            return new EndState(name, {
                text: 'Bye!',
                next: 'states:start'
            });
        });
    });

    return {
        GoApp: GoApp
    };
}();
