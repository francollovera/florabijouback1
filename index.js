import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";
// Agrega credenciales
const client = new MercadoPagoConfig({
  accessToken: "APP_USR-8756355838713146-090922-92a14ee2d300c1ef80751bfac4bf6a23-23016067",
});

const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Soy el server :)");
});
app.get("/api", (req, res) => {
  res.send("Soy la API :)");
});

app.post("/create_preference", async (req, res) => {
  console.log("Cuerpo recibido:", req.body);
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
