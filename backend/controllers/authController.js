const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};


// Factory design pattern for user registration
class UserFactory {
  static createUser({ name, email, password, admin }) {
    if (admin) {
      return new Admin(name, email, password, admin);
    } else {
      return new User1(name, email, password, admin);
    }
  }
}

class User1 {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.admin = false;
  }
}

class Admin {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.admin = true;
  }
}

const registerUser = async (req, res) => {
  const { name, email, password, admin } = req.body;
  try {
    let admin = false;
    const userExists = await User.findOne({ email });
    if (name === "admin" && email === "admin@gmail.com") {
      admin = true;
    }
    if (userExists)
      return res.status(400).json({ message: "User already exists" });
    
    console.log("before create:");

    const userObj = UserFactory.createUser({ name, email, password, admin });
    console.log("after create:", userObj);
    const user = await User.create(userObj);
    console.log("Registered user:", user);
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


class LoginFactory {
  static async getUser(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user && (await bcrypt.compare(password, user.password))) {
        if (user.admin === true) {
          var loggedAdmin = new Admin();
          loggedAdmin.toString();
        }
        if (user.admin === false) {
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

class UserProfile {
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
const userProfile = new UserProfile(User, userProfileSubject);



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
// for admin to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) return res.status(404).json({ message: "no users" });
    return res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  LoginFactory,
  userProfile,
  getAllUsers,
};
