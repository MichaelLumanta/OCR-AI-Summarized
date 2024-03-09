const fs = require('fs')
const pdf = require('pdf-parse');
const multer = require("multer");
var tesseract = require('node-tesseract');
var pdf2pic = require("pdf2pic");
//#region upload folder

const storage = multer.diskStorage({
  destination: async (req, file, callBack)=>{
      var DIR = getDIR(req.originalUrl)

      var file_path= `${__dirname.split(`routes`)[0]}/../../uploads`+DIR
      var additional_folder = "";

      //SAVE WHEN TRYING TO UPDATE

      if(!fs.existsSync(file_path)){
          fs.mkdirSync(file_path, { recursive: true });
      }

    var uploadDir = file_path;    
    
      callBack(null, uploadDir)
  },
  filename: (req, file, callBack)=>{          
      callBack(null, `${file.originalname}`)
  }
})

var upload = multer ({storage:storage})

async function GetTextFromPDF(url,filename){
  return new Promise(async (return_data)=>{
 
      var DIR = getDIR(url)
      var file_path= `${__dirname.split(`routes`)[0]}/../../uploads`+DIR+"/"+filename      
      var file_exist = await checkFile(file_path)
      const pdffile = fs.readFileSync(file_path)
  
      pdf(pdffile).then(function(data) {
          
          if(data.text){
              fs.unlinkSync(file_path)
              return_data({success:true,message:data.text});           
          }
          else{
              fs.unlinkSync(file_path)
              return_data({success:false,message:""});                      
          }
              
      });
  });   
}

function tesseractText(url,filename){
  var DIR = getDIR(url)
  var file_path= `${__dirname.split(`routes`)[0]}/../../uploads`+DIR+"/"+filename
  // Recognize text of any language in any format
  return new Promise(async (return_data)=>{
 
      tesseract.process(file_path,function(err, text) {
          if(err) {
              fs.unlinkSync(file_path)
              return_data({success:false,message:""});
          } else {
              fs.unlinkSync(file_path)
              return_data({success:true,message:text})           
          }
      });
  });
}

function pdfToImage(url,filename){
  var DIR = getDIR(url)
  var file_path= `${__dirname.split(`routes`)[0]}/../../uploads`+DIR+"/"
  var input= `${__dirname.split(`routes`)[0]}/../../uploads`+DIR+"/"+filename
  const options = {
      density: 100,
      saveFilename: filename,
      savePath: file_path,
      format: "png"
    };
    const storeAsImage = pdf2pic.fromPath(input, options);
    const pageToConvertAsImage = [];   


  return new Promise(async (return_data)=>{
     setTimeout(() => {
          //Do Nothing wait for file to upload
     }, 500);
      try {
          //Check if file exist now
          var file_exist = await checkFile(input)
          console.log("pdf to image", file_exist)
          const pdffile = fs.readFileSync(input)
         
          pdf(pdffile).then(function(data) {
              var text_extracted= "";
              index =1;
              GetText()
  
              function GetText(){
                  if(index <= data.numpages){
                      storeAsImage(index).then(async (resolve) => {
                          var image_text= await tesseractText(url,resolve.name)
                          text_extracted+= "\n" + image_text?.message           
                          index++;
                          GetText()              
                      })
                  
                  }
                  else{          
                      fs.unlinkSync(input)          
                      return_data({success:true,message:text_extracted})          
                  }
              }
  
        
            
          });
          
      } catch (error) {
          return_data("")
      }


  });
}

async function checkFile(file_path){

  return new Promise((resolve)=>{
      var file_exist = false;
      var interval_fn = setInterval(() => {
          file_exist =  fs.existsSync(file_path)
          if(file_exist){
              clearInterval(interval_fn);
              resolve(file_exist)
          }
      }, 1000);
     
    
  })
  if (fs.existsSync(file_path)) {
      setTimeout(() => {
          return true;        
         }, 1000);
       
  }
  else{
     setTimeout(() => {
      checkFile(file_path)
     }, 1000);
  }

}

function getDIR(url){    
    var DIR="/"
    // Reference
    if(url.includes("skill_sync")){
        DIR+="skill_sync";
    }
    else if(url.includes("simple_ocr")){
        DIR+="simple_ocr";
    }
   
    //
    return DIR;
}

module.exports ={ 
  GetTextFromPDF,
  tesseractText,
  pdfToImage  ,
  upload
}