import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";

const CustomWYSWG = (props) => {
  const {
    data,
    header,
    invalid,
    _callback,
    _read_only,
    _text_only,
    formVariables,
    editorReset,
    setEditorReset,
    hasclipboard,
    setClipBoard,
  }=props;
  const [quill_value, setQuillValue] = useState('');
  const [data_from_parent, setData] = useState(null)
  const quillRef = React.useRef(false)
  useEffect(()=>{
    setData(null)
    if(_callback){
      _callback(quill_value) 
    }  
  },[quill_value])

  useEffect(()=>{  

    if(quill_value == ""){
      if(formVariables){      

        var to_display = data        
        if(!(header =="")){
          to_display = header+data
        }         
      }
      else{
        setData(data)     
      }            
    }     
  },[data || data ==""])

  useEffect(()=>{    
    if(editorReset){
      setData("")  
      setQuillValue("")
      setEditorReset(false)
    }
  },[editorReset])


  var modules = {
    toolbar: false
    // toolbar: [
    //   [{ header: [1, 2, false] }],
    //   ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    //   [{ list: 'ordered' }, { list: 'bullet' }],
    //   [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
    // ],
  }

  if(_read_only){
    modules = {
      toolbar:false
    }
  }

  function checkClipBoard(){
    if(hasclipboard){
      var selection = quillRef.current.getEditor().getSelection(true);
      quillRef.current.getEditor().insertText(selection.index, hasclipboard);
      setClipBoard(false)
    }
  }
  function quillChange(e){
    if(e.includes("\t")){
      var to_replace = e.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
      setQuillValue(to_replace)
      var selection = quillRef.current.getEditor().getSelection(true);
      setTimeout(() => quillRef.current.getEditor().setSelection(selection.index+4, 0), 0)
       
      return
    }
    setQuillValue(e)
  
    
  }
  return (
    
    <div className={invalid?"border-invalid":""}>
      <ReactQuill 
        className={_text_only?"quil_text_only":""} 
        ref={quillRef} 
        modules={modules} 
        theme="snow" 
        value={data_from_parent?data_from_parent:quill_value} 
        onChange={(e)=>{quillChange(e)}} 
        readOnly={_read_only}
        onFocus={checkClipBoard}
      />
    </div>
   
  )
}

export default CustomWYSWG