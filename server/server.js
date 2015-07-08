var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    eventsHandler = require("./eventsHandler"),
    Firebase = require("firebase"),
    FirebaseTokenGenerator = require("firebase-token-generator"),
    config = require('./config.json');

// Set middleware for body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/github-event', function(req, res) {

  var info = eventsHandler.getEventInfo(req);
  if (info) {
    var ref = new Firebase(config["firebase-root-reference"]);

    var tokenGenerator = new FirebaseTokenGenerator(config["firebase-secret"]);
    var token = tokenGenerator.createToken({ uid: "custom:1" });

    ref.authWithCustomToken(token, function(error, authData) {
      if (error) {
        res.json({ message: "Login Failed!", error: error });
      } else {
        ref.push(info);
        res.json({ message: "Thanks!" });
      }
    });
  } else
    res.json({ message: "Event not suppported" });
});

app.listen(process.env.PORT || 12345);