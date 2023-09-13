require("./database");
const {
  Atendente,
  RegistroDeAtendimento,
  Ticket,
} = require("./database/models");
const Express = require("express");
const yup = require("yup");
const { ValidationError } = require("yup");
const { pt } = require("yup-locale-pt");
const app = Express();
const cors = require("cors");
const mongoose = require("mongoose");
const api = require("./api");
const PORT = process.env.PORT;

yup.setLocale(pt);

app.use(Express.json());
app.use(cors());

const createTicketsSchema = yup.object({
  identificado_atendente: yup.string().required(),
  titulo: yup.string().required(),
  telefone: yup.string().required(),
  identificado_cliente: yup.string().required(),
});

const updateTicketsSchema = yup.object({
  identificado_atendente: yup.string(),
  titulo: yup.string(),
  telefone: yup.string(),
  identificado_cliente: yup.string(),
});

const createAtendentesSchema = yup.object({
  identificado_pessoa: yup.string().required(),
  identificador_setor: yup.string().required(),
});

const updateAtendentesSchema = yup.object({
  identificado_pessoa: yup.string(),
  identificador_setor: yup.string(),
});

const createRegistroDeAtendimentoSchema = yup.object({
  texto: yup.string().required(),
  ticket: yup.string().required(),
});

const updateRegistroDeAtendimentoSchema = yup.object({
  texto: yup.string(),
  ticket: yup.string(),
});

const idIsValid = mongoose.Types.ObjectId.isValid;

async function departamentoExiste(codigo) {
  try {
    const response = await api.internalServicesAPI.get(
      `/departamento/${codigo}`
    );

    const departamento = response.data;

    if (!departamento) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

async function pessoaExiste(codigo) {
  try {
    const response = await api.internalServicesAPI.get(`/pessoas/${codigo}`);

    const pessoa = response.data;

    if (!pessoa) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

app.get("/ticket/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    if (!idIsValid(id)) {
      return res.status(400).json({ error: "id is invalid" });
    }

    const ticket = await Ticket.findById(id);

    return res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/ticket", async (req, res) => {
  try {
    const tickets = await Ticket.find();

    return res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/ticket", async (req, res) => {
  try {
    const { body } = req;

    await createTicketsSchema.validate(body, { strict: true });

    const ticket = await Ticket.create(body);

    return res.status(201).json(ticket);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

app.put("/ticket/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    if (!idIsValid(id)) {
      return res.status(400).json({ error: "id is invalid" });
    }

    const { body } = req;

    await updateTicketsSchema.validate(body, { strict: true });

    const ticket = Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ error: "ticket nao encontrado" });
    }

    const ticketUpdated = await Ticket.findByIdAndUpdate(id, body, {
      new: true,
    });

    return res.status(200).json(ticketUpdated);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

app.delete("/ticket/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    if (!idIsValid(id)) {
      return res.status(400).json({ error: "id is invalid" });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ error: "ticket nao encontrado" });
    }

    await Ticket.findByIdAndDelete(id);

    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/atendente/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    if (!idIsValid(id)) {
      return res.status(400).json({ error: "id is invalid" });
    }

    const atendente = await Atendente.findById(id);

    return res.status(200).json(atendente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/atendente", async (req, res) => {
  try {
    const atendentes = await Atendente.find();

    return res.status(200).json(atendentes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/atendente", async (req, res) => {
  try {
    const { body } = req;

    await createAtendentesSchema.validate(body, { strict: true });

    const pessoa = await pessoaExiste(body.identificado_pessoa);

    if (!pessoa) {
      return res.status(400).json({ error: "a pessoa informada não existe" });
    }

    const departamento = await departamentoExiste(body.identificador_setor);

    if (!departamento) {
      return res
        .status(400)
        .json({ error: "o departamento informado não existe" });
    }

    const atendente = await Atendente.create(body);

    return res.status(201).json(atendente);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

app.put("/atendente/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    if (!idIsValid(id)) {
      return res.status(400).json({ error: "id is invalid" });
    }

    const { body } = req;

    await updateAtendentesSchema.validate(body, { strict: true });

    const atendente = await Atendente.findById(id);

    if (!atendente) {
      return res.status(404).json({ error: "atendente nao encontrado" });
    }

    const pessoa = await pessoaExiste(body.identificado_pessoa);

    if (!pessoa) {
      return res.status(400).json({ error: "a pessoa informada não existe" });
    }

    const departamento = await departamentoExiste(body.identificador_setor);

    if (!departamento) {
      return res
        .status(400)
        .json({ error: "o departamento informado não existe" });
    }

    const atendenteUpdated = await Atendente.findByIdAndUpdate(id, body, {
      new: true,
    });

    return res.status(200).json(atendenteUpdated);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

app.delete("/atendente/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    if (!idIsValid(id)) {
      return res.status(400).json({ error: "id is invalid" });
    }

    const atendente = await Atendente.findById(id);

    if (!atendente) {
      return res.status(404).json({ error: "atendente nao encontrado" });
    }

    await Atendente.findByIdAndDelete(id);

    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/registro/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    if (!idIsValid(id)) {
      return res.status(400).json({ error: "id is invalid" });
    }

    const registro = await RegistroDeAtendimento.findById(id);

    return res.status(200).json(registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/registro", async (req, res) => {
  try {
    const registros = await RegistroDeAtendimento.find();

    return res.status(200).json(registros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/registro", async (req, res) => {
  try {
    const { body } = req;

    await createRegistroDeAtendimentoSchema.validate(body, { strict: true });

    const registro = await RegistroDeAtendimento.create(body);

    return res.status(201).json(registro);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

app.put("/registro/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    if (!idIsValid(id)) {
      return res.status(400).json({ error: "id is invalid" });
    }

    const { body } = req;

    await updateRegistroDeAtendimentoSchema.validate(body, { strict: true });

    const registro = await RegistroDeAtendimento.findById(id);

    if (!registro) {
      return res.status(404).json({ error: "registro nao encontrado" });
    }

    const registroUpdated = await RegistroDeAtendimento.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
      }
    );

    return res.status(200).json(registroUpdated);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

app.delete("/registro/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    if (!idIsValid(id)) {
      return res.status(400).json({ error: "id is invalid" });
    }

    const registro = await RegistroDeAtendimento.findById(id);

    if (!registro) {
      return res.status(404).json({ error: "registro nao encontrado" });
    }

    await RegistroDeAtendimento.findByIdAndDelete(id);

    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port PORT");
});
