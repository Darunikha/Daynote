// Usage (from backend/): node scripts/reset-pw.js <email> <new-password>
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const [email, newPassword] = process.argv.slice(2);
if (!email || !newPassword) {
  console.error('Usage: node scripts/reset-pw.js <email> <new-password>');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to:', mongoose.connection.host);
  const hashed = await bcrypt.hash(newPassword, 10);
  const result = await mongoose.connection.db.collection('users').updateOne(
    { email: email.toLowerCase() },
    { $set: { password: hashed } }
  );
  console.log('Updated:', result.modifiedCount, 'user(s)');
  process.exit(0);
}).catch(e => {
  console.error(e.message);
  process.exit(1);
});
