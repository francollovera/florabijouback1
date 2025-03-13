import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";
// Agrega credenciales
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Soy el server :)");
});

app.post("https://florabijouback1.vercel.app/create_preference", async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: "https://florafront1.vercel.app/",
        failure: "https://florafront1.vercel.app/",
        pending: "https://florafront1.vercel.app/",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });
    res.json({
      id: result.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error al crear la preferencia :(",
    });
  }
});

app.listen(port, () => {
  console.log(`El servidor esta corriendo en el puerto ${port}`);
});
