const { Router } = require("express");
const {
  AdminStudentsRoutes,
} = require("./modules/admin/students/students.routes");
const { StudentsRoutes } = require("./modules/students/students.routes");
const Authorization = require("./common/guard/authorization.guard");

const mainRouter = Router();

mainRouter.use("/api/auth", StudentsRoutes);
mainRouter.use("/api/admin/students", Authorization, AdminStudentsRoutes);

module.exports = mainRouter;
