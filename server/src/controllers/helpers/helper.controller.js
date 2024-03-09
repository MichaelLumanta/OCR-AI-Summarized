const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const catchAsync = require("../../utils/catchAsync");
const { helperService } = require("../../services");
const { errorHandler } = require("../../utils/CustomError");

const archiveOne = catchAsync(async (req, res) => {
  const result = await helperService.archiveById(req.params.userId,req.params.collection);
  if(result.status=="error"){
      errorHandler(
          res,
          result.http_code,
          {
              status:result.status,
              message:result.message
          }
      )   
      return;
  }
  res.status(httpStatus.OK).send(result);
});

const restoreOne = catchAsync(async (req, res) => {
  const result = await helperService.restoreById(req.params.userId,req.params.collection);
  if(result.status=="error"){
      errorHandler(
          res,
          result.http_code,
          {
              status:result.status,
              message:result.message
          }
      )   
      return;
  }
  res.status(httpStatus.OK).send(result);
});


const batchArchive = catchAsync(async (req, res) => {
  const result = await helperService.archiveByBatch(req.body,req.params.collection);
  if(result.status=="error"){
      errorHandler(
          res,
          result.http_code,
          {
              status:result.status,
              message:result.message
          }
      )   
      return;
  }
  res.status(httpStatus.OK).send(result);
});

const batchRestore = catchAsync(async (req, res) => {
  const branch = await helperService.restoreByBatch(req.body,req.params.collection);
  if(branch.status=="error"){
      errorHandler(
          res,
          branch.http_code,
          {
              status:branch.status,
              message:branch.message
          }
      )   
      return;
  }
  res.status(httpStatus.OK).send(branch);
});

const batchDelete = catchAsync(async (req, res) => {
  const branch = await helperService.deleteByBatch(req.body,req.params.collection);
  if(branch.status=="error"){
      errorHandler(
          res,
          branch.http_code,
          {
              status:branch.status,
              message:branch.message
          }
      )   
      return;
  }
  res.status(httpStatus.OK).send(branch);
});

const deleteOne = catchAsync(async (req, res) => {
  const result = await helperService.deleteById(req.params.userId,req.body,req.params.collection);
  if(result.status=="error"){
      errorHandler(
          res,
          result.http_code,
          {
              status:result.status,
              message:result.message
          }
      )   
      return;
  }
  res.status(httpStatus.OK).send(result);
});

const getBranchAndClientHeader= (async (req,res)=>{  
    
    if(req.headers.client_branch){
        
        var branch_and_client = JSON.parse(req.headers.client_branch)
        return branch_and_client
    }  
    return {"branch_id":"","client_code":""}
 
})

module.exports = {
  archiveOne,
  restoreOne,
  deleteOne,
  batchArchive,
  batchRestore,
  batchDelete,
  getBranchAndClientHeader,
};
