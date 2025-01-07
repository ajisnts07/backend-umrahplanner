const mongoose = require('mongoose');

const MONGODB_NAME = process.env.DB_NAME;
const MONGODB_CLUSTER = process.env.DB_CLUSTER;
const MONGODB_USERNAME = process.env.DB_USERNAME;
const MONGODB_PASSWORD = process.env.DB_PASSWORD;

mongoose
  .connect(
    // `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}-shard-00-00.vf57l.mongodb.net:27017,${MONGODB_CLUSTER}-shard-00-01.vf57l.mongodb.net:27017,${MONGODB_CLUSTER}-shard-00-02.vf57l.mongodb.net:27017/${MONGODB_NAME}?ssl=true&replicaSet=atlas-14o1q9-shard-0&authSource=admin&retryWrites=true&w=majority&appName=${MONGODB_CLUSTER}`
    `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.vf57l.mongodb.net/${MONGODB_NAME}?retryWrites=true&w=majority&appName=${MONGODB_CLUSTER}
`
  )

  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => {
    console.error('Connection database failed', err);
  });

module.exports = mongoose;
