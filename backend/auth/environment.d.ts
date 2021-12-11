declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: string;
      MONGO_URI: string;
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      JWT_COOKIE_EXPIRE: string;
    }
  }
}

export {};
