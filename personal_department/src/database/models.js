const mongoose = require("mongoose");

const FolhaSalarialSchema = new mongoose.Schema({
  codigo_pessoa: {
    type: String,
    required: true,
  },
  salario: {
    type: Number,
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  codigo: {
    type: String,
    required: true,
  },
  departamento: {
    type: String,
    required: true,
  },
});

const FolhaSalarial = mongoose.model("FolhaSalarial", FolhaSalarialSchema);

module.exports = {
  FolhaSalarial,
};
