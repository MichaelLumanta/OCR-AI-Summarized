const express = require('express');
const simple_ocr = require('../../../controllers/simple_ocr/simple_ocr.controller');
const router = express.Router();
const helper = require('../../../services/helpers/helper.service')

router.post('/getText', helper.upload.single('file'),
   simple_ocr.getText     
);


module.exports = router;