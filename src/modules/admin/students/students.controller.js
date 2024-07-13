const autoBind = require("auto-bind");
const moment = require("moment-jalaali");
const adminStudentsService = require("./students.service");

class StudentController {
  #service;

  constructor() {
    autoBind(this);
    this.#service = adminStudentsService;
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

  async ShowLogs(req, res, next) {
    try {
      const logs = await this.#service.ShowLogs();
      return res.json(logs);
    } catch (error) {
      next(error);
    }
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
      const { pcId } = req.params;
      const LoggedinUser = await this.#service.isLoggedById(pcId);
      return res.json(LoggedinUser);
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

  async exportStudents(req, res, next) {
    try {
      const students = await this.#service.getAllStudents(); // Assuming you have this method in your service

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Students");

      // Add column headers
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Username", key: "username", width: 30 },
        { header: "PC ID", key: "pcId", width: 10 },
        { header: "Last Login", key: "lastDateIn", width: 20 },
      ];

      // Add rows
      students.forEach((student) => {
        worksheet.addRow({
          id: student.id,
          username: student.username,
          pcId: student.pcId,
          lastDateIn: student.lastDateIn,
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "students.xlsx"
      );

      await workbook.xlsx.write(res);
      res.end();
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
}

module.exports = new StudentController();
