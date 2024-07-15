const autoBind = require("auto-bind");
const adminStudentsService = require("./students.service");

class StudentController {
  #service;

  constructor() {
    autoBind(this);
    this.#service = adminStudentsService;
  }

  async isLogged(req, res, next) {
    try {
      const LoggedinUser = await this.#service.isLogged();
      return res.json(LoggedinUser);
    } catch (error) {
      next(error);
    }
  }

  async isLoggedById(req, res, next) {
    try {
      const { nationalCode } = req.params;
      const LoggedinUser = await this.#service.isLoggedById(nationalCode);
      return res.json(LoggedinUser);
    } catch (error) {
      next(error);
    }
  }

  async changeStudent(req, res, next) {
    try {
      const { nationalCode } = req.params;
      const data = req.body;
      const student = await this.#service.changeStudent(data, nationalCode);
      return res.json(student);
    } catch (error) {
      next(error);
    }
  }

  async getTodayLogs(req, res, next) {
    try {
      const logs = await this.#service.getTodayLogs();
      return res.json(logs);
    } catch (error) {
      next(error);
    }
  }

  async getMonthlyLogs(req, res, next) {
    try {
      const logs = await this.#service.getMonthlyLogs();
      return res.json(logs);
    } catch (error) {
      next(error);
    }
  }

  async getStudentsLogs(req, res, next) {
    const { nationalCode } = req.params;
    try {
      const logs = await this.#service.getStudentsLogs(nationalCode);
      return res.json(logs);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentController();
