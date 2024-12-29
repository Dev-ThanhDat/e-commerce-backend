const mongoose = require('mongoose');

module.exports.dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    if (conn.connection.readyState === 1)
      console.log('Kết nối database thành công!');
  } catch (error) {
    console.log('Kết nối database không thành công!');
    throw new Error(error);
  }
};
