'use strict';
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const watsonCredentials = require('./config/watsonConfig.js');
const watson = new NaturalLanguageUnderstandingV1(watsonCredentials);

module.exports.getKeywords = noteText => {
  return new Promise((resolve, reject) => {
    watson.analyze({
      html: noteText,
      features: {
        keywords: {},
      },
    },
      (err, response) => {
        if (err) return reject(err);
        resolve(JSON.stringify(response));
      },
    );
  });
};