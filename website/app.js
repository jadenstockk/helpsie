module.exports = () => {
  const http = require("http");
  const settings = require("./settings.json");
  const express = require("express");
  const app = express();
  const path = require('path');
  const server = http.createServer(app);
  const port = process.env.PORT || 8000;
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, 'public')));


  app.get("/", (req, res) => {
    res.render('index', {
      bot: settings.website
    })
  })

  app.get("/commands", (req, res) => {
    res.render("commands", {
      bot: settings.website,
      commands: settings.commands
    })
  })

  app.get("/login", (req, res) => {
    res.render("login", {
      bot: settings.website
    })
  })

  app.get('*', (req, res) => {
    res.status(404).render('404', {
      bot: settings.website
    });
  });

  const listener = server.listen(port, function () {
    console.log("Your app is listening on port " + listener.address().port);
  })
}