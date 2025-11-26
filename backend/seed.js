const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address as an argument.');
  process.exit(1);
}

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flood-report');
    
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User with email '${email}' not found.`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`User '${email}' has been granted admin privileges.`);
    process.exit(0);
  } catch (err) {
    console.error('Error making user admin:', err.message);
    process.exit(1);
  }
};

makeAdmin();
