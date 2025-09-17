
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const admin = 0;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, admin });
        res.status(201).json({ id: user.id, name: user.name, email: user.email, token: generateToken(user.id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

class User1 {
    cosntructor(){

    }
    toString() {
        console.log("User permissions granted.");
    }
}

class Admin {
    constructor(){

    }
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
             if (user.admin === '0') {
                    var loggedAdmin = new Admin();
                    loggedAdmin.toString();
                }
                if (user.admin === '1') {
                    var loggedUser = new User1();
                    loggedUser.toString();
                }
            res.json({ id: user.id, name: user.name, email: user.email, token: generateToken(user.id), admin: user.admin });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
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

const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        name: user.name,
        email: user.email,
        city: user.city,
        address: user.address,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, city, address } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.city = city || user.city;
        user.address = address || user.address;

        const updatedUser = await user.save();
        res.json({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, city: updatedUser.city, address: updatedUser.address, token: generateToken(updatedUser.id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, LoginFactory, updateUserProfile, getProfile };
