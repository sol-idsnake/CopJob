module.exports = function(app, passport) {

  // to include a login option, pass 'isLoggedIn' as arg
  app.get("/index", (req, res) => {
    res.sendFile("/index.html", { root: "views" });
  });

  // to include a login option, pass 'isLoggedIn' as arg
  app.get("/portal", (req, res) => {
    res.sendFile("/portal.html", { root: "views" });
  });

  // show the login form
  app.get("/login", function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render("login.ejs", {
      root: "views",
      message: req.flash("loginMessage")
    });
  });

  // process the login form
  app.post("/login",
    passport.authenticate("local-login", {
      successRedirect: "/index", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  // show the signup form
  app.get("/signup", function(req, res) {
    // render the page and pass in any flash data if it exists
    res.sendFile("signup.html", {
      root: "views",
      message: req.flash("signupMessage")
    });
  });

  // process the signup form
  app.post("/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/login",
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  // we will use route middleware to verify this (the isLoggedIn function)
  // to include a login option, pass 'isLoggedIn' as arg
  app.get("/profile", function(req, res) {
    res.render("profile.ejs", {
      user: req.user // get the user out of session and pass to template
    });
  });

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they aren't redirect them to the home page
  res.redirect("/login");
}
