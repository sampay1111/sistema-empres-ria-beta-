
"use strict";

const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Base inicial: dados em memória.
// IMPORTANTE: os dados podem desaparecer quando o processo reiniciar.
// Depois, conectaremos um banco de dados persistente.
let state = {
  products: [],
  movements: [],
  notes: []
};

const makeId = () => crypto.randomUUID();

function cleanText(value, max = 5000) {
  return String(value ?? "").trim().slice(0, max);
}

function findProduct(id) {
  return state.products.find(product => product.id === id);
}

function validQuantity(value) {
  return Number.isFinite(Number(value)) && Number(value) >= 0;
}

// Status da API
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "Almoxarifado Inteligente API",
    timestamp: new Date().toISOString()
  });
});

// Retorna todos os dados do protótipo
app.get("/api/state", (req, res) => {
  res.json(state);
});

// Restaura backup no estado atual
app.put("/api/state", (req, res) => {
  const data = req.body;

  if (
    !data ||
    !Array.isArray(data.products) ||
    !Array.isArray(data.movements) ||
    !Array.isArray(data.notes)
  ) {
    return res.status(400).json({ error: "Formato de backup inválido." });
  }

  state = {
    products: data.products,
    movements: data.movements,
    notes: data.notes
  };

  res.json({ ok: true, state });
});

// Lista produtos
app.get("/api/products", (req, res) => {
  res.json(state.products);
});

// Cadastra produto
app.post("/api/products", (req, res) => {
  const body = req.body || {};

  if (!cleanText(body.name, 200)) {
    return res.status(400).json({ error: "Informe o nome do produto." });
  }

  if (!validQuantity(body.qty) || !validQuantity(body.min)) {
    return res.status(400).json({ error: "Quantidade inválida." });
  }

  const product = {
    id: makeId(),
    name: cleanText(body.name, 200),
    code: cleanText(body.code, 100),
    qty: Number(body.qty),
    min: Number(body.min),
    reorder: Math.max(0, Number(body.reorder) || 0),
    supplier: cleanText(body.supplier, 200),
    phone: cleanText(body.phone, 40),
    location: cleanText(body.location, 200),
    unitValue: Math.max(0, Number(body.unitValue) || 0),
    aliases: cleanText(body.aliases, 500),
    description: cleanText(body.description, 3000),
    notes: cleanText(body.notes, 3000),
    photo: typeof body.photo === "string" ? body.photo : "",
    created: new Date().toISOString()
  };

  state.products.push(product);
  res.status(201).json(product);
});

// Atualiza produto
app.put("/api/products/:id", (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Produto não encontrado." });
  }

  const body = req.body || {};

  if (!cleanText(body.name, 200)) {
    return res.status(400).json({ error: "Informe o nome do produto." });
  }

  if (!validQuantity(body.qty) || !validQuantity(body.min)) {
    return res.status(400).json({ error: "Quantidade inválida." });
  }

  Object.assign(product, {
    name: cleanText(body.name, 200),
    code: cleanText(body.code, 100),
    qty: Number(body.qty),
    min: Number(body.min),
    reorder: Math.max(0, Number(body.reorder) || 0),
    supplier: cleanText(body.supplier, 200),
    phone: cleanText(body.phone, 40),
    location: cleanText(body.location, 200),
    unitValue: Math.max(0, Number(body.unitValue) || 0),
    aliases: cleanText(body.aliases, 500),
    description: cleanText(body.description, 3000),
    notes: cleanText(body.notes, 3000),
    photo: typeof body.photo === "string" ? body.photo : ""
  });

  res.json(product);
});

// Exclui produto
app.delete("/api/products/:id", (req, res) => {
  const before = state.products.length;
  state.products = state.products.filter(p => p.id !== req.params.id);

  if (state.products.length === before) {
    return res.status(404).json({ error: "Produto não encontrado." });
  }

  res.json({ ok: true });
});

// Lista movimentações
app.get("/api/movements", (req, res) => {
  res.json(state.movements);
});

// Registra entrada, saída ou ajuste de estoque
app.post("/api/movements", (req, res) => {
  const body = req.body || {};
  const product = findProduct(body.productId);
  const qty = Number(body.qty);
  const type = body.type;

  if (!product) {
    return res.status(404).json({ error: "Produto não encontrado." });
  }

  if (!Number.isFinite(qty) || qty <= 0) {
    return res.status(400).json({ error: "Informe uma quantidade válida." });
  }

  if (!["in", "out", "adjust"].includes(type)) {
    return res.status(400).json({ error: "Tipo de movimentação inválido." });
  }

  if (type === "out" && qty > Number(product.qty)) {
    return res.status(400).json({ error: "Saída maior que o estoque disponível." });
  }

  // O servidor calcula a quantidade: não confia em um saldo enviado pelo navegador.
  if (type === "in") product.qty = Number(product.qty) + qty;
  if (type === "out") product.qty = Number(product.qty) - qty;
  if (type === "adjust") product.qty = qty;

  const movement = {
    id: makeId(),
    productId: product.id,
    type,
    qty,
    date: cleanText(body.date, 20) || new Date().toISOString().slice(0, 10),
    reason: cleanText(body.reason, 1000),
    created: new Date().toISOString()
  };

  state.movements.push(movement);

  // Se a movimentação veio de uma anotação confirmada, guarda a anotação também.
  if (body.noteText) {
    state.notes.push({
      id: makeId(),
      text: cleanText(body.noteText, 3000),
      date: movement.date,
      processed: true,
      created: new Date().toISOString()
    });
  }

  res.status(201).json({
    movement,
    product
  });
});

// Lista anotações
app.get("/api/notes", (req, res) => {
  res.json(state.notes);
});

// Salva anotação sem alterar o estoque
app.post("/api/notes", (req, res) => {
  const body = req.body || {};
  const text = cleanText(body.text, 3000);

  if (!text) {
    return res.status(400).json({ error: "A anotação não pode ficar vazia." });
  }

  const note = {
    id: makeId(),
    text,
    date: cleanText(body.date, 20) || new Date().toISOString().slice(0, 10),
    processed: false,
    created: new Date().toISOString()
  };

  state.notes.push(note);
  res.status(201).json(note);
});

// Frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Fallback de erro
app.use((err, req, res, next) => {
  console.error("Erro na API:", err.message);

  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "Arquivo muito grande. Reduza o tamanho da foto." });
  }

  res.status(500).json({ error: "Erro interno no servidor." });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Almoxarifado Inteligente rodando na porta ${PORT}`);
});