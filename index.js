
require("dotenv").config();
/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:09 AM
 *
 * @type {*}
 */
const express = require("express");
/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:09 AM
 *
 * @type {*}
 */
const sequelize = require("./db");
/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:09 AM
 *
 * @type {*}
 */
const models = require("./models/models");
/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:09 AM
 *
 * @type {*}
 */
const cors = require("cors");
/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:09 AM
 *
 * @type {*}
 */
const fileUpload = require("express-fileupload");
/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:09 AM
 *
 * @type {*}
 */
const router = require("./routes");
/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:09 AM
 *
 * @type {*}
 */
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:09 AM
 *
 * @type {*}
 */
const path = require("path");

/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:09 AM
 *
 * @type {*}
 */
const PORT = process.env.PORT || 5000;

/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:09 AM
 *
 * @type {*}
 */
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);


// Обработка ошибок, последний Middleware
app.use(errorHandler);


/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:09 AM
 *
 * @async
 * @returns {*}
 */
const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
