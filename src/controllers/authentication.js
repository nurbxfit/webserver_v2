const Joi = require("joi");
const mongoose = require("mongoose");
const { validateUser } = require("../models/user");
const secret = require("../configs/secret");
const jwt = require("jsonwebtoken");
const Mailer = require("../services/mailer");

exports.register = (req, res, next) => {
  const { email, username, password, confirmpswd } = req.body;
  if (password === confirmpswd) {
    const { error, value } = validateUser({
      email,
      username,
      password,
    });

    if (error) return next(error);
    const User = mongoose.model("user");
    //check if email  and username already in used
    User.exists({ $or: [{ email: email }, { username: username }] })
      .then((user) => {
        //check if User exist.
        if (user)
          return res.status(200).send("username or email already taken");

        //else create new user
        const newUser = new User(value);
        newUser.unhashpassword = password;
        return newUser.save();
      })
      .then(async (newuser) => {
        //add new user to role.
        const Role = mongoose.model("role");
        const role = await Role.findOne({ layer: 100 });
        role.users.push(newuser._id);
        await role.save();
        return newuser;
      })
      .then((user) => {
        // user added/ then we send email to comfirm their account
        // generate token
        const mail = new Mailer("gmail");
        const token = user.generateToken(secret["verifyToken"], "2d");
        const url =
          req.protocol +
          "://" +
          req.get("host") +
          "/auth/verify/email?token=" +
          token;
        mail.sendMail(
          {
            from: "server",
            to: user.email,
            subject: "email comfirmation",
            html: `
                <div>
                    <h3> Account registered </h3>
                    <p> use this link to verify your email </p>
                    <p>link: ${url} </p>
                    or click button below.
                    <button onclick="window.location.href='${url}';">verify</button>
                </div>
                `,
          },
          function (error, info) {
            if (error)
              return res.send(
                "There is problem, sending verification link to your email, please re-verify again"
              );
            res
              .status(201)
              .send(
                "User registered, please confirm your email and update your profile"
              );
          }
        );
      })
      .catch((error) => {
        return next(error);
      });
  }
};

/*
    Login.
    INPUT: {
        "email" : "",
        "password" : "",
    }
    output: {
        "accessToken" : "",
        "refreshToken": "",
    }
*/

exports.login = (req, res, next) => {
  const loginSchema = Joi.object({
    email: Joi.string().min(5).max(50).required().email(),
    // username: Joi.string().alphanum().min(2).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
  });

  const { error, value } = loginSchema.validate(req.body);
  if (error) return next(error);
  const { email, password } = value;
  const User = mongoose.model("user");
  User.findOne({ email: email })
    .then(async (user) => {
      if (user) {
        let correct = await user.comparePassword(password);
        if (correct) {
          const refreshToken = user.generateToken(secret["jwtSecret"], "2d");
          const accessToken = user.generateToken(secret["jwtSecret"], "1h");
          user.refreshToken = refreshToken;
          user.save();
          const cookieTokenOptions = {
            httpOnly: true,
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
          };
          res.cookie("refreshToken", token.refreshToken, cookieTokenOptions);
          return res.status(200).send({ token: accessToken });
        }
      }
      res.status(400).send("Invalid Username or Password");
    })
    .catch((error) => {
      res.status(500);
      return next(error);
    });
};

/*
    logout/revokeToken:
    we remove refreshToken from database. so that refreshToken no longer valid to be use.
    Only loggedin user can logout??, 
    so we simply take user from our req object and remove the token.
*/
exports.logout = (req, res, next) => {
  const { user } = req;
  const User = mongoose.model("user");
  User.findById(user._id)
    .then((activeUser) => {
      activeUser.refreshToken = undefined;
      return activeUser.save();
    })
    .then((revoke) => {
      req.session = null;
      req.logout();
      res.status(200).send("You're logged out...");
    })
    .catch((error) => {
      res.status(500);
      return next(error);
    });
};

/*
using cookieParser to use req.cookies
use when access token is expired, and need to quickly get new token without having to relogin.
INPUT: `just send the refreshtoken as httpOnly cookie`, and backend will verify it.
OUTPUT: new access token.
*/
exports.refreshToken = (req, res, next) => {
  const token = req.cookies.refreshToken;
  jwt.verify(token, secret["jwtSecret"], function (error, decoded) {
    if (error) throw new Error("Invald refreshToken");
    const User = mongoose.model("user");
    User.findOne({
      _id: decoded._id,
      refreshToken: token,
    })
      .then((user) => {
        if (!user) throw new Error("Invalid Token");
        const newAccessToken = jwt.sign(
          {
            _id: user._id.toString(),
            email: user.email,
            name: user.username,
          },
          secret["jwtSecret"],
          { expiresIn: "1h" }
        );
        return res.status(200).send({
          token: newAccessToken,
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).send("Invalid refreshToken issued, please re-login!");
      });
  });
  // return res.send({refreshToken:token});
};

/*
# verifyAccount
- after user register, a link contain token will be sent to their email to verify their emaill address, 
- the link will go to frontend, and frontend should extract the token in that link and sent it back here to get verify..
- this controller get that token, verify it, 
- find the user and then update user.verified = true;
*/
exports.verifyAccount = (req, res, next) => {
  const { token } = req.query;
  const User = mongoose.model("user");
  console.log("Token:", token);
  if (token) {
    jwt.verify(token, secret["verifyToken"], function (error, decoded) {
      if (error) return next(error);
      User.findOneAndUpdate(
        {
          email: decoded.email,
          username: decoded.name,
        },
        { verified: true }
      )
        .then((user) => {
          res.status(202).send("email verified");
        })
        .catch((error) => {
          return next(error);
        });
    });
  }
  return res.status(400).send("Invalid Token");
};

/*
# get ResetToken
(for reset password)
    method: POST
    INPUT: email address,
    OUTPUT: send email, contain links with token.
    - get email address, find user check if exist or not.
    - generate token and add to user.resetToken. (using jwt)
    - send email with url token.
    - url is the url of frontend.
    - frontend will extract the url, and use it in request body to verify the token.
*/
exports.getResetToken = (req, res, next) => {
  const { email } = req.body;
  const User = mongoose.model("user");
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.status(404);
        throw new Error("Unknown credentials");
      }
      const token = user.generateToken(secret["resetToken"], "30m");
      user.resetToken = token;
      user.save();
      const mail = new Mailer("gmail");
      const url =
        req.protocol +
        "://" +
        req.get("host") +
        "/auth/reset/verify?token=" +
        token;
      mail.sendMail(
        {
          from: "server",
          to: user.email,
          subject: "reset password token",
          html: `
            <div>
                <h3> Account registered </h3>
                <p> use this link to verify your email </p>
                <p>link: ${url} </p>
                or click button below.
                <button onclick="window.location.href='${url}';">verify</button>
            </div>
            `,
        },
        function (error, result) {
          if (error)
            return res
              .status(500)
              .send(
                "There is a problem, sending reset link to your email, please reset again"
              );
          res
            .status(202)
            .send(
              "reset link sent to your email, please use it before expired"
            );
        }
      );
    })
    .catch((error) => {
      if (!res.statusCode) {
        res.status(500);
      }
      next(error);
    });
};
/*
#verifyResetToken
    method: POST
    INPUT: {
        "resetToken" : "somerandomlongstrings"
    }   
    OUTPUT: verified.
    - get token from request.body sent by frontend,
    - verify the token to be same as in database and not expired.
    - send comfirmation.
    - frontend will know that token is valid and redirect user to reset password page.
    - if token not valid, frontend will do something about it.
 */
exports.verifyResetToken = (req, res, next) => {
  const { token } = req.query;
  jwt.verify(token, secret["resetToken"], function (error, decoded) {
    if (error) return next(error);
    const User = mongoose.model("user");
    User.findById(decoded._id)
      .then((user) => {
        if (user && token === user.resetToken) {
          res.send(200).send({
            message: "Valid Token",
            user_id: decoded._id,
            resetToken: token,
          });
        }
        res.status(400).send({
          message: "Invalid Token",
        });
      })
      .catch((error) => {
        next(error);
      });
  });
};

/*
#resetPassword
    method: POST
    INPUT: {
        "newPassword" : "something",
        "resetToken"  : "comfirmed/valid resetToken",
    }
    OUTPUT: password reset successfully.
    - receive newpassword and verified resetToken from frontend.
    - verify token again (just to be sure).
    - if valid, update the password, and set resetToken = null.

*/
exports.resetPassword = (req, res, next) => {
  const { user_id } = req.params;
  //   const { newPassword, resetToken } = req.body;
  const Schema = Joi.object({
    newPassword: Joi.string().min(5).max(255).required(),
    resetToken: Joi.string().regex(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
    ),
  });
  const { error, value } = Schema.validate(req.body);
  if (error) return next(error);

  console.log("user_id:", user_id);
  const User = mongoose.model("user");
  User.findById(user_id)
    .then((user) => {
      if (user.resetToken === value.resetToken) {
        user.unhashpassword = value.newPassword;
        user.password = value.newPassword;
        return user.save();
      }
      res.status(400).send({
        messsage: "Invalid token",
      });
    })
    .then((updated) => {
      return res.status(204);
    })
    .catch((error) => {
      return next(error);
    });
};
