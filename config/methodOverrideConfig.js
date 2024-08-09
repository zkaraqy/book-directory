const methodOverride = require("method-override");
const methodOverrideConfig = methodOverride(function (req, res) {
  if (req.body && typeof req.body === "object" && "_method" in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    console.log(method, req.body._method);
    delete req.body._method;
    return method;
  }
});

module.exports = methodOverrideConfig;
