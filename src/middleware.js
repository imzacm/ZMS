module.exports = [
  (req, res, next) => {
    res.vars = {}
    next(req, res)
  }
]