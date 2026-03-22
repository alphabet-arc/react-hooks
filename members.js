const mongoose = require("mongoose");

//Schema for members
const membersSchema = new mongoose.Schema({
  employee_id: {
    type: Number,
    required: true,
    min: [100000, "Employee ID is expected between 100000 and 3000000"],
    max: [3000000, "Employee ID is expected between 100000 and 3000000"],
  },
  employee_name: {
    type: String,
    required: true,
    validate: [
      {
        validator: function(v) {
          return /^[a-zA-Z ]+$/.test(v);
        },
        message: "Employee name should contain only alphabets and spaces"
      },
      {
        validator: function(v) {
          return v && v.length > 2;
        },
        message: "Employee name length should be greater than 2"
      }
    ]
  },
  technology_name: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
    min: [0, "Experience should be greater than or equal to 0"],
  },
});

//setting up members model
const Members = mongoose.model("Members", membersSchema);

module.exports = Members;
