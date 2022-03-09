const jwt = require("jsonwebtoken");

const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  authMiddleware: function ({ req }) {
    //allows token to be sent via req.body, req.query, or headers

    let token = req.body.token || req.query.token || req.headers.authorization;
    // let token = req.query.token || req.headers.authorization;
    console.log("TOKEN", token);
    //separate "Bearer" and "<tokenvalue>"
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    //if no token, return request original object
    if (!token) {
      return req;
    }

    try {
      //decode data
      //attach decoded data to user object
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      console.log("DATA", data);
      req.user = data;
    } catch {  console.log("Invalid token");
    }

    //return updated request object
    return req;
  },
};