const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

const router = express.Router();

router.route("/").get((req: any, res: any) => {
    res.writeHeader(200, { "content-type": "text/html;charset=utf-8" });
    res.write("<h2 style='text-align: center;'>Hello</h2>");
    res.end();
});

app.use("/", router);

app.listen(port, () => {
    console.log(`Running server with port ${port}`);
});
