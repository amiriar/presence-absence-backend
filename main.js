const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const NotFoundHandler = require("./src/common/exception/notFound.handler");
const AllExceptionHandler = require("./src/common/exception/all-exception.handler");
const cookieParser = require("cookie-parser");
const mainRouter = require("./src/app.routes");
const swaggerConfig = require("./src/config/swagger.config");

dotenv.config();

async function main() {
  const app = express();
  require("./src/config/mongoDB.config");

  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization", "Bearer", "x-api-key"],
    })
  );

  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
  
  app.use(mainRouter);

  swaggerConfig(app)
  
  NotFoundHandler(app);
  AllExceptionHandler(app);

  app.listen(3001, () => {
    console.log(`Server is running on: http://localhost:3001`);
  });
}

main();
