const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator')

const JWT_SECRET = 'vedparkash@sharma#boy'

//Route 1 : Create a user using : Post "/api/auth/createuser". No login required

router.post('/createuser', [
   body('name', "enter a valid name").isLength({ min: 3 }),
   body('email', "enter a valid email").isEmail(),
   body('password', "password must atleast 8 characters").isLength({ min: 8 })
], async (req, res) => {
   // If there are errors return bad request and the errors
   const errors = validationResult(req);
   let success=false;
   if (!errors.isEmpty()) {
      return res.status(400).json({success,  errors: errors.array() });
   }
   try {
      // check whether the user with same email exist already

      let user = await User.findOne({ email: req.body.email });
      if (user) {
         return res.status(400).json({ success, error: "sorry a email allready exists" })

      }
      
      const salt = await bcrypt.genSalt(10);

      secpass = await bcrypt.hash(req.body.password, salt)
      // Create a new user
      user = await User.create({
         name: req.body.name,
         password: secpass,
         email: req.body.email,
      });

      const data = {
         user: {
            id: user.id
         }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      //   res.json(user)
      success = true;
      res.json({ success, authtoken })


   } catch (error) {
      console.error(error.message)
      res.status(500).send("Internal server error ocured")
   }


})


//Route 2 : Authenticate a user using : Post "/api/auth/login". No login required
router.post('/login', [

   body('email', "enter a valid email").isEmail(),
   body('password', "password cannot be blank").exists(),
], async (req, res) => {
   // If there are errors return bad request and the errors
   const errors = validationResult(req);
   let success = false;
   if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
   }

   const { email, password } = req.body;
   try {
      let user = await User.findOne({ email });
      if (!user) {
         return res.status(400).json({ success, error: "please try to login with correct credentials" })
      }

      const passwordcompare = await bcrypt.compare(password, user.password)

      if (!passwordcompare) {
         return res.status(400).json({success,  error: "please try to login with correct credentials" })
      }

      const payload = {
         user: {
            id: user.id
         }
      }
      const authtoken = jwt.sign(payload, JWT_SECRET);
      success= true;
      res.json({ success, authtoken });



   } catch (error) {
      console.error(error.message)
      res.status(500).send(" Internal server error occured")
   }


})


// Route 3 : logged in User Details using : Post "/api/auth/getuser". Login required 

router.post('/getuser',fetchuser, async (req, res) => {
   try {
      let userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user)
   } catch (error) {
      console.error(error.message)
      res.status(500).send("Internal Server Error")
   }

})









module.exports = router  