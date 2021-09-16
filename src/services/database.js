const { MongoClient } = require('mongodb');


class DatabaseService {
  constructor(params) {
    this.db = undefined;
    this.robot = params.robot;
    this.uri = params.mongoUri;
  }

  async init() {
    const client = new MongoClient(this.uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    const connection = await client.connect();
    this.db = connection.db();
  }

// {acronym:[acronym], definition: [definition]}
  async getDefinition(acronym) {
    const result = await this.db.collection('acronyms').findOne({ acronym });
    if (result) {
      return result.definition;
    }
    return;
  }

  async insertDefinition(acronym, definition) {
    const result = await this.db.collection('acronyms').insertOne({definition, acronym});
    return result;
  }
  /*
  * user - the name of the user
  */

}

module.exports = DatabaseService;