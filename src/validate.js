// Importa a função que carrega e valida o JSON
import { loadData } from "./services/dataService.js";

// Define o caminho do arquivo de entrada
// Caso não seja passado via variável de ambiente (INPUT), usa "input.json" como padrão
const INPUT = process.env.INPUT || "input.json";

try {
  // Carrega e valida os dados do JSON
  const data = await loadData(INPUT);

  // Se não lançar erro, significa que o JSON é válido
  console.log("✅ JSON válido. Resumo:");

  // resumo simples no console
  console.log({
    placa: data.veiculo.placa,
    proprietario: data.proprietario.nome,
    manutencoes: data.historicoManutencao.length // quantidade de registros de manutenção
  });

} catch (e) {
  // Se der erro na validação, mostra mensagem de erro no console
  console.error("❌ JSON inválido:", e.message);

  // Se houver detalhes de issues (erros de validação específicos), lista cada um
  if (e?.details?.issues) console.error(e.details.issues);

  // Finaliza o processo com código de erro (1)
  process.exit(1);
}