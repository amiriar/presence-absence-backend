const { Router } = require("express");
const AdminStudentController = require("./students.controller");
const {
  checkPermission,
} = require("../../../common/middleware/permission.guard");
const { PERMISSIONS } = require("../../../common/constant/constans");
const router = Router();

// router.get( // <-----   excel
//   "/export",
//   checkPermission([PERMISSIONS.ADMIN]),
//   AdminStudentController.exportStudents
// );

// daily student logs
router.get(
  "/logs/day",
  // checkPermission([PERMISSIONS.ADMIN]),
  AdminStudentController.getTodayLogs
);
// daily student logs

// montly student logs
router.get(
  "/logs/month",
  // checkPermission([PERMISSIONS.ADMIN]),
  AdminStudentController.getMonthlyLogs
);
// montly student logs

// all students
router.get(
  "/all",
  checkPermission([PERMISSIONS.ADMIN]),
  AdminStudentController.isLogged
);
// all students

// one student data by id
router.get(
  "/student/:nationalCode",
  checkPermission([PERMISSIONS.ADMIN]),
  AdminStudentController.isLoggedById
);
// one student data by id

// change one student data by id
router.post(
  "/change/:pcId",
  checkPermission([PERMISSIONS.ADMIN]),
  AdminStudentController.changeStudent
);
// change one student data by id

module.exports = {
  AdminStudentsRoutes: router,
};
