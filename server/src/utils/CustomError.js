function errorHandler(res,status,message){
    res.status(status).send(message);
    return
}

module.exports.errorHandler = errorHandler