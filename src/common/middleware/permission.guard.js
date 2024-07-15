const createHttpError = require("http-errors");
const RoleModel = require("../../modules/OtherModels/role")
const PermissionsModel = require("../../modules/OtherModels/permission")
const PERMISSIONS = require("../../common/constant/constans")

function checkPermission(requiredPermissions = []) {
    return async function (req, res, next) {
      try {
        const allPermissions = requiredPermissions.flat(2)
        const user = req.user;
        if(user){
          const role = await RoleModel.RoleModel.findOne({title: user.role})
          const permissions = await PermissionsModel.PermissionsModel.find({_id: {$in : role.permissions}})
          const userPermissions = permissions.map(item => item.name)
          const hasPermission = allPermissions.every(permission => {
            return userPermissions.includes(permission)
          })
          if(userPermissions.includes(PERMISSIONS.ALL)) return next()
          if (allPermissions.length == 0 || hasPermission) return next();
          throw createHttpError.Forbidden("شما به این قسمت دسترسی ندارید");
        }else{
          throw createHttpError.Unauthorized("ابتدا وارد حساب کاربری خود شوید!");
        }
      } catch (error) {
        next(error);
      }
    };
  }
  module.exports = {
    checkPermission
  }