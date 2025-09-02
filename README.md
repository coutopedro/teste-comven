# Desafio Técnico: Geração de PDF a partir de JSON (Node.js + PDFKit)

Candidato: Pedro Paulo do Couto de Jesus

**desafio técnico**.  
O objetivo é ler um `input.json`, validar os dados e gerar um PDF profissional com capa, dados do veículo e histórico de manutenção.

## ✅ Tecnologias
- Node.js 
- [pdfkit](https://github.com/foliojs/pdfkit)
- [zod](https://github.com/colinhacks/zod) (validação de schema)
- [express](https://expressjs.com/) (modo web, para abrir no navegador)

## 🧱 Estrutura
```
/desafio-pdf
 ├── src
 │   ├── index.js              # Ponto de entrada (modo CLI)
 │   ├── validate.js           # Valida o JSON rapidamente
 │   ├── server.js             # Servidor Express (modo Web)
 │   ├── services
 │   │   ├── dataService.js    # Lê e valida o JSON
 │   │   └── pdfService.js     # Gera o PDF
 │   └── utils
 │       └── errorHandler.js   # Erros e utilitários
 ├── input.json                # Exemplo de entrada
 ├── package.json
 └── README.md
```

## 🚀 Como rodar (modo CLI)

1) **Instale o Node.js** (>= 18).  
   - Verifique com:
   ```bash
   node -v
   npm -v
   ```

2) **Instale as dependências**:
   ```bash
   npm install
   ```

3) **Valide o JSON (opcional)**:
   ```bash
   npm run validate
   ```

4) **Gere o PDF**:
   ```bash
   npm start
   ```
   O arquivo será salvo em `relatorios/relatorio-veiculo.pdf`.

## 🌐 Executando no Navegador (Servidor Express)

Além do modo CLI, é possível abrir o PDF diretamente no navegador.

### 1. Instalar o Express
```bash
npm install express
```

### 2. Rodar o servidor
```bash
npm run web
```

### 3. Acessar as rotas
- Gere e abra automaticamente o relatório:  
  👉 http://localhost:3000/relatorio

- Acesse direto o último relatório já gerado:  
  👉 http://localhost:3000/relatorios/relatorio-veiculo.pdf

### 🔒 Observações
- O Express serve a pasta `relatorios/` estaticamente.  
- Sempre que você chamar `/relatorio`, um novo PDF é gerado e sobrescreve o arquivo anterior.  
- Ideal para demonstrar o resultado no navegador sem abrir manualmente.

---

## 🔒 Tratamento de erros
- JSON ausente, malformado ou com campos inválidos → mensagens claras + status code de saída.
- Validação com `zod` para campos obrigatórios e formatos.

## 📝 Justificativa da biblioteca
**pdfkit** foi escolhido por ser leve, não depender de headless browsers e oferecer controle programático sobre layout e tipografia.  
Se fosse necessário usar HTML/CSS, uma alternativa seria **puppeteer**, mas para este desafio técnico o `pdfkit` é mais simples e performático.

## 🧩 Próximos passos (opcionais)
- Paginação com totalizadores por página  
- Sumário  
- Fonte customizada e logotipo na capa  
- Exportar também em CSV  
