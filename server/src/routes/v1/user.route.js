const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userController = require('../../controllers/user.controller');

const router = express.Router();
    
router.route('/').get(userController.getAdmins)

//#region Administrators
router.route('/admins/:archived').get(userController.getAdmins); // Return All
router.route('/admin/get/:userId').get(userController.getAdmin); // Return By ObjectId
router.route('/admin/store').post(userController.createAdmin); // Add Admin
router.route('/admin/update/:userId').post(userController.updateAdmin) // Update Admin
router.route('/admin/archive/:userId').delete(userController.archiveAdmin) // Archive Admin
router.route('/admin/restore/:userId').post(userController.restoreAdmin)
router.route('/admin/delete/:userId').delete(userController.deleteAdmin) // Delete Admin
router.route('/batch_archive').delete(userController.batchArchive)
router.route('/batch_restore').post(userController.batchRestore)
router.route('/batch_delete').delete(userController.batchDelete)
//#endregion

//#region Doctors
router.route('/doctors/:archived').get(userController.getDoctors); // Return All
router.route('/doctors/store').post(userController.createDoctor); // Add Admin
router.route('/doctors/update/:userId').post(userController.updateAdmin) // Update Admin
//#endregion

//#region Patients
router.route('/patients/:archived').get(userController.getPatients); // Return All
router.route('/patients/store').post(userController.createPatient); // Add Admin
router.route('/patients/update/:userId').post(userController.updatePatient) // Update Admin
//#endregion

module.exports = router;