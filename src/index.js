import { loadData } from "./services/dataService.js";
import { createVehicleReport } from "./services/pdfService.js";
import { AppError } from "./utils/errorHandler.js";

const INPUT = process.env.INPUT || "input.json";
const OUTPUT = process.env.OUTPUT || "relatorios/relatorio-veiculo.pdf";

async function main() {
  try {
    const data = await loadData(INPUT);
    const path = await createVehicleReport(data, OUTPUT);
    console.log(`✅ PDF gerado em: ${path}`);
  } catch (err) {
    if (err instanceof AppError) {
      console.error(`❌ ${err.message}`);
      if (err.details?.issues) {
        for (const i of err.details.issues) {
          console.error(` - ${i.path}: ${i.message}`);
        }
      }
      process.exit(err.status || 1);
    } else {
      console.error("❌ Erro inesperado:", err?.message || err);
      process.exit(1);
    }
  }
}

main();