function getDb() {
  try {
    const cloud = require("@cloudbase/node-sdk");
    const envId = process.env.CLOUDBASE_ENV_ID || process.env.TCB_ENV;

    if (!envId) {
      return null;
    }

    const app = cloud.init({
      env: envId,
    });

    return app.database();
  } catch (error) {
    return null;
  }
}

module.exports = {
  getDb,
};
