/*
 * Name: Salvi Patel
 * Course Code - INFT 2202-02
 * In Class-4 : Mongoose and MongoDB Atlas
 * Date: April 17, 2024
*/

/**
 * Importing the Express Package
 */
import express from 'express';
/**
 * Creating the instance of the Router Class
 */
const router = express.Router();
/**
 * Importing the Mongoose model from the "Contact.ts"
 */
import Contact from '../models/contact'
import User from '../models/user'

// import passport
import passport from "passport";

// import AuthGuard, UserDsiplayName from util folder
import {AuthGuard, UserDisplayName} from "../util";

/**
 * TOP-LEVEL Routes: -
 */
router.get('/', function(req, res, next)
{
  res.render('index', { title: 'Home', page : 'home', displayName : UserDisplayName(req) });
});
/**
 * Defining the route for "/home"
 */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home', page : 'home', displayName : UserDisplayName(req)  });
});

/**
 Defining the route for "/about"
 */
router.get('/about', function(req, res, next) {
  res.render('index', { title: 'About Us', page : 'about', displayName : UserDisplayName(req)  });
});
/**
 Defining the route for "/products" URL
 */
router.get('/products', function(req, res, next) {
  res.render('index', { title: 'Products', page : 'products', displayName : UserDisplayName(req)  });
});
/**
 Defining the route for "/services" URL
 */
router.get('/services', function(req, res, next) {
  res.render('index', { title: 'Service', page : 'services', displayName : UserDisplayName(req)  });
});
/**
 Defining the route for "/contact" URL
 */
router.get('/contact', function(req, res, next) {
  res.render('index', { title: 'Contact Us', page : 'contact', displayName : UserDisplayName(req)  });
});

/**
 *AUTHENTICATION ROUTES
 */

router.get('/login', function(req, res, next)
{
  if(!req.isAuthenticated())
  {
     res.render('index', { title: 'Login', page : 'login', messages: req.flash('loginMessage'), displayName : UserDisplayName(req)  });
  }
  return res.redirect('/contact-list');
});


router.post("/login", function(req, res, next)
{
  /**
   * Using the Passport to authenticate the user!
   */
  passport.authenticate('local', function (err:Error, user:Express.User, info:String)
  {
    if(err) // if there is any error then response will be ended
    {
      console.error(err); // Logged the error into the console
      res.end(); // Ending  the response.
    }

    if(!user) // If the user does not exist then a Message will be set by "Flash"
    {
     req.flash('loginMessage', "Authentication Error");
    }

    /**
     * If no errors found then initiate the session for the user
     */
    req.logIn(user, function(err)
    {
      if(err)
      {
        console.error(err); // logged the errors into the console.
        res.end();
      }
      return res.redirect("/contact-list"); // Redirecting the user to contact-list page
    })
  })(req,res,next);
})


router.get('/register', function(req, res, next)
{
  if(!req.user)
  {
    res.render('index', { title: 'Register', page : 'register', messages: req.flash('loginMessage'),  displayName : UserDisplayName(req)  });
  }
  return res.redirect('/contact-list'); // Redirecting the user.
});


router.post('/register', function (req, res, next)
{
  /**
   * Creating the user Model using the data associated or sent with the Request Object
   */
  let newUser = new User({
    username : req.body.username,
    EmailAddress: req.body.emailAddress,
    DisplayName : req.body.firstName + " " + req.body.lastName,
  });

  /**
   * Creating a new user in the MongoDB as well as hashing the user enetred password.
   */
  User.register(newUser, req.body.password, function(err:any)
  {
    if(err) // if there is any error while creating the new user
    {
      if(err.name === "UserExistsError")
      {
        console.error("Error User Already Exists"); // Logged the message into the console.
        req.flash("registerMessage", "Registration Error")
      }
      req.flash("registerMessage","Server Error")
      res.redirect("/register") // Redirect the user to "register page"
    }

    return passport.authenticate('local')(req,res,function() // All these are arguments for the returned middleware function.
    {
      return res.redirect("/contact-list"); // Redirection.
    })
  })
})


router.get("/logout", function(req, res, next)
{
  req.logOut(function(err)
  {
    if(err)
    {
      console.error(err);
      res.end();
    }
    res.redirect("/login");
  });

})


/**
 * CONTACT ROUTES
 */

router.get('/add', AuthGuard, function(req, res, next)
{
  res.render('index', { title: 'Add Contact', page : 'edit', contact : '', displayName : UserDisplayName(req) });
});

router.get('/contact-list',AuthGuard, function(req, res, next)
{

  Contact.find().then( function (data: any)
  {

    res.render('index', { title: 'Contact List', page : 'contact-list',
      contacts: data,displayName : UserDisplayName(req)}); // Passing the retrieved documents from the collection to ejs for displaying purpose


  }).catch(function(err : any) // Catches the error if any occur.
  {
    console.error("Encountered an Error reading from the database " + err);
    res.end(); // end the response.
  })
});
/**
 * Defining the route for URL
 */
router.get('/edit/:id',AuthGuard, function(req, res, next)
{
  /**
   * Retrieving the parameter from the URL using the request Object.
   */
  let id = req.params.id;
  Contact.findById(id).then(function (contactToEdit: any)
  {

    res.render('index', { title: 'Edit Contact', page : 'edit',
      contact: contactToEdit, displayName : '' });

  }).catch(function(err: any) // Catches the error's if any occur.
  {
    console.error(err); // Log the error into the console.
    res.end(); // end the response.
  });

});


router.get('/delete/:id', AuthGuard,function(req, res, next)
{
  /**
   * Retrieving the parameter from the requested URL
   */
  let id = req.params.id;

  Contact.deleteOne({_id : id}).then(function ()
  {

    res.redirect('/contact-list')
  }).catch(function(err: any) // Catches Error if any.
  {
    console.error(err);
    res.end();
  });

});

router.post('/edit/:id',AuthGuard, function(req, res, next)
{

  /**
   * Retrieving the parameter from the Requested URL
   */
  let id = req.params.id;

  /**
   * Creating the Model Object.
   */
  let updatedContact = new Contact(
 {
        "_id" : id, // Id will remain same.
        "FullName": req.body.fullName,
        "ContactNumber": req.body.contactNumber,
        "EmailAddress": req.body.emailAddress
      }
  );


  Contact.updateOne( {_id: id}, updatedContact).then(function()
  {
    /**
     * Redirect the user to "Contact-list" on successful data
     */
    res.redirect('/contact-list');
  }).catch(function(err: any) // Catches Error if there is any.
  {
    console.error(err);
    res.end();
  });

});

router.post('/add/', AuthGuard,function(req, res, next)
{

   let newContact:any = new Contact(
      {
        // Populating the documents fields with the data.
        "FullName": req.body.fullName,
        "ContactNumber": req.body.contactNumber,
        "EmailAddress": req.body.emailAddress
      }
  );


  Contact.create(newContact).then(function()
  {

    res.redirect('/contact-list');
  }).catch(function(err: any) {
    console.error(err);
    res.end();
  });

})

export default router;
