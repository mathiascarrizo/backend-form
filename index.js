const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/formulario", (req, res) => {
  const datos = req.body;
  console.log("📩 Datos recibidos:", datos);
  res.json({ mensaje: "Formulario recibido con éxito", datos });
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando 😎");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
