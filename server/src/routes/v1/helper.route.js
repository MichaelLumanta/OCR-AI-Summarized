const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const controller = require('../../controllers/helpers/helper.controller');

const router = express.Router();

router.route('/archive/:userId/:collection').delete(controller.archiveOne)
router.route('/restore/:userId/:collection').post(controller.restoreOne)
router.route('/delete/:userId/:collection').delete(controller.deleteOne)
router.route('/batch_archive/:collection').delete(controller.batchArchive)
router.route('/batch_restore/:collection').post(controller.batchRestore)
router.route('/batch_delete/:collection').delete(controller.batchDelete)

module.exports = router;