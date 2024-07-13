const {Router} = require("express")
const studentsController = require("./students.controller")
const router = Router()


router.post("/sabteNam", studentsController.Register)
router.post("/login", studentsController.Loggin)

module.exports = {
    StudentsRoutes: router
}