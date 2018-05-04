'use strict';
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const watsonCredentials = require('../config/watsonConfig.js');
const watson = new NaturalLanguageUnderstandingV1(watsonCredentials);

module.exports.generateKeywords = noteText => {
  return new Promise((resolve, reject) => {
    watson.analyze({
      html: noteText,
      features: {
        keywords: {},
      },
    },
      (err, { keywords = [] }) => {
        if (err) return reject(err);
        const keywordArray = keywords.map(({ text }) => text).slice(0, 5);
        resolve(keywordArray);
      },
    );
  });
};