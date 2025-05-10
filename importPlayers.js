require('dotenv').config();
const axios = require('axios');
const db = require('./db');

const API_TOKEN = process.env.FOOTBALL_DATA_TOKEN;
const API_BASE = 'https://api.football-data.org/v4';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function importarTotsElsJugadors() {
  try {
    const equips = await axios.get(`${API_BASE}/competitions/PD/teams`, {
      headers: { 'X-Auth-Token': API_TOKEN }
    });

    for (const team of equips.data.teams) {
      const teamId = team.id;
      const teamName = team.name;

      // Espera 6 segons entre equips (10 peticions per minut màxim)
      await sleep(6000);

      const detallsEquip = await axios.get(`${API_BASE}/teams/${teamId}`, {
        headers: { 'X-Auth-Token': API_TOKEN }
      });

      const jugadors = detallsEquip.data.squad;

      for (const player of jugadors) {
        const { name, position } = player;

        await db.query(
          'INSERT INTO players (name, team, position) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
          [name, teamName, position]
        );

        console.log(`✅ ${name} - ${position} (${teamName})`);
      }
    }

    console.log('✔️ Importació completada.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

importarTotsElsJugadors();
