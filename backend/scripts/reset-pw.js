require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const NEW_PASSWORD = 'darunikha123';
const EMAIL = 'sdarunikha@gmail.com';

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const hashed = await bcrypt.hash(NEW_PASSWORD, 10);
  const result = await db.collection('users').updateOne(
    { email: EMAIL },
    { $set: { password: hashed } }
  );
  console.log('Updated:', result.modifiedCount, 'user(s)');
  console.log('You can now log in with:');
  console.log('  Email:   ', EMAIL);
  console.log('  Password:', NEW_PASSWORD);
  process.exit(0);
}).catch(e => {
  console.error(e.message);
  process.exit(1);
});
