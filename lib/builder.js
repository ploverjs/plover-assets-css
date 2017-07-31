
'use strict';


module.exports = function(app) {
  const handler = require('./css-handler');
  app.ploverAssetsHandler.add('css', '.css', handler);
};
