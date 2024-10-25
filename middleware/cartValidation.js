function validateCart(req, res, next) {
  const validate = true; // TODO
  if (validate) {
    next();
  }
}

module.exports = {
  validateCart,
};
