var AlexaSkill  = require('./lib/AlexaSkill');
var PhraseGenerator      = require('./lib/PhraseGenerator');
var Config      = require('./config/config');

PhraseGenerator.GeneratePhrase(function(phrase){
    var dots = require("./node_modules/dot").process({path: "./views"});

    var speech = {
        speech: dots.GetRandomPhraseSpeech({phrase:phrase}),
        type: AlexaSkill.speechOutputType.SSML
    };
    var card = dots.GetRandomPhraseCard({phrase:phrase});

    console.log(speech);
    console.log(card);
});

