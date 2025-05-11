const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta per registrar usuari
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );
    res.status(201).json({ message: 'Usuari registrat correctament' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuari' });
  }
});

//Funcio per login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar l’usuari
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Usuari no trobat' });
    }

    const user = result.rows[0];

    // Comprovar contrasenya
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Contrasenya incorrecta' });
    }

    res.json({ message: 'Login correcte', userId: user.id });
  } catch (err) {
    console.error("Error al fer login:", err);
    res.status(500).json({ error: 'Error al fer login' });
  }
});

//Crear una lliga
app.post('/api/create-league', async (req, res) => {
  const { name, userId } = req.body;

  try {
    // 1. Crear la lliga
    const result = await db.query(
      'INSERT INTO leagues (name, owner_id) VALUES ($1, $2) RETURNING id',
      [name, userId]
    );
    const leagueId = result.rows[0].id;

    // 2. Afegir l’usuari creador com a membre de la lliga
    await db.query(
      'INSERT INTO league_users (user_id, league_id) VALUES ($1, $2)',
      [userId, leagueId]
    );

    res.status(201).json({ message: 'Lliga creada correctament', leagueId });
  } catch (err) {
    console.error('Error al crear la lliga:', err);
    res.status(500).json({ error: 'Error al crear la lliga' });
  }
});

//afegir usuari a lliga

app.post('/api/join-league', async (req, res) => {
  const { userId, leagueId } = req.body;

  try {
    // Comprovem si ja hi és
    const existing = await db.query(
      'SELECT * FROM league_users WHERE user_id = $1 AND league_id = $2',
      [userId, leagueId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'L’usuari ja forma part d’aquesta lliga' });
    }

    // Afegim l’usuari
    await db.query(
      'INSERT INTO league_users (user_id, league_id) VALUES ($1, $2)',
      [userId, leagueId]
    );

    res.status(201).json({ message: 'Usuari afegit a la lliga' });
  } catch (err) {
    console.error('Error afegint usuari a la lliga:', err);
    res.status(500).json({ error: 'Error intern' });
  }
});

//Asignar Equip
app.post('/api/assign-players', async (req, res) => {
  const { userId, leagueId } = req.body;

  try {
    // 1. Jugadors ja assignats en aquesta lliga
    const assigned = await db.query(
      `SELECT player_id FROM user_players WHERE league_id = $1`,
      [leagueId]
    );
    const assignedIds = assigned.rows.map(row => row.player_id);
    const assignedFilter = assignedIds.length > 0 ? `WHERE id NOT IN (${assignedIds.join(',')})` : '';

    // Helper per seleccionar jugadors per posició
    async function selectPlayersByPosition(position, limit) {
      const query = `
        SELECT id FROM players
        WHERE general_position = $1
        ${assignedIds.length > 0 ? `AND id NOT IN (${assignedIds.join(',')})` : ''}
        ORDER BY RANDOM() LIMIT $2
      `;
      const result = await db.query(query, [position, limit]);
      return result.rows.map(r => r.id);
    }

    // 2. Seleccionar segons posicions
    const goalkeepers = await selectPlayersByPosition('Goalkeeper', 1);
    const defences = await selectPlayersByPosition('Defence', 4);
    const midfields = await selectPlayersByPosition('Midfield', 3);
    const offences = await selectPlayersByPosition('Offence', 3);

    const selectedIds = [
      ...goalkeepers,
      ...defences,
      ...midfields,
      ...offences
    ];

    // 3. Omplir amb 2 jugadors extra de qualsevol posició
    const extraQuery = `
      SELECT id FROM players
      ${assignedFilter}
      AND id NOT IN (${selectedIds.join(',')})
      ORDER BY RANDOM() LIMIT 2
    `;
    const extra = await db.query(extraQuery);
    selectedIds.push(...extra.rows.map(r => r.id));

    // 4. Comprovem si n'hi ha 13
    if (selectedIds.length < 13) {
      return res.status(400).json({ error: 'No hi ha prou jugadors disponibles per complir el repartiment' });
    }

    // 5. Inserim a user_players
    for (const playerId of selectedIds) {
      await db.query(
        'INSERT INTO user_players (user_id, league_id, player_id) VALUES ($1, $2, $3)',
        [userId, leagueId, playerId]
      );
    }

    res.status(201).json({ message: 'Equip assignat correctament', playerIds: selectedIds });

  } catch (err) {
    console.error('❌ Error assignant equip:', err);
    res.status(500).json({ error: 'Error intern' });
  }
});

app.listen(3001, () => {
  console.log('Servidor en marxa a http://localhost:3001');
});
