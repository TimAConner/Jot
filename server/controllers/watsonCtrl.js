'use strict';
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const watsonCredentials = require('../config/watsonConfig.js');
const watson = new NaturalLanguageUnderstandingV1(watsonCredentials);

module.exports.generateKeywords = noteText => {

  // Sanitize jsonified text so watson does not think newlines are keywords
  noteText = noteText.replace(/(\\r\\n\\t|\\n|\\r\\t)/gm, ' ');

  return new Promise((resolve, reject) => {
    watson.analyze({
      html: noteText,
      features: {
        keywords: {},
      },
    },
      (err, response) => {
        if (err) {
          return reject(err);
        }
        if (typeof response === "undefined" || response === null) {
          return resolve(['Error']);
        }

        const keywordArray = response.keywords.map(({ text }) => text.toLowerCase()).slice(0, 5);
        resolve(keywordArray);
      },
    );
  });
};