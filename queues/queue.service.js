const tenantdb = require('../helpers/tenant.db');

module.exports = {
  getAll,
  getByUser,
};

async function connectDB(user, password, db) {
  const sequelize = await tenantdb.connect(user, password);
  return require(`../${db}s/${db}.model`)(sequelize);
}

async function getAll(user, password) {
  const db = await connectDB(user, password, 'case');
  const queues = await db.findAll();
  return queues.map((x) => basicDetails(x));
}

async function getByUser() {
  const db = await connectDB(user, password, 'case');
  const queues = await db.findAll();
  return queues.map((x) => basicDetails(x));
}

function basicDetails(queue) {
  const {
    id,
    queueNumber,
    currentAssignment,
    initialAssignment,
    queueNotes,
    kamNotes,
    currentStatus,
    nextVisitDateTime,
    pendReason,
    resolution,
    queueReason,
    lockedDatetime,
    createdDate,
    createdBy,
    reassignedDate,
    reassignedBy,
    reopenedDate,
    reopenedBy,
    updatedDate,
    updatedBy,
    f_accountNumber,
  } = queue;
  return {
    id,
    currentAssignment,
    currentStatus,
  };
}
