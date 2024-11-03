require("dotenv").config({ path: "./secret.env" });

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const customerRepository = require("./../repositories/customer.repository");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const customer = await customerRepository.findCustomerById(id);
    done(null, customer);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: process.env.CALLBACKURL,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingCustomer = await customerRepository.findCustomerByGoogleId(profile.id);
        
        if (existingCustomer) {
          await customerRepository.updateCustomer(existingCustomer.id, {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            thumbnail: profile.photos[0].value,
            googleId: profile.id,
            is_admin: existingCustomer.is_admin
          });
          return done(null, existingCustomer);
        } else {
          const newCustomerId = await customerRepository.createCustomer({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            thumbnail: profile.photos[0].value,
            googleId: profile.id,
            is_admin: 0
          });

          const newCustomer = await customerRepository.findCustomerById(newCustomerId);
          return done(null, newCustomer);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
