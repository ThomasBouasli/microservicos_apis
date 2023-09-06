require("./database");
const { Departamento, Pessoa } = require("./database/models");
const Express = require("express");
const yup = require("yup");
const { ValidationError } = require("yup");
const { pt } = require("yup-locale-pt");
const app = Express();

const PORT = 3001;

yup.setLocale(pt);

app.use(Express.json());

const createDepartamentoSchema = yup.object({
  codigo: yup.string().required(),
  nome: yup.string().required(),
  setor: yup.string().required(),
});

const updateDepartamentoSchema = yup.object({
  codigo: yup.string(),
  nome: yup.string(),
  setor: yup.string(),
});

const createPessoasSchema = yup.object({
  nome: yup.string().required(),
  documento: yup.string().required(),
  endereco: yup.string().required(),
  telefone: yup.string().required(),
});

const updatePessoasSchema = yup.object({
  nome: yup.string(),
  documento: yup.string(),
  endereco: yup.string(),
  telefone: yup.string(),
});

app.get("/departamento/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const departamento = await Departamento.findById(id);

    return res.status(200).json(departamento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/departamento", async (req, res) => {
  try {
    const departamentos = await Departamento.find();

    return res.status(200).json(departamentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/departamento", async (req, res) => {
  try {
    const { body } = req;

    await createDepartamentoSchema.validate(body, { strict: true });

    const departamento = await Departamento.create(body);

    return res.status(201).json(departamento);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

app.put("/departamento/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const { body } = req;

    await updateDepartamentoSchema.validate(body, { strict: true });

    const departamento = Departamento.findById(id);

    if (!departamento) {
      return res.status(404).json({ error: "departamento not found" });
    }

    const departamentoUpdated = await Departamento.findByIdAndUpdate(id, body, {
      new: true,
    });

    return res.status(200).json(departamentoUpdated);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

app.delete("/departamento/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const departamento = await Departamento.findById(id);

    if (!departamento) {
      return res.status(404).json({ error: "departamento not found" });
    }

    await Departamento.findByIdAndDelete(id);

    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/pessoas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const pessoa = await Pessoa.findById(id);

    return res.status(200).json(pessoa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/pessoas", async (req, res) => {
  try {
    const pessoas = await Pessoa.find();

    return res.status(200).json(pessoas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/pessoas", async (req, res) => {
  try {
    const { body } = req;

    await createPessoasSchema.validate(body, { strict: true });

    const pessoa = new Pessoa(body);

    await pessoa.save();

    return res.status(201).json(pessoa);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

app.put("/pessoas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const { body } = req;

    await updatePessoasSchema.validate(body, { strict: true });

    const pessoa = Pessoa.findById(id);

    if (!pessoa) {
      return res.status(404).json({ error: "pessoa not found" });
    }

    const pessoaUpdated = await Pessoa.findByIdAndUpdate(id, body, {
      new: true,
    });

    return res.status(200).json(pessoaUpdated);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

app.delete("/pessoas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const pessoa = Pessoa.findById(id);

    if (!pessoa) {
      return res.status(404).json({ error: "pessoa not found" });
    }

    await Pessoa.findByIdAndDelete(id);

    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port PORT");
});
