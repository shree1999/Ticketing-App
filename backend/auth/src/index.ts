import { app, PORT } from "./app";
import { keys } from "./config/keys";
import { connectDB } from "./services/db";

const bootstrap = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`server running on ${keys.nodeEnv} env and on port ${PORT}`);
    });
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

bootstrap();
