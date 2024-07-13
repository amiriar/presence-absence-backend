const { Router } = require("express");
const {
  AdminStudentsRoutes,
} = require("./modules/admin/students/students.routes");
const { StudentsRoutes } = require("./modules/students/students.routes");
const { VerifyAccessToken } = require("./common/middleware/verifyAccessToken")


const mainRouter = Router();

mainRouter.use("/api/auth", StudentsRoutes);
mainRouter.use("/api/admin/students", VerifyAccessToken, AdminStudentsRoutes);

module.exports = mainRouter;
