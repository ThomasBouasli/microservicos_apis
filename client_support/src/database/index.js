const mongoose = require("mongoose");

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
      {
        authSource: "admin",
        auth: {
          username: process.env.MONGO_USERNAME,
          password: process.env.MONGO_PASSWORD,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
};

start();
