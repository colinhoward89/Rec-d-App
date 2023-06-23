const bcrypt = require('bcrypt');
const User = require('./../models/user');

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

const newSource = async (req, res) => {
  try {
    const { userId, newSource } = req.body;
    const source = await User.create(newSource);
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { sources: source._id } },
      { new: true }
    );
    res.status(200).json({ user, source });
  } catch (err) {
    res.status(404).json({ error: err.message, message: 'User not found' });
  }
};

const inviteFriend = async (req, res) => {
  try {
    const { userId, newFriend } = req.body;
    const recipient = await User.findOneAndUpdate(
      { email: newFriend },
      { $push: { requestRec: userId } },
      { new: true }
    );
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { requestSent: recipient._id } },
      { new: true }
    );
    res.status(200).json({ user, recipient });
  } catch (err) {
    res.status(404).json({ error: err.message, message: 'User not found' });
  }
};

const friendRequests = async (req, res) => {
  try {
    console.log("query ", req.query)
    const userId = req.query.userId;
    console.log("userId ", userId)
    const userRequests = await User.findById(userId);
    console.log(userRequests);
    const { requestRec, requestSent } = userRequests;
    res.status(200).json({ requestRec, requestSent });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: err.message, message: 'User not found' });
  }
};

module.exports = { create, login, getUser, getUserInfo, editUser, deleteUser, profile, getSources, getSourceName, newSource, inviteFriend, friendRequests };

