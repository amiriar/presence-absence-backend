const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const bcrypt = require("bcrypt");
const StudentsModel = require("./students.model");
const jwt = require("jsonwebtoken");
const PresentationModel = require("../OtherModels/presentation");
const moment = require("jalali-moment");

class StudentService {
  #model;
  #am_presentationmodel;
  #pm_presentationmodel;

  constructor() {
    autoBind(this);
    this.#model = StudentsModel;
    this.#am_presentationmodel = PresentationModel.PresentationModel_am;
    this.#pm_presentationmodel = PresentationModel.PresentationModel_pm;
  }

  async Register(username, password, pcId) {
    const user = await this.#model.findOne({ username });
    if (user) {
      throw new createHttpError.Forbidden("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.#model.create({
      pcId,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    return newUser;
  }

  async Loggin(data) {
    const { pcId, username, password, course } = data;
    const date = moment().format("jYYYY/jM/jD");
    const hour = moment().format("HH");
    const minute = moment().format("mm");

    const student = await this.#model.findOne(
      { pcId, username },
      { createdAt: 0, updatedAt: 0, __v: 0 }
    );

    if (!student) {
      throw new createHttpError(401, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      throw new createHttpError(401, "Incorrect password");
    }

    student.lastDateIn = date;
    await student.save();

    const presentationModel =
      hour >= 12 ? this.#pm_presentationmodel : this.#am_presentationmodel;
    await presentationModel.create({
      stuId: student._id,
      course,
      date,
      entrance: `${hour}:${minute}`,
    });

    const token = await this.signToken({
      username,
      pcId,
      id: student._id,
      role: student.role,
    });

    return token;
  }

  async signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "5h" });
  }

  async Logout(user, date, time) {
    const hour = moment().format("HH");

    try {
      const presentationModel =
        hour >= 12 ? this.#pm_presentationmodel : this.#am_presentationmodel;
      const latestPresentation = await presentationModel
        .find({ date, stuId: user._id })
        .sort({ _id: -1 })
        .limit(1);

      if (latestPresentation.length === 0) {
        throw new createHttpError(401, "Presentation not found");
      }

      const update = await presentationModel.updateOne(
        { _id: latestPresentation[0]._id },
        { $set: { exit: time } }
      );

      if (update.matchedCount === 1) {
        return true;
      } else {
        throw new createHttpError(401, "Update failed");
      }
    } catch (error) {
      throw new createHttpError(500, "An error occurred while logging out");
    }
  }
}

module.exports = new StudentService();
