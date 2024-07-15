const createHttpError = require("http-errors");
const JWT = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET_KEY } = require("../constant/constans");
const StudentsModel = require("../../modules/students/students.model");
function getToken(headers, res) {
  const cookies = headers?.cookie?.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=").map((c) => c.trim());
    acc[key] = value;
    return acc;
  }, {});

  const token = cookies?.accessToken;
  if (!token) {
    throw createHttpError.Unauthorized(
      "حساب کاربری شناسایی نشد وارد حساب کاربری خود شوید"
    );
  }
  return token;
}

function VerifyAccessToken(req, res, next) {
  try {
    const token = getToken(req.headers, res);
    JWT.verify(token, ACCESS_TOKEN_SECRET_KEY, async (err, payload) => {
      try {
        if (err)
          throw createHttpError.Unauthorized("وارد حساب کاربری خود شوید");

        const { pcId, username } = payload || {};

        const query = {};
        if (pcId) query.pcId = pcId;
        else if (username) query.username = username;

        const user = await StudentsModel.findOne(query, {
          password: 0,
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
        });

        if (!user) throw createHttpError.Unauthorized("حساب کاربری یافت نشد");

        req.user = user;
        return next();
      } catch (error) {
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  VerifyAccessToken,
  getToken,
};
