const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const bcrypt = require("bcrypt");
const StudentsModel = require("./students.model");
const jwt = require("jsonwebtoken");
const PresentationModel = require("../OtherModels/presentation");
const moment = require("jalali-moment");

class StudentService {
  #model;
  #presentationmodel;

  constructor() {
    autoBind(this);
    this.#model = StudentsModel;
    this.#presentationmodel = PresentationModel;
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
      course,
    });

    await user.save();
    return user;
  }

  async Loggin(data) {
    const { pcId, username, password, lastDateIn, course } = data;
    const date = moment().format("jYYYY/jM/jD");
    const time = moment().format("HH:mm");

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

    await this.#presentationmodel.create({
      stuId: student._id,
      course,
      date,
      entrance: time,
    });

    const token = await this.signToken({
      payload: { username, pcId, id: student._id, role: student.role },
    });
    return token;
  }

  async signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "5h" });
  }

  async Logout(user, date, time) {
    try {
      const result = await this.#presentationmodel
        .find({
          date: date,
          stuId: user._id,
        })
        .sort({ _id: -1 })
        .limit(1);

      const update = await this.#presentationmodel.updateOne(
        { _id: result[0]._id },
        { $set: { exit: time } }
      );

      if (update.matchedCount === 1) {
        return true;
      } else {
        throw new createHttpError(401, "کاربری با این مشخصات یافت نشد.");
      }
    } catch (error) {
      return { error: "An error occurred while logging out." };
    }
  }
}

module.exports = new StudentService();
