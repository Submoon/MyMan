const Bookshelf = require("../bookshelf");

var AutoAnswer = Bookshelf.Model.extend({
  tableName: "autoanswers",
  hasTimestamps: true

});


module.exports = AutoAnswer;
