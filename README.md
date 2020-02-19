# ejs-passport
Create an app called 'ejs-passport' where the user logs in and has the option to see either the tmdb api results or the randomusers.me results.
Use express generator to start the project!

PAGES
There can be a landing page or default page can be either register or login
Login
Register
Options:
* Movies - pages you already created
* Random - pages you already created
Options, Moves and Random pages should read: Logged in as: <username> in header after title. (see VIDEO below)

ROUTES
/api/users/register
/api/users/login
/auth/options
/auth/movies
/auth/random

REMEMBER THESE THINGS:
Movies and Random pages should have links to Home, Options and Logout
Movies, Random, Options pages should ONLY BE available if user is logged in
Passport for login
Flash message for incorrect credentials or input fields not being filled out.
Validate register input using express-validator
Flash input errors using req.flash
Use sessions & cookies
*** Use MVC
Design is up to you. Bootstrap, Themed, your own

*** CREATE A NEW REPO *** UPLOAD TO GITHUB ***