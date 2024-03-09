<h1>OCR - AI Summarized OCR</h1>

<br/>
Company : **N/A**
Programmer : **Michael Henry Lumanta [MHL]**
<br/>
<h2>Requirements:</h2>

**NodeJS: 16.13.2 (Preffered version)**
 - Link: https://nodejs.org/en/
	 - **NOTE:** After installation, restart your pc.
<br/>
<h2>INSTALLATION (Server)</h2>
 
**Open** Server folder first to the terminal before performing NPM Commands.
 - **Note:** If the system files are opened on Visual Studio Code you can press ctrl+shift+C to  open the command line in that directory or
   you can type “CMD” on the folder address bar.
 - **Important Note:** Image to text uses tesseract upon npm install there is a thing you need to do which is go to node > node-tesseract > lib > on line 99 change unlink to unlinkSync, 
   and on line 65 change -psm to --psm.
  - **Important Important Note:** In order to make tesseract work you need to install the OSCR so that it can detect languages get the installer here https://tesseract-ocr.github.io/tessdoc/Installation.html.  
<br/>
  
|Description|Command|
|--|--|
|To get all related node_module files|**npm install --legacy-peer-deps**|
|Server environment|**create .env file copy the contents of .env.example**|
|To run server| **npm start** |