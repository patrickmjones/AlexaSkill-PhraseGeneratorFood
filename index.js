/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill  = require('./lib/AlexaSkill');
var PhraseGenerator      = require('./lib/PhraseGenerator');
var Config      = require('./config/config');

/**
 * PhraseGeneratorFood is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var PhraseGeneratorFood = function () {
    AlexaSkill.call(this, Config.AppID);

    this.messages = require('./lang/en').lang;
};

// Extend AlexaSkill
PhraseGeneratorFood.prototype = Object.create(AlexaSkill.prototype);
PhraseGeneratorFood.prototype.constructor = PhraseGeneratorFood;

PhraseGeneratorFood.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("PhraseGeneratorFood onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

PhraseGeneratorFood.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("PhraseGeneratorFood onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);

    var speechOutput = this.messages.WELCOME;
    var repromptText = this.messages.PROMPT;

    response.ask(speechOutput, repromptText);
};

PhraseGeneratorFood.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("PhraseGeneratorFood onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

PhraseGeneratorFood.prototype.intentHandlers = {
    // register custom intent handlers
    "PhraseGeneratorFoodIntent": function (intent, session, response) {
        HandlePhraseRequest(intent, session, response);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.tell(this.messages.HELP);
    }
};

function HandlePhraseRequest(intent, session, response){
    GetPhrase(function(phrase){
        var dots = require("./node_modules/dot").process({path: "./views"});

        var speech = {
            speech: dots.GetRandomPhraseSpeech({phrase:phrase}),
            type: AlexaSkill.speechOutputType.SSML
        };
        var card = dots.GetRandomPhraseCard({phrase:phrase});

        response.tellWithCard(speech, "Gourmet Food Phrase Generator", card);
    });
}

function GetPhrase(callback) {
    PhraseGenerator.GeneratePhrase(callback);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the PhraseGeneratorFood skill.
    var phraseGenerator = new PhraseGeneratorFood();
    phraseGenerator.execute(event, context);
};


