const express = require('express');
const skill_syncController = require('../../../controllers/SkillSync/skill_sync.controller');
const router = express.Router();
const helper = require('../../../services/helpers/helper.service')
router.post('/sync_my_skill', helper.upload.single('file'),
   skill_syncController.syncMySkill
     
);
router.post('/get_data', 
   skill_syncController.get_data
     
);

module.exports = router;