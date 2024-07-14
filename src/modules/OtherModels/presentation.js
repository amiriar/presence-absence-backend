const { Schema, model, Types } = require("mongoose");

const PresentationSchema = new Schema({
  stuId: { type: Types.ObjectId, required: true },
  course: { type: String, required: true },
  date: { type: String, required: true },
  entrance: { type: String, required: true },
  exit: { type: String, required: false },
});

const PresentationModel = model("presentation", PresentationSchema);
module.exports = PresentationModel;
