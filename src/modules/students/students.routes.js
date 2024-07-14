const {Router} = require("express")
const studentsController = require("./students.controller")
const Authorization = require("../../common/guard/authorization.guard")
const router = Router()


router.post("/sabteNam", studentsController.preventWhenLoggedIn, studentsController.Register)
router.post("/login", studentsController.preventWhenLoggedIn, studentsController.Loggin)
router.post("/logout",Authorization, studentsController.logout)

module.exports = {
    StudentsRoutes: router
}