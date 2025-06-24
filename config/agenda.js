// helpers/agenda.js
const { Agenda } = require('agenda');

const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: 'agendaJobs' },
});

agenda.on('ready', () => {
  console.log('✅ Agenda is ready');
});

module.exports = agenda;
