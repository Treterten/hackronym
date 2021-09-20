// Description:
//
//
// Configuration:
//   None
//
// Dependencies:
//   None
//
// Commands:
const fs = require('fs');
const DatabaseService = require('./services/database.js');

const uri = process.env.HACRONYM_DB_URI|| 'mongodb://localhost/plusPlus';


module.exports = async function(robot) {
  const db = new DatabaseService({robot, mongoUri: uri});
  await db.init();
  "use strict";
  const hackronymRegex = /(define)(.*)/;


  robot.respond(hackronymRegex, async function(res) {
    const acronym = res.match[2].trim().toUpperCase();
    const definition = await db.getDefinition(acronym);
    if (!definition) {
      res.send("Sorry that acronym is not in our dictionary. If you figure out the definition, use `@qrafty add | Acronym | Definition` to add an acronym");
    } else {
      const msg = `The meaning of ${acronym} is ${definition}`
      res.send(msg);
    }
  });

  const addRegex = /(add)(.*)/;

  robot.respond(addRegex, async function(res) {
    const data = res.match[0].split("|");
    const acronym = data[1].trim();
    const definition = data[2].trim();

    try {
      await db.insertDefinition(acronym, definition);
      const msg = "Acronym added!"
      res.send(msg);
    } catch (e) {
      console.error(e);
      res.send('Sorry, there\'s been an error.')
    }

  })
};
