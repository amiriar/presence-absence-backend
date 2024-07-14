const autoBind = require("auto-bind");
const pcNames = require("../../common/utils/pcNames.json");
const moment = require("moment-jalaali");
const studentsService = require("./students.service");

class StudentController {
  #service;

  constructor() {
    autoBind(this);
    this.#service = studentsService;
  }

  async Register(req, res, next) {
    try {
      const { username, password, pcId } = req.body;
      await this.#service.Register(username, password, pcId);
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
      const { pcId, username, password } = req.body;

      if (!pcId || !username || !password) {
        return res.status(401).json({
          error: "لطفا تمامی فیلد ها را پر کنید.",
        });
      }

      if (password < 8 || password > 32) {
        res.status(401).json({
          error: "رمز عبور خود را به درستی وارد کنید.",
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
}

module.exports = new StudentController();
