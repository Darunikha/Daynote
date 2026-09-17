require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await mongoose.connection.db.collection('users').find({}).toArray();
  console.log('Users found:', users.length);
  users.forEach(u => console.log(' -', u.email, '|', u.name));
  process.exit(0);
}).catch(e => {
  console.error(e.message);
  process.exit(1);
});
