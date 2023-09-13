require("./database");
const { FolhaSalarial } = require("./database/models");
const Express = require("express");
const yup = require("yup");
const { ValidationError } = require("yup");
const { pt } = require("yup-locale-pt");
const api = require("./api");
const app = Express();
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = process.env.PORT;

yup.setLocale(pt);

app.use(Express.json());

app.use(cors());

const createFolhaSalarialSchema = yup.object({
  codigo_pessoa: yup.string().required(),
  salario: yup.string().required(),
  data: yup.string().required(),
  codigo: yup.string().required(),
  departamento: yup.string().required(),
});

const updateFolhaSalarialSchema = yup.object({
  codigo_pessoal: yup.string(),
  salario: yup.string(),
  data: yup.string(),
  codigo: yup.string(),
  departamento: yup.string(),
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

app.get("/folha_salarial/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    if (!idIsValid(id)) {
      return res.status(400).json({ error: "id is invalid" });
    }

    const folhaSalarial = await FolhaSalarial.findById(id);

    return res.status(200).json(folhaSalarial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/folha_salarial", async (req, res) => {
  try {
    const folhaSalarial = await FolhaSalarial.find();

    return res.status(200).json(folhaSalarial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/folha_salarial", async (req, res) => {
  try {
    const { body } = req;

    await createFolhaSalarialSchema.validate(body, { strict: true });

    const departamento = await departamentoExiste(body.departamento);

    if (!departamento) {
      return res
        .status(400)
        .json({ error: "o departamento informado não existe" });
    }

    const folhaSalarial = await FolhaSalarial.create(body);

    return res.status(201).json(folhaSalarial);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

app.put("/folha_salarial/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    if (!idIsValid(id)) {
      return res.status(400).json({ error: "id is invalid" });
    }

    const { body } = req;

    await updateFolhaSalarialSchema.validate(body, { strict: true });

    const departamento = await departamentoExiste(body.departamento);

    if (!departamento) {
      return res
        .status(400)
        .json({ error: "o departamento informado não existe" });
    }

    const folhaSalarial = FolhaSalarial.findById(id);

    if (!folhaSalarial) {
      return res.status(404).json({ error: "departamento not found" });
    }

    const folhaSalarialUpdated = await FolhaSalarial.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
      }
    );

    return res.status(200).json(folhaSalarialUpdated);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

app.delete("/folha_salarial/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    if (!idIsValid(id)) {
      return res.status(400).json({ error: "id is invalid" });
    }

    const folhaSalarial = await FolhaSalarial.findById(id);

    if (!folhaSalarial) {
      return res.status(404).json({ error: "departamento not found" });
    }

    await FolhaSalarial.findByIdAndDelete(id);

    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port PORT");
});
