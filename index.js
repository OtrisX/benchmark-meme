const express = require('express');
const app = express();
const port = 8080;
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT
  )`);
});

app.use(express.json());

app.get('/', (req, res) => {
        const rows = [];
        const query = 'SELECT * FROM usuarios';

        db.all(query, (err, rows) => {
                if (err) {
                res.status(500).json({ error: err.message });
                return;
                }

                const quantidadeEntradas = rows.length;
                res.json({ message: 'Dados retornados com sucesso!', quantidadeEntradas});
        });
});

app.post('/', (req, res) => {
  const { nome, email } = req.body;
  const sql = 'INSERT INTO usuarios (nome, email) VALUES (?, ?)';

  db.serialize(() => {
    for (let i = 0; i < 10000; i++) {
      db.run(sql, [nome, email], (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
      });
    }
    res.json({ message: 'Dados inseridos com sucesso!' });
  });
});

app.delete('/', (req, res) => {
  const sql = 'DROP TABLE usuarios';

  db.serialize(() => {
    db.run(sql, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: 'Tabela usuarios deletada com sucesso!' });
      }
    });

    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT
      )`);
  });
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});