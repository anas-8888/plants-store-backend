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
const subCategory = require("./routes/subcategory");
const favorite = require("./routes/favorite");
const homePhoto = require("./routes/homePhoto");
const ourAlbum = require("./routes/ourAlbum");
const locations = require("./routes/locations");
const reviews = require("./routes/reviews");
const message = require("./routes/message");
const contactMethods = require("./routes/contactMethods");
const aboutUs = require("./routes/aboutUs");

// Import middlewares
const languageMiddleware = require("./middleware/languageMiddleware");

// Init
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set trust proxy for secure cookies behind a proxy
app.set("trust proxy", 1);

// Cookies
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY || "fallbackSecret"],
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
	  domain: ".nabtaty.com",
  })
);
app.use(passport.initialize());
app.use(passport.session());

// CORS Configuration
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});
app.use("/api/", apiLimiter);
app.use("/auth", apiLimiter);

// Protection
app.use(helmet()); //USE to secure inspect //TODO LATER
app.use(morgan("combined"));

// Middleware
app.use(languageMiddleware);

// APIs
app.use("/auth", auth);
app.use("/api", test);
app.use("/api", order);
app.use("/api", plant);
app.use("/api", category);
app.use("/api", customer);
app.use("/api", favorite);
app.use("/api", homePhoto);
app.use("/api", ourAlbum);
app.use("/api", subCategory);
app.use("/api", locations);
app.use("/api", reviews);
app.use("/api", message);
app.use("/api", contactMethods);
app.use("/api", aboutUs);

// URIs
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
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
