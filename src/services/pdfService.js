import PDFDocument from "pdfkit";
import fs from "fs";
import { formatCurrencyBRL, formatDateBR } from "./dataService.js";

function drawSectionTitle(doc, title) {
  doc.moveDown(0.5);
  doc.fontSize(16).fillColor("#111827").text(title, { underline: true });
  doc.moveDown(0.5);
}

function drawKeyValue(doc, key, value) {
  doc.fontSize(12).fillColor("#374151").text(`${key}: `, { continued: true }).fillColor("#111827").text(value);
}

function drawTableHeader(doc, headers, x, y, widths, height = 24) {
  doc.rect(x, y, widths.reduce((a, b) => a + b, 0), height).fillOpacity(1).fill("#F3F4F6").stroke();
  doc.fillColor("#111827").fontSize(12);
  let cursorX = x + 8;
  headers.forEach((h, i) => {
    doc.text(h, cursorX, y + 6, { width: widths[i] - 16, align: "left" });
    cursorX += widths[i];
  });
  doc.fillColor("#000");
}

function drawTableRow(doc, cells, x, y, widths, height = 22) {
  doc.rect(x, y, widths.reduce((a, b) => a + b, 0), height).strokeOpacity(0.2).stroke();
  let cursorX = x + 8;
  doc.fontSize(11).fillColor("#1F2937");
  cells.forEach((c, i) => {
    doc.text(String(c), cursorX, y + 5, { width: widths[i] - 16, align: "left" });
    cursorX += widths[i];
  });
}

export function createVehicleReport(data, outputPath = "relatorios/relatorio-veiculo.pdf") {
  // Garantir pasta de saída
  const outDir = outputPath.split("/").slice(0, -1).join("/") || ".";
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const doc = new PDFDocument({ margin: 50 });
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  // Capa
  doc.fontSize(24).fillColor("#111827").text("Relatório de Veículo", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).fillColor("#374151").text(`Placa: ${data.veiculo.placa}`, { align: "center" });
  doc.text(`Proprietário: ${data.proprietario.nome}`, { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#6B7280").text(`Gerado em: ${formatDateBR(new Date().toISOString())}`, { align: "center" });
  doc.addPage();

  // Dados do Veículo
  drawSectionTitle(doc, "Dados do Veículo");
  drawKeyValue(doc, "Placa", data.veiculo.placa);
  drawKeyValue(doc, "Marca", data.veiculo.marca);
  drawKeyValue(doc, "Modelo", data.veiculo.modelo);
  drawKeyValue(doc, "Ano", data.veiculo.ano);

  // Histórico
  doc.moveDown();
  drawSectionTitle(doc, "Histórico de Manutenção");
  const headers = ["Data", "Serviço", "Quilometragem", "Custo"];
  const tableX = 50;
  let tableY = doc.y;
  const widths = [90, 240, 120, 100];

  drawTableHeader(doc, headers, tableX, tableY, widths);
  tableY += 24;

  data.historicoManutencao.forEach((h, idx) => {
    // Quebra de página se necessário
    if (tableY + 26 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      tableY = doc.y;
      drawTableHeader(doc, headers, tableX, tableY, widths);
      tableY += 24;
    }
    drawTableRow(
      doc,
      [formatDateBR(h.data), h.servico, `${h.quilometragem.toLocaleString("pt-BR")} km`, formatCurrencyBRL(h.custo) ],
      tableX,
      tableY,
      widths
    );
    tableY += 22;
  });

  // Rodapé simples
  const addFooter = () => {
    const bottom = doc.page.height - 40;
    doc.fontSize(9).fillColor("#6B7280").text("Relatório gerado automaticamente • Desafio Técnico", 50, bottom, {
      width: doc.page.width - 100,
      align: "center"
    });
  };
  addFooter();
  doc.on("pageAdded", addFooter);

  doc.end();
  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(outputPath));
    writeStream.on("error", reject);
  });
}