const { MongoClient } = require("mongodb");
const config = require('./config');
const logger = require("./logger");
const client = new MongoClient(config.mongodb.url, config.mongodb.options);
var app_env = config.env, currDb
const initializeConn =  (callback) => {
    client.connect(function (err, db) {
      if (db) {
        if (app_env === "development") {
          currDb = db.db("db_name");
          logger.info("Development Server")
          logger.info("Successfully connected to MongoDB.");
        }else{
            logger.info("Not connected to server")
        }
      }
      else{
        return callback(err);
      }
      return callback(err);
    });
  }
const getCurrDb = () =>{
  return currDb
}
const getOtherDb = async (db_name)=>{
  return new Promise((callback)=>{
    client.connect(function (err, db) {
      if (db) {
        var other_db = db.db(db_name);
        callback(other_db);
      }
      callback(false);
    });
});
  
}

module.exports = {
    initializeConn,
    getCurrDb,
    getOtherDb,
};
