const { Router } = require("express");
const AdminStudentController = require("./students.controller");
const {
  checkPermission,
} = require("../../../common/middleware/permission.guard");
const { PERMISSIONS } = require("../../../common/constant/constans");
const router = Router();

router.get(
  "/export",
  checkPermission([PERMISSIONS.ADMIN]),
  AdminStudentController.exportStudents
);
router.get(
  "/logs/day",
  checkPermission([PERMISSIONS.ADMIN]),
  AdminStudentController.getTodayLogs
);
router.get(
  "/logs/month",
  checkPermission([PERMISSIONS.ADMIN]),
  AdminStudentController.getMonthlyLogs
);
router.get(
  "/all",
  checkPermission([PERMISSIONS.ADMIN]),
  AdminStudentController.isLogged
);
router.get(
  "/isLogged/:pcId",
  checkPermission([PERMISSIONS.ADMIN]),
  AdminStudentController.isLoggedById
);
router.post(
  "/change",
  checkPermission([PERMISSIONS.ADMIN]),
  AdminStudentController.Loggin
);

module.exports = {
  AdminStudentsRoutes: router,
};
