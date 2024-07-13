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

  async ShowLogs() {
    // Not implemented yet
  }

  async isLoggedById(pcId) {
    const student = await this.#model.find({ pcId: pcId });
    if (!student) throw new createHttpError[404]();
    return student;
  }

  async Register(username, password, pcId) {
    let user = await this.#model.findOne({
      $or: [{ username: username }, { pcId: pcId }],
    });
    if (user) {
      throw new createHttpError.Forbidden("AlreadyExist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await this.#model.create({
      pcId,
      username,
      password: hashedPassword,
    });

    await user.save();
    return user;
  }

  async Loggin(data) {
    const { pcId, username, password, lastDateIn } = data;

    const student = await this.#model.findOne(
      { pcId, username },
      { createdAt: 0, updatedAt: 0, __v: 0 }
    );
    if (!student) {
      throw new createHttpError(401, "کاربری با این مشخصات یافت نشد.");
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      throw new createHttpError(401, "رمز عبور اشتباه است.");
    }

    student.lastDateIn = lastDateIn;
    await student.save();
    return student;
  }

  async signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "5h" });
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
}

module.exports = new AdminStudentService();
