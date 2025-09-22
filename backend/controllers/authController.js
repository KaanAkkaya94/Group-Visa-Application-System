const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
// singleton
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const admin = 0;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, admin });
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

class User1 {
  cosntructor() {}
  toString() {
    console.log("User permissions granted.");
  }
}

class Admin {
  constructor() {}
  toString() {
    console.log("Admin permissions granted.");
  }
}

class LoginFactory {
  static async getUser(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user && (await bcrypt.compare(password, user.password))) {
        if (user.admin === "0") {
          var loggedAdmin = new Admin();
          loggedAdmin.toString();
        }
        if (user.admin === "1") {
          var loggedUser = new User1();
          loggedUser.toString();
        }
        res.json({
          id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user.id),
          admin: user.admin,
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    return null;
  }
}

// const loginUser = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (user && (await bcrypt.compare(password, user.password))) {
//             res.json({ id: user.id, name: user.name, email: user.email, token: generateToken(user.id), admin: user.admin });
//         } else {
//             res.status(401).json({ message: 'Invalid email or password' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// name: { type: String, required: true },
// email: { type: String, required: true, unique: true },
// password: { type: String, required: true },
// city: { type: String },
// address: { type: String },
// admin: { type: Boolean, default: false }
// observer
class UserProfileSubject {
  constructor() {
    this.subscribers = [];
  }
  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber) {
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }

  notifySubscribers(event, data) {
    this.subscribers.forEach((subscriber) => subscriber.update(event, data));
  }
}

class LoggerObserver {
  update(event, data) {
    console.log(`[Logger] Event: ${event}`, data);
  }
}

class AuditObserver {
  update(event, data) {
    console.log(`[Audit] User ${data.id} triggered ${event}`);
  }
}

class NotificationObserver {
  update(event, data) {
    if (event === "updateProfile") {
      console.log(`[Notification] Your profile was updated.`);
    } else if (event === "fetchProfile") {
      console.log(`[Notification] Your profile data returned successfully.`);
    }
  }
}

class UserProfileController {
  constructor(userModel, subject) {
    this.User = userModel;
    this.subject = subject;
  }

  async getProfile(req, res) {
    try {
      const user = await this.User.findById(req.user.id);
      console.log("user", user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      this.subject.notifySubscribers("fetchProfile", {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        admin: user.admin,
      });
      res.status(200).json({
        name: user.name,
        email: user.email,
        city: user.city,
        address: user.address,
        phone: user.phone,
        admin: user.admin,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async updateUserProfile(req, res) {
    try {
      const user = await this.User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { name, email, city, address, phone } = req.body;
      user.name = name || user.name;
      user.email = email || user.email;
      user.city = city || user.city;
      user.address = address || user.address;
      user.phone = phone || user.phone;

      const updatedUser = await user.save();
      this.subject.notifySubscribers("updateProfile", {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        phone: updatedUser.phone,
      });
      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        city: updatedUser.city,
        address: updatedUser.address,
        phone: updatedUser.phone,
        token: generateToken(updatedUser.id),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

const userProfileSubject = new UserProfileSubject();
userProfileSubject.subscribe(new LoggerObserver());
userProfileSubject.subscribe(new AuditObserver());
userProfileSubject.subscribe(new NotificationObserver());
const userProfileController = new UserProfileController(
  User,
  userProfileSubject
);
// const getProfile = async (req, res) => {
//     try {

//       const user = await User.findById(req.user.id);

//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       res.status(200).json({
//         name: user.name,
//         email: user.email,
//         city: user.city,
//         address: user.address,
//       });
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   };

// const updateUserProfile = async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id);
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         const { name, email, city, address } = req.body;
//         user.name = name || user.name;
//         user.email = email || user.email;
//         user.city = city || user.city;
//         user.address = address || user.address;

//         const updatedUser = await user.save();
//         res.json({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, city: updatedUser.city, address: updatedUser.address, token: generateToken(updatedUser.id) });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

module.exports = { registerUser, LoginFactory, userProfileController };
