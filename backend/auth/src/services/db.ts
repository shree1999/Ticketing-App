import mongoose from "mongoose";

import { keys } from "../config/keys";

export const connectDB = async () => {
  const conn = await mongoose.connect(keys.mongoUri!);

  console.log(`Database running on host ${conn.connection.host}`);
};
