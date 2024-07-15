const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const moment = require("moment-jalaali");
const StudentsModel = require("../../students/students.model");
const PresentationModel = require("../../OtherModels/presentation");

class AdminStudentService {
  #model;
  #am_presentationModel;
  #pm_presentationModel;

  constructor() {
    autoBind(this);
    this.#model = StudentsModel;
    this.#am_presentationModel = PresentationModel.PresentationModel_am;
    this.#pm_presentationModel = PresentationModel.PresentationModel_pm;
  }

  async isLogged() {
    return this.#model.aggregate([
      {
        $addFields: {
          numericPcId: { $toInt: "$pcId" }
        }
      },
      {
        $sort: { numericPcId: 1 }
      },
      {
        $project: { numericPcId: 0 }
      }
    ]);
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
    if (!user)
      throw new createHttpError.NotFound("کاربری با این کد ملی وجود ندارد..");

    const am_logs = await this.#am_presentationModel.find({ stuId: user._id });
    const pm_logs = await this.#pm_presentationModel.find({ stuId: user._id });
    
    return { logs: { am: am_logs, pm: pm_logs } };
  }

  async changeStudent(data, nationalCode) {
    const student = await this.#model.updateOne(
      { nationalCode },
      {
        $set: data,
      }
    );
    if (updateResult.matchedCount === 0) {
      throw new createHttpError.NotFound("Student not found");
    }
    return student;
  }
}

module.exports = new AdminStudentService();
