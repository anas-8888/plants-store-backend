// Require files
require("dotenv").config({ path: "./secret.env" });
require("./config/passport.setup");

// Call library
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const express = require("express");
const passport = require("passport");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieSession = require("cookie-session");

// Import routes
const test = require("./routes/test");
const order = require("./routes/order");
const plant = require("./routes/plant");
const auth = require("./routes/auth");
const category = require("./routes/category");
const customer = require("./routes/customer");
const subCategory = require("./routes/subCategory");

// Init
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Cookies
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY || "fallbackSecret"],
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Allowed domains
const allowedDomains = [
  "https://frontend.com",
  "https://another-allowed-site.com",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedDomains.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});
app.use("/api/", apiLimiter);

// Protection
app.use(helmet()); //USE to secure inspect //TODO LATER
app.use(morgan("combined"));

// APIs
app.use("/auth", auth);
app.use("/api", test);
app.use("/api", order);
app.use("/api", plant);
app.use("/api", category);
app.use("/api", customer);
app.use("/api", subCategory);

// URIs
app.get("/", (req, res) => {
  res.send("Welcome Programmer");
});
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start
const PORT = process.env.PORT || 3001;
async function startServer() {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
  });
}
startServer();
