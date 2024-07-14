const createHttpError = require("http-errors")
const jwt = require("jsonwebtoken")
const StudentsModel = require("../../modules/students/students.model")
require("dotenv").config()
const Authorization = async (req,res,next) => {
    try {
        const token = req?.cookies?.accessToken
        if(!token) throw new createHttpError.Unauthorized('please login')
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY)
    if(data?.id){
        const user = await StudentsModel.findById(data.id, {accessToken: 0, __v:0, password: 0 }).lean()
        if(!user) throw new createHttpError.Unauthorized("user not found")
        req.user = user
        return next()
    }
    throw new createHttpError.Unauthorized("InvalidToken")
    } catch (error) {
        next(error)
    }
}
module.exports = Authorization