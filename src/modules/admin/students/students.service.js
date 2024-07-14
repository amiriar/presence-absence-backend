const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment-jalaali");
const StudentsModel = require("../../students/students.model");

class AdminStudentService {
  #model;

  constructor() {
    autoBind(this);
    this.#model = StudentsModel;
  }

  async isLogged() {
    const student = await this.#model.find();
    return student;
  }

  async isLoggedById(pcId) {
    const student = await this.#model.find({ pcId: pcId });
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

  async changeStudent() {
    const student = await this.#model.find();
    return student;
  }
  
}

module.exports = new AdminStudentService();