const { Router } = require("express");
const studentsController = require("./students.controller");
const Authorization = require("../../common/guard/authorization.guard");
const router = Router();

router.post(
  "/register",
  studentsController.preventWhenLoggedIn,
  studentsController.Register
);
router.post(
  "/login",
  studentsController.preventWhenLoggedIn,
  studentsController.Loggin
);
router.get("/logout", Authorization, studentsController.logout);
router.get("/whoami", Authorization, studentsController.whoami);

module.exports = {
  StudentsRoutes: router,
};  