const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/profissionais.json');

const listarProfissionais = (req, res) => {
  const { especialidade, nome } = req.query;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ erro: 'Erro ao ler arquivo' });

    let profissionais = JSON.parse(data);

    if (especialidade) {
      profissionais = profissionais.filter(p =>
        p.especialidade.toLowerCase() === especialidade.toLowerCase()
      );
    }

    if (nome) {
      profissionais = profissionais.filter(p =>
        p.nome.toLowerCase().includes(nome.toLowerCase())
      );
    }

    res.json(profissionais);
  });
};

module.exports = { listarProfissionais };
