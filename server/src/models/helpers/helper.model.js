const dbo = require("../../config/dbConn");
const ObjectId = require("mongodb").ObjectId;
var model_collection = "users";

const findById = (id,collection) => {
  var aggregation = [
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
  ];
  return new Promise(async (return_data) => {
    var db_connect = dbo.getCurrDb();
    db_connect
      .collection(collection)
      .aggregate(aggregation)
      .toArray(function (err, result) {
        if (err) {
          return_data([]);
        }
        return_data(result);
      });
  });
};

const getAll = (aggregation, options) => {
  return new Promise(async (return_data) => {
    var db_connect = dbo.getCurrDb();
    db_connect
      .collection(model_collection)
      .aggregate(aggregation)
      .toArray(function (err, result) {
        if (err) {
          return_data([]);
        }
        return_data(result);
      });
  });
};

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
const isEmailTaken = async (email, excludeUserId) => {
  return new Promise(async (return_data) => {
    var db_connect = dbo.getCurrDb();
    db_connect
      .collection(model_collection)
      .find({ email, _id: { $ne: excludeUserId } })
      .toArray(function (err, result) {
        if (err) {
          return_data(false);
        }
        if (result.length <= 0) {
          return_data(false);
        }
        return_data(true);
      });
  });
};

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
const findOne = async (fields) => {
    return new Promise(async (return_data) => {
      var db_connect = dbo.getCurrDb();
      db_connect
        .collection(model_collection)
        .find({ ...fields })
        .toArray(function (err, result) {
          if (err) {
            return_data(null);
          }
          if(result.length<=0){
            return_data(null);
          }
          return_data(result[0]);
        });
    });
  };

  const update = (id,body) =>{
    let db_connect = dbo.getCurrDb();
    let myobj = {
        $set: body 
    };
    console.log(myobj);
    const filter = { _id: new ObjectId(id) }
    return new Promise((return_data) => {
      db_connect
        .collection(model_collection)
        .updateOne(filter,myobj, function (err, result) {
          if (err) {
            return_data({
              remarks: "failed",
              message: "Something went wrong error",
              error: err,
              payload: null,
            });
          } else {
            return_data({
              remarks: "success",
              message: "Successfully Updated",
              return: result,
              payload: null,
            });
          }
        });
    });
}


/**
 * archive procedure by id
 * @param {ObjectId} procedureId
 * @param {int} 1 for archive 0 to restore
 * @returns {Promise<Procedure>}
 */
const archive_restore = (id, archive,collection)=>{
    let db_connect = dbo.getCurrDb();
    let myobj = {
        $set:{            
            archive: archive,
        }     
    };
    const filter = { _id: new ObjectId(id) }
    return new Promise((return_data) => {
      db_connect
        .collection(collection)
        .updateOne(filter,myobj, function (err, result) {
          if (err) {
            return_data({
              remarks: "failed",
              message: "Something went wrong error",
              error: err,
              payload: null,
            });
          } else {
            return_data({
              remarks: "success",
              message: "Successfully Updated",
              return: result,
              payload: null,
            });
          }
        });
    });
}

const deleteOne = (id,collection) =>{
    let db_connect = dbo.getCurrDb();

    const filter = { _id: new ObjectId(id) }
    return new Promise((return_data) => {
      db_connect
        .collection(collection)
        .deleteOne(filter, function (err, result) {
          if (err) {
            return_data({
              remarks: "failed",
              message: "Something went wrong error",
              error: err,
              payload: null,
            });
          } else {
            return_data({
              remarks: "success",
              message: "Successfully Updated",
              return: result,
              payload: null,
            });
          }
        });
    });
}

const deleteMany = (arrayOfIds,collection) =>{
  let db_connect = dbo.getCurrDb();

  const filter = { _id: { $in: arrayOfIds } };
  return new Promise((return_data) => {
    db_connect
      .collection(collection)
      .deleteMany(filter, function (err, result) {
        if (err) {
          return_data({
            remarks: "failed",
            message: "Something went wrong error",
            error: err,
            payload: null,
          });
        } else {
          return_data({
            remarks: "success",
            message: "Successfully Updated",
            return: result,
            payload: null,
          });
        }
      });
  });
}


/**
 * archive procedure by id
 * @param {ObjectId} procedureId
 * @param {int} 1 for archive 0 to restore
 * @returns {Promise<Procedure>}
 */
const batch_archive_restore = (arrayOfIds, archive,collection)=>{
    let db_connect = dbo.getCurrDb();
    let myobj = {
        $set:{            
            archive: archive,
        }     
    };
    const filter = { _id: { $in: arrayOfIds } };
  
    return new Promise((return_data) => {
      db_connect
        .collection(collection)
        .updateMany(filter,myobj, function (err, result) {
          if (err) {
            return_data({
              remarks: "failed",
              message: "Something went wrong error",
              error: err,
              payload: null,
            });
          } else {
            return_data({
              remarks: "success",
              message: "Successfully Updated",
              return: result,
              payload: null,
            });
          }
        });
    });
}
module.exports = {
  findById,
  getAll,
  isEmailTaken,
  findOne,
  update,
  archive_restore,
  deleteOne,
  deleteMany,
  batch_archive_restore,
};
