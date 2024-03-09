
const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const helper = require('../../services/helpers/helper.service');

 const getText = catchAsync(async (req, res) => {

    var image_text="";
    var uploaded_files = req.body.newFileName 

    var current_file_name = uploaded_files
    console.log(current_file_name)
    var file_extension = current_file_name.split(".").pop();

    if(["png","jpg","jpeg"].includes(file_extension)){
        image_text= await helper.tesseractText(req.originalUrl,current_file_name)
    }
    if(["pdf"].includes(file_extension)){
        image_text= await helper.GetTextFromPDF(req.originalUrl,current_file_name)
    }

    res.status(httpStatus.OK).send({ message:"Ok", payload:[
        {plain_text:image_text.message}
    ] });
});


        
module.exports = {
    getText,
    
};
