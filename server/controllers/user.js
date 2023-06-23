const bcrypt = require('bcrypt');
const User = require('./../models/user');

// const create = async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email: email });
//   if (user)
//     return res
//       .status(409)
//       .send({ error: '409', message: 'User already exists' });
//   try {
//     if (password === '') throw new Error();
//     const hash = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       ...req.body,
//       password: hash,
//     });
//     const user = await newUser.save();
//     req.session.uid = user._id;
//     res.status(201).send(user);
//   } catch (error) {
//     res.status(400).send({ error, message: 'Could not create user' });
//   }
// };

const create = async (req, res) => {
try {
  const user = await User.create(req.body);
  console.log('User created', user);
  res.status(201).json(user);
} catch (err) {
  res.status(403).json(err.message);
}
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: email });
    res.status(200).send(user);
  } catch (error) {
    res
      .status(401)
      .send({ error: '401', message: 'Username or password is incorrect' });
  }
};

const profile = async (req, res) => {
  try {
    const { _id, name, email, image, sources } = req.user;
    const user = { _id, name, email, image, sources };
    res.status(200).send(user);
  } catch (error) {
    res.status(404).send({ error, message: 'User not found' });
  }
};

const getUser = async (req, res) => {
  try {
    const email = req.params.email;
    const existingUser = await User.find({ email: email });
    if (!existingUser) {
      throw new Error('User not found');
    }
    res.status(200).json(existingUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getUserInfo = async (req, res) => {
  try {
    const email = req.params.id;
    const existingUser = await User.find({ _id: id });
    if (!existingUser) {
      throw new Error('User not found');
    }
    res.status(200).json(existingUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const editUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.deleteOne({ _id: id });
    res.status(200).json(`User with id:${id} was successfully deleted.`);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getSources = async (req, res) => {
  try {
    const _id = req.params.source;
    const user = await User.findOne({ _id: _id });
    res.status(200).send(user);
  } catch {
    res.status(404).json({ error: err.message, message: 'User not found' });
  }
};

const getSourceName = async (req, res) => {
  try {
    const _id = req.params.source;
    const user = await User.findOne({ _id: _id });
    res.status(200).send(user);
  } catch {
    res.status(404).json({ error: err.message, message: 'User not found' });
  }
};

// const logout = (req, res) => {
//   req.session.destroy((error) => {
//     if (error) {
//       res
//         .status(500)
//         .send({ error, message: 'Could not log out, please try again' });
//     } else {
//       res.clearCookie('sid');
//       res.status(200).send({ message: 'Logout successful' });
//     }
//   });
// };

module.exports = { create, login, getUser, getUserInfo, editUser, deleteUser, profile, getSources, getSourceName };
