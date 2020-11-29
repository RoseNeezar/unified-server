import { connect } from "mongoose";

export default async function createSession() {
  const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD!
  );

  const MONGO_URL = process.env.DATABASE || "";
  console.log(MONGO_URL);
  if (!MONGO_URL) {
    throw new Error("Missing db");
  }

  await connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
}
