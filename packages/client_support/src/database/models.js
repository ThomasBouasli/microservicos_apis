const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  identificado_atendente: {
    type: String,
    required: true,
  },
  titulo: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
  },
  identificado_cliente: {
    type: String,
    required: true,
  },
});

const AtendenteSchema = new mongoose.Schema({
  identificado_pessoa: {
    type: String,
    required: true,
  },
  identificador_setor: {
    type: String,
    required: true,
  },
});

const RegistroDeAtendimentoSchema = new mongoose.Schema({
  texto: {
    type: String,
    required: true,
  },
  ticket: {
    type: String,
    required: true,
  },
});

const Ticket = mongoose.model("Ticket", TicketSchema);

const Atendente = mongoose.model("Atendente", AtendenteSchema);

const RegistroDeAtendimento = mongoose.model(
  "RegistroDeAtendimento",
  RegistroDeAtendimentoSchema
);

module.exports = {
  Ticket,
  Atendente,
  RegistroDeAtendimento,
};
