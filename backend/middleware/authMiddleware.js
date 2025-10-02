const jwt = require("jsonwebtoken");
const User = require("../models/User");

// const protect = async (req, res, next) => {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             token = req.headers.authorization.split(' ')[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await User.findById(decoded.id).select('-password');
//             next();
//         } catch (error) {
//             res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     }

//     if (!token) {
//         res.status(401).json({ message: 'Not authorized, no token' });
//     }
// };

// module.exports = { protect };

// This is the parent middleware class
class Middleware {
  constructor(middleware = null) {
    this.middleware = middleware;
  }

  protect(request) {
    if (this.middleware) {
      this.middleware.process(request);
    }
  }
}

// This is the child middleware class
class AuthMiddleware extends Middleware {
  async protect(req, res, next) {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
      } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
      }
    }

    if (!token) {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  }

  async admin(req, res, next) {
    if (req.user && req.user.admin) {
      next();
    } else {
      return res.status(403).json({ message: "Not authorized. Admin only." });
    }
  }
}

const authMiddleware = new AuthMiddleware(process.env.JWT_SECRET);

module.exports = authMiddleware;
