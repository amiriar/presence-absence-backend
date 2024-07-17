const { Schema, model } = require("mongoose");

const StudentsSchema = new Schema(
  {
    pcId: { type: String, required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    username: { type: String, required: true },
    nationalCode: { type: String, required: false },
    course: { type: String, required: false },
    role: { type: String, default: "USER" },
    lastDateIn: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: false },
  },
  { timestamps: true }
);

const StudentsModel = model("student", StudentsSchema);
module.exports = StudentsModel;
