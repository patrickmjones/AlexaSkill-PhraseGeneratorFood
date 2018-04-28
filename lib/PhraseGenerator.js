'use strict';

var PhraseFile = require("./PhraseFile");

var self = module.exports = {
    PhraseData: PhraseFile,
    
    // Returns a random integer between 0 and the given count minus 1.
    RandomIndex: function(count) {
        return Math.floor(Math.random() * count);
    },
    
    // Randomizes the word order of the given category.
    RandomizeCategory: function(categoryName) {
        
        // Create the result list
        var results = [];
        
        // While words remain...
        var source = self.PhraseData[categoryName];
        while (source.length > 0) {
            
            // Move a random word to the result list
            var index = self.RandomIndex(source.length);
            var word = source.splice(index, 1)[0];
            results.push(word);
        }
        
        // Copy the results back to the category (to keep extra variables, etc.)
        for (var i = 0; i < results.length; i++) {
            self.PhraseData[categoryName].push(results[i]);
        }
    },

    ProcessPhrase: function(phrase) {
        var pattern = /#([^#]+)#/;
        var displayPattern = '([^#]*)';
        var matches = phrase.match(pattern);

        if(!matches) {
            return phrase;
        } else {
            var category = matches[1];
            category = category.toLowerCase();
            var wordIndex = self.PhraseData[category]._current;
            var word = self.PhraseData[category][wordIndex];
           
            phrase = phrase.replace(pattern, word);

            var categoryCount = self.PhraseData[category].length; 
            self.PhraseData[category]._current = (wordIndex + 1) % categoryCount;
            
            // Re-randomize category at 0
            if (self.PhraseData[category]._current == 0) {
                self.RandomizeCategory(category);
            }

            return self.ProcessPhrase(phrase);
        }
    },

    GeneratePhrase: function(callback) {
        for (var category in self.PhraseData) {
            self.PhraseData[category]._current = 0;
            self.RandomizeCategory(category);
        }
        var phrase = "#phrases#";
        phrase = self.ProcessPhrase(phrase);
        callback(phrase);
    }
};

