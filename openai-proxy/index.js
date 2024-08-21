const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;

  const PIXABAY_API_KEY = "your-pixabay-api-key";

  try {
    console.log("Buscando imagem no Pixabay com o prompt:", prompt);
    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: PIXABAY_API_KEY,
        q: prompt,
        image_type: "photo",
      },
    });
    if (response.data.hits && response.data.hits.length > 0) {
      const imageUrl = response.data.hits[0].largeImageURL;
      res.json({ imageUrl: imageUrl });
    } else {
      console.log("Nenhuma imagem encontrada para o prompt:", prompt);
      res.status(404).json({ error: "Nenhuma imagem encontrada" });
    }
  } catch (error) {
    console.error(
      "Erro ao buscar imagem com a Pixabay:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Erro ao buscar imagem" });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
