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
          numericPcId: { $toInt: "$pcId" },
        },
      },
      {
        $sort: { numericPcId: 1 },
      },
      {
        $project: { numericPcId: 0 },
      },
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
    const today = moment().format('jYYYY/jM/jD');
    const am_logs = await this.#am_presentationModel
      .find({date: today},{nationalCode:0})
      .populate("stuId", "firstName lastName username nationalCode pcId");
    const pm_logs = await this.#pm_presentationModel
      .find({date: today},{nationalCode:0})
      .populate("stuId", "firstName lastName username nationalCode pcId");

    return { logs: { am: am_logs, pm: pm_logs } };
  }

  async getMonthlyLogs() {
    const startOfMonth = moment().startOf('jMonth').format('jYYYY/jM/jD');
    const endOfMonth = moment().endOf('jMonth').format('jYYYY/jM/jD');
  
    const [startYear, startMonth, startDay] = startOfMonth.split('/').map(Number);
    const [endYear, endMonth, endDay] = endOfMonth.split('/').map(Number);
  
    const isDateInRange = (date) => {
      const [year, month, day] = date.split('/').map(Number);
      if (year < startYear || year > endYear) return false;
      if (year === startYear && month < startMonth) return false;
      if (year === endYear && month > endMonth) return false;
      if (year === startYear && month === startMonth && day < startDay) return false;
      if (year === endYear && month === endMonth && day > endDay) return false;
      return true;
    };
  
    const am_logs = await this.#am_presentationModel.find().populate('stuId', 'firstName lastName username nationalCode');
    const pm_logs = await this.#pm_presentationModel.find().populate('stuId', 'firstName lastName username nationalCode');
  
    const filtered_am_logs = am_logs.filter(log => isDateInRange(log.date));
    const filtered_pm_logs = pm_logs.filter(log => isDateInRange(log.date));
  
    return { logs: { am: filtered_am_logs, pm: filtered_pm_logs } };
  }
  

  async getStudentsLogs(nationalCode) {
    const user = await this.#model.findOne({ nationalCode }, { _id: 1 });
    if (!user)
      throw new createHttpError.NotFound("کاربری با این کد ملی وجود ندارد..");

    const am_logs = await this.#am_presentationModel
      .find({ stuId: user._id })
      .populate("stuId", "firstName lastName nationalCode");
    const pm_logs = await this.#pm_presentationModel
      .find({ stuId: user._id })
      .populate("stuId", "firstName lastName nationalCode");

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
