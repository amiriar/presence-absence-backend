const { Schema, model, Types } = require("mongoose");

const PresentationSchema_am = new Schema({
  stuId: { type: Types.ObjectId, required: true },
  course: { type: String, required: true },
  date: { type: String, required: true },
  entrance: { type: String, required: true },
  exit: { type: String, required: false },
});

const PresentationModel_am = model("am_presentation", PresentationSchema_am);
module.exports = PresentationModel_am;

const PresentationSchema_pm = new Schema({
  stuId: { type: Types.ObjectId, required: true },
  course: { type: String, required: true },
  date: { type: String, required: true },
  entrance: { type: String, required: true },
  exit: { type: String, required: false },
});

const PresentationModel_pm = model("pm_presentation", PresentationSchema_pm);
module.exports = PresentationModel_pm;