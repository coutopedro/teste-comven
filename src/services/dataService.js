import fs from "fs/promises";
// Importa a biblioteca Zod para validação de schema
import { z } from "zod";
// Importa a classe de erro personalizada
import { AppError } from "../utils/errorHandler.js";

// 📌 Schema de validação para cada item do histórico de manutenção
const HistoricoSchema = z.object({

  data: z.string().date("Data deve estar no formato ISO (YYYY-MM-DD)"),
 
  servico: z.string().min(1, "Serviço é obrigatório"),

  quilometragem: z.number().int().nonnegative("Quilometragem inválida"),

  custo: z.number().nonnegative("Custo inválido")
});

// principal de validação dos dados
const DataSchema = z.object({
  veiculo: z.object({
    placa: z.string().min(1, "Placa é obrigatória"),
    marca: z.string().min(1, "Marca é obrigatória"),
    modelo: z.string().min(1, "Modelo é obrigatório"),
    // ano deve ser inteiro entre 1900 e o próximo ano
    ano: z.number().int().min(1900).max(new Date().getFullYear() + 1)
  }),
  proprietario: z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    documento: z.string().min(5, "Documento é obrigatório"),
    endereco: z.string().min(1, "Endereço é obrigatório")
  }),
  // histórico é um array de objetos, validado pelo HistoricoSchema
  historicoManutencao: z.array(HistoricoSchema).default([])
});

// Função para carregar e validar os dados do JSON
export async function loadData(path = "input.json") {
  try {
    // Lê o arquivo JSON no caminho informado
    const content = await fs.readFile(path, "utf-8");
    // Faz o parse para objeto JS
    const json = JSON.parse(content);

    // Valida contra o schema definido com Zod
    const parsed = DataSchema.safeParse(json);

    // Caso a validação falhe, lança erro com os detalhes
    if (!parsed.success) {
      const issues = parsed.error.issues.map(i => ({
        path: i.path.join("."), // caminho do campo inválido
        message: i.message      // mensagem de erro
      }));
      throw new AppError("JSON inválido", 422, { issues });
    }

    // Retorna os dados já validados
    return parsed.data;

  } catch (e) {
    // Se for erro customizado, apenas repassa
    if (e instanceof AppError) throw e;

    // Se o arquivo não existir
    if (e.code === "ENOENT") {
      throw new AppError(`Arquivo não encontrado: ${path}`, 404);
    }

    // Se o JSON for malformado (erro de sintaxe)
    if (e instanceof SyntaxError) {
      throw new AppError("JSON malformado", 400);
    }

    // Erro genérico
    throw new AppError(e.message || "Erro ao ler JSON", 500);
  }
}

export function formatCurrencyBRL(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

// datas no padrão brasileiro (dd/mm/aaaa)
export function formatDateBR(dateStr) {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("pt-BR").format(d);
}