const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const bcrypt = require("bcrypt");
const StudentsModel = require("./students.model");
const jwt = require("jsonwebtoken");

class StudentService {
  #model;

  constructor() {
    autoBind(this);
    this.#model = StudentsModel;
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
}

module.exports = new StudentService();
