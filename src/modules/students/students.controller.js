const autoBind = require("auto-bind");
const pcNames = require("../../common/utils/pcNames.json");
const studentsService = require("./students.service");
const moment = require("moment-jalaali");

class StudentController {
  #service;

  constructor() {
    autoBind(this);
    this.#service = studentsService;
  }

  async Register(req, res, next) {
    try {
      const { username, password, pcId, course } = req.body;
      await this.#service.Register(username, password, pcId, course);
      return res.json({
        statusCode: 200,
        message: "registerSuccessfully",
      });
    } catch (error) {
      next(error);
    }
  }

  isValidPcId(pcId) {
    const pcNumbers = pcNames[0].pcNun;
    return pcNumbers.some((pc) => pc.id === parseInt(pcId, 10));
  }

  async Loggin(req, res, next) {
    const date = moment().format("jYYYY/jM/jD HH:mm");
    try {
      const { pcId, username, password, course } = req.body;

      if (course !== "network" && course !== "software") {
        return res.status(401).json({
          error: "لطفا فیلد هارا دست کاری نکنید!!.",
        });
      }
      if (!pcId || !username || !password || !course) {
        return res.status(401).json({
          error: "لطفا تمامی فیلد ها را پر کنید.",
        });
      }

      if (!this.isValidPcId(pcId)) {
        return res.status(400).json({
          error: "شماره سیستم اشتباه وارد شده.",
        });
      }

      const data = { ...req.body, lastDateIn: date };

      const result = await this.#service.Loggin(data);

      return res
        .cookie("accessToken", result, {
          // httpOnly: true,
          // secure: process.env.NODE_ENV === NodeEnv.Production,
          httpOnly: false,
          secure: false,
        })
        .status(200)
        .json({
          statusCode: 200,
          message: "LogedInSuccessfully",
          result,
        });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    const date = moment().format("jYYYY/jM/jD");
    const time = moment().format("HH:mm");
    const user = req.user;
    try {
      const response = await this.#service.Logout(user, date, time);
      if (response){
        return (
          res
            .clearCookie("accessToken")
            .status(200)
            .json({
              message: "Logged Out Successfully",
            })
        );
      }else{
        return res.status(401).json({
          error: "در خروج مشکلی پیش آمد! لطفا با ادمین در ارتباط باشید..",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async preventWhenLoggedIn(req, res, next) {
    if (req?.cookies.accessToken) {
      return res.status(400).json({
        statusCode: 403,
        message: "شما از قبل وارد شده اید.",
      });
    }
    next();
  }

  async whoami(req, res, next) {
    try {
      const user = req.user;
      if (user) {
        return res.json(user);
      } else {
        return res
          .json({
            statusCode: 401,
            message: "Not Authorized",
            authorized: false,
          })
          .statusCode(401);
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentController();
