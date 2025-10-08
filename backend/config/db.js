const mongoose = require('mongoose');
/**
 * 
 * @param {*} uri mongo connect uri
 * @returns connection
 */
async function connect(uri) {
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

module.exports = { connect };
