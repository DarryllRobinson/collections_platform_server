// require("rootpath")();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
//const morgan = require('morgan');
// const expressWinston = require("express-winston");
// const winston = require("winston");

//const logger = require('./middleware/logger-handlers');
const errorHandler = require("./middleware/error-handler");
const loggerHandler = require("./middleware/logger-handler");
const cronJobs = require("./crons/cron.jobs");
//const cronInvoices = require('./crons/cron.invoices');

//const mappings = require('./middleware/mapping');

app.use(express.static(__dirname + "/assets"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

// turn on http request logging using morgan
//app.use(morgan('dev'));
//console.log('%$%$%$%$$%$%$%$ logger ', logger.successHandler());
/*app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: false,
    msg: 'HTTP  ',
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) {
      return false;
    },
  })
);*/
app.use(loggerHandler);

// api routes
app.use("/api/clients", require("./clients/clients.controller"));
app.use("/api/accounts", require("./accounts/accounts.controller"));
app.use("/api/cases", require("./cases/cases.controller"));
app.use("/api/collections", require("./collections/collections.controller"));
app.use("/api/contacts", require("./contacts/contacts.controller"));
app.use("/api/customers", require("./customers/customers.controller"));
// app.use("/api/invoices", require("./invoices/invoices.controller"));
app.use("/api/outcomes", require("./outcomes/outcomes.controller"));
app.use("/api/queues", require("./queues/queues.controller"));
app.use("api/outcomes", require("./outcomes/outcomes.controller"));

// Stripe API routes
// app.use("/api/stripe", require("./stripe/stripe.controller"));

// Infor fetch route
// app.use("/api/infor", require("./crons/infor.controller"));

// Report routes
// app.use("/api/reports", require("./reports/reports.controller"));

// Mapping routes
// app.use("/api/mappings", require("./mappings/mappings.controller"));

// User routes
app.use("/api/users", require("./users/users.controller"));

// swagger docs route
app.use("/api/api-docs", require("./helpers/swagger"));

// global error handler
app.use(errorHandler);

// start server
let port = 0;
switch (process.env.REACT_APP_STAGE) {
  case "development":
    port = 4001;
    break;
  case "production":
    port = 8081;
    break;
  case "sit":
    port = 8082;
    break;
  case "uat":
    port = 8083;
    break;
  default:
    port = 4001;
    break;
}

app.listen(port, () => console.log("Server listening on port " + port));
