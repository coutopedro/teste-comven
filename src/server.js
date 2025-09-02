import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { loadData } from "./services/dataService.js";
import { createVehicleReport } from "./services/pdfService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 1) Servir a pasta de PDFs
app.use("/relatorios", express.static(path.resolve(__dirname, "../relatorios"), {
  etag: true,
  lastModified: true,
  cacheControl: true,
  maxAge: "1h"
}));

// 2) Rota para gerar (ou regerar) e redirecionar para o arquivo
app.get("/relatorio", async (req, res) => {
  try {
    const inputPath = process.env.INPUT || "input.json";
    const outputPath = process.env.OUTPUT || "relatorios/relatorio-veiculo.pdf";
    const data = await loadData(inputPath);
    await createVehicleReport(data, outputPath);
    return res.redirect("/" + outputPath); // abre no viewer nativo do navegador
  } catch (e) {
    console.error(e);
    return res.status(500).send("Falha ao gerar relatório.");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Web rodando em http://localhost:${PORT}`);
  console.log(`→ Gere/abra o PDF em: http://localhost:${PORT}/relatorio`);
  console.log(`→ Ou acesse direto (se já gerado): http://localhost:${PORT}/relatorios/relatorio-veiculo.pdf`);
});