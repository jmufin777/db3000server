var crypto = require('crypto');
module.exports = function(pwd, fn) {
  var hash = crypto.createHash('sha256').update(pwd).digest('base64');
  fn(null, hash);
};