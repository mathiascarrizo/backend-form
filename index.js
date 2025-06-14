const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "sql312.infinityfree.com",
  user: "if0_39228198",
  password: process.env.DB_PASSWORD,
  database: "if0_39228198_velluto_consultasformulario",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error de conexión a la base de datos:", err);
  } else {
    console.log("✅ Conectado a MySQL en InfinityFree");
  }
});

app.get("/", (req, res) => {
  res.send("Servidor Velluto activo");
});

app.post("/formulario", (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  if (!nombre || !email || !asunto || !mensaje) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  const fecha = new Date();

  const sql =
    "INSERT INTO consultas (nombre, email, asunto, mensaje, fecha) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [nombre, email, asunto, mensaje, fecha], (err, result) => {
    if (err) {
      console.error("❌ Error al guardar en la base de datos:", err);
      return res
        .status(500)
        .json({ mensaje: "Error al guardar en la base de datos" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Gracias por su reserva",
      text: `Gracias por su reserva, ${nombre}. ¡Lo esperamos pronto!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Error al enviar el correo:", error);
        return res
          .status(500)
          .json({ mensaje: "Guardado en base, pero falló el email" });
      } else {
        console.log("📧 Correo enviado:", info.response);
        return res
          .status(200)
          .json({ mensaje: "Formulario recibido con éxito" });
      }
    });
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
