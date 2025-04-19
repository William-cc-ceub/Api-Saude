const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true })); 

const filePath = path.join(__dirname, 'data', 'profissionais.json');

app.get('/', (req, res) => {
  res.redirect('/profissionais');
});

app.get('/profissionais', (req, res) => {
  const { especialidade, nome } = req.query;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Erro ao carregar dados');

    let profissionais = JSON.parse(data);
    const especialidadesUnicas = [...new Set(profissionais.map(p => p.especialidade))];

    let filtrados = profissionais;
    if (especialidade) {
      filtrados = filtrados.filter(p =>
        p.especialidade.toLowerCase() === especialidade.toLowerCase()
      );
    }
    if (nome) {
      filtrados = filtrados.filter(p =>
        p.nome.toLowerCase().includes(nome.toLowerCase())
      );
    }

    let html = `
      <html>
        <head>
          <title>Profissionais de Saúde</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            form { margin-bottom: 20px; }
            input, select, button { padding: 6px; margin-right: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; border: 1px solid #ccc; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <h1>Profissionais de Saúde</h1>

          <form method="get" action="/profissionais">
            <label>Nome:</label>
            <input type="text" name="nome" value="${nome || ''}">
            <label>Especialidade:</label>
            <select name="especialidade">
              <option value="">Todas</option>`;
    especialidadesUnicas.forEach(esp => {
      const selected = esp === especialidade ? 'selected' : '';
      html += `<option value="${esp}" ${selected}>${esp}</option>`;
    });
    html += `
            </select>
            <button type="submit">Buscar</button>
          </form>

          <table>
            <thead>
              <tr><th>Nome</th><th>Especialidade</th></tr>
            </thead>
            <tbody>`;
    filtrados.forEach(p => {
      html += `<tr><td>${p.nome}</td><td>${p.especialidade}</td></tr>`;
    });
    html += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    res.send(html);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
