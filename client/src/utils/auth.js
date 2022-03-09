//const jwt = require("jsonwebtoken");

// const secret = "mysecretsshhhhh";
// const expiration = "2h";

// module.exports = {
//   signToken: function ({ username, email, _id }) {
//     const payload = { username, email, _id };

//     return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
//   },

//   authMiddleware: function ({ req }) {
//     //allows token to be sent via req.body, req.query, or headers

//     let token = req.body.token || req.query.token || req.headers.authorization;
//     // let token = req.query.token || req.headers.authorization;
//     console.log("TOKEN", token);
//     //separate "Bearer" and "<tokenvalue>"
//     if (req.headers.authorization) {
//       token = token.split(" ").pop().trim();
//     }

//     //if no token, return request original object
//     if (!token) {
//       return req;
//     }

//     try {
//       //decode data
//       //attach decoded data to user object
//       const { data } = jwt.verify(token, secret, { maxAge: expiration });
//       console.log("DATA", data);
//       req.user = data;
//     } catch {  console.log("Invalid token");
//     }
//     //return updated request object
//     return req;
//   },
// };
// use this to decode a token and get the user's information out of it
import decode from 'jwt-decode';

// make a new class to instantiate a user
class AuthService {
  // get that user's data
  getProfile() {
    return decode(
      this.getToken());
  }

  // check if that user's logged in
  loggedIn() {
    // Checks if there is a saved token and verifies the token is still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); 
  }

  // check if token is still valid
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } 
      else return false;
    } 
    catch (err) {
      return false;
    }
  }

  getToken() {
    //gets user token from localStorage
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    // S aves user token to localStorage
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // this will reload the page and reset the state of the application
    window.location.assign('/');
  }
}

export default new AuthService();
