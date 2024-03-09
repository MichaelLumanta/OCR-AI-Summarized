import FileDrop from 'components/Dropzone/Dropzone';
import React, { useState } from 'react'
import { Row,Col,Card,Button, CardBody, CardHeader, FormGroup, Input } from 'reactstrap'
import moment from "moment/moment";
import CustomWYSWG from 'components/WYSWG/CustomWYSWG';

const SkillSync = () => {

    const [plain_data, setPlainData] = useState([]);
    const [summarized_data, setsummarized_data] = useState([]);
    const [name, setName] = useState([]);
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState([]);
    const [file_name, setFilename] = useState(null);

    function fileChange(file){
        setFile(file)
    }

    const renameFile = (originalFile, newName) => {
        return new File([originalFile], newName, {
          type: originalFile.type,
          lastModified: originalFile.lastModified,
          folder:""
        });
      };

   async function uploadResume(){
    setPlainData([])
    setsummarized_data([])
        let newFileName = null;
        let _file;
        var formdata = new FormData();
        if (file != null && name !="" ) {
       
            
            let sanitizedName = sanitizeFileName(name);    
            let uniqidn = `${sanitizedName}${moment().format('MMDDYYYYHHmmss').split('/').join('')}`;    
            newFileName = uniqidn + "." + file[0].name.split(".").pop()
            _file = renameFile(file[0], newFileName);
            formdata.append("file", _file);
            formdata.append("newFileName", newFileName);
        } else {
          console.log(`No File Attached`);
        }  

        const _payload = {
           
        };

        formdata.append("jsonData", JSON.stringify(_payload));
    
        var requestOptions = {
          method: 'POST',
          body: formdata
        };
      
        
        await fetch("http://localhost:5000/v1/skill_sync/sync_my_skill", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result?.payload[0]?.plain_text)
            console.log(result?.payload[0]?.gpt_text)
            setPlainData(JSON.stringify(result?.payload[0]?.plain_text))

            let _temp_data = [];
            _temp_data.push()
            setsummarized_data(result?.payload[0]?.gpt_text)
           
        })
        .catch(error => {
            console.log(error)
        });
        
    }

     function sanitizeFileName(str){
        var text = str;
        // Convert the text to lowercase
        // text = text.toLowerCase();
      
        // Replace all non-alphanumeric characters with underscores
        text = text.replace(/[^a-zA-Z0-9_]+/g, '_');
      
        // Remove all leading and trailing underscores
        text = text.replace(/^_+/, '').replace(/_+$/, '');
      
        // Limit the length of the text to 255 characters
        // text = text.slice(0, 255);
    
        return text;
      }


  return (
   
    <>
    <Card className='m-4 '>
        <CardHeader>
            Skill Sync
        </CardHeader>
        <CardBody>
            <Row className='pb-2'>
                <Col>
                <FormGroup>
                    <label>Name</label>
                    <Input 
                        text ="name"
                        value={name}
                        onChange={e=>setName(e.target.value)}
                    />
                </FormGroup>
                    
                </Col>
            </Row>
            <FileDrop
                        _file_type={ "image/*,.pdf"}
                        _pholder="Only pdf and image file type is supported "
                        _maxfiles="1"                       
                        _response="Success"
                        _fileCallback={
                            fileChange
                        }
                        _file_nameCallBack={setFilename}             
                    />
           
           <Row className='mt-2'>
            <Col>
            <Button                     
                onClick={uploadResume}
            >
                Submit
            </Button>
            </Col>
           </Row>
        
        </CardBody>

    </Card>
    <Card className='m-4'>
        <CardHeader>
            Summarized Data
        </CardHeader>
        <CardBody>
            <Row>
                <Col>
                        <label>Plain Text</label>
                        <CustomWYSWG          
                            _read_only={true}                     
                            data = {plain_data}                            
                        />  

                        
                </Col>
                <Col>
                        <label>Summarized Text</label>
                        <CustomWYSWG                  
                            _read_only={true}    
                            data = {summarized_data}                            
                        />       
                </Col>
            </Row>
         
        </CardBody>
    </Card>
    </>


  )
}

export default SkillSync