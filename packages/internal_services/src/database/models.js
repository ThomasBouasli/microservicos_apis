const mongoose = require("mongoose");

const DepartamentoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
  },
  nome: {
    type: String,
    required: true,
  },
  setor: {
    type: String,
    required: true,
  },
});

const PessoaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  documento: {
    type: String,
    required: true,
  },
  endereco: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
  },
});

const Departamento = mongoose.model("Departamento", DepartamentoSchema);

const Pessoa = mongoose.model("Pessoa", PessoaSchema);

module.exports = {
  Departamento,
  Pessoa,
};
