require("dotenv").config({ path: "./secret.env" });

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const customerRepository = require("./../repositories/customer.repository"); // Update this to your MySQL repository file

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const customer = await customerRepository.findCustomerById(id); // Get customer by ID from MySQL
    done(null, customer);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/callback",
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingCustomer =
          await customerRepository.findCustomerByGoogleId(profile.id);

        if (existingCustomer) {
          await customerRepository.updateCustomer(existingCustomer.id, {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            thumbnail: profile.photos[0].value,
            googleId: profile.id,
          });
          return done(null, existingCustomer);
        } else {
          const newCustomerId = await customerRepository.createCustomer({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            thumbnail: profile.photos[0].value,
            googleId: profile.id,
          });

          const newCustomer = await customerRepository.findCustomerById(
            newCustomerId
          );
          return done(null, newCustomer);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
