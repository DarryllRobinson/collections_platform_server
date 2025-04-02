const db = require("../helpers/db");

module.exports = {
  getAll,
};

async function getAll() {
  console.log("clientService.getAll");
  try {
    const clients = await db.Clients.findAll();
    return clients;
  } catch (err) {
    console.log("clientService.getAll error: ", err);
  }
}
