const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment-jalaali");
const StudentsModel = require("../../students/students.model");
const PresentationModel = require("../../OtherModels/presentation");

class AdminStudentService {
  #model;
  #presentationModel;

  constructor() {
    autoBind(this);
    this.#model = StudentsModel;
    this.#presentationModel = PresentationModel;
  }

  async isLogged() {
    const student = await this.#model.find();
    return student;
  }

  async isLoggedById(nationalCode) {
    const student = await this.#model.findOne(
      { nationalCode },
      { __v: 0, password: 0, createdAt: 0, updatedAt: 0 }
    );
    if (!student) throw new createHttpError[404]();
    return student;
  }

  async getTodayLogs() {
    const today = moment().format("jYYYY/jM/jD");
    const logs = await this.#model.find({
      lastDateIn: { $regex: `^${today}` },
    });
    return logs;
  }

  async getMonthlyLogs() {
    const startOfMonth = moment().startOf("jMonth").format("jYYYY/jM/jD");
    const endOfMonth = moment().endOf("jMonth").format("jYYYY/jM/jD");

    const logs = await this.#model.find({
      lastDateIn: { $gte: startOfMonth, $lte: endOfMonth },
    });
    return logs;
  }

  async getStudentsLogs(nationalCode) {
    const user = await this.#model.findOne({ nationalCode }, { _id: 1 });

    const logs = await this.#presentationModel.find({
      stuId: user._id,
    });
    return logs;
  }

  async changeStudent() {
    const student = await this.#model.find();
    return student;
  }
}

module.exports = new AdminStudentService();
