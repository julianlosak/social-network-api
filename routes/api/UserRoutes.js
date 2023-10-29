const express = require('express');
const router = express.Router();
const { User } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error retrieving users:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'No user found with that ID' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error retrieving user by ID:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user by ID:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'No user found with that ID' });
    }
    res.json(deletedUser);
  } catch (err) {
    console.error('Error deleting user by ID:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.friends.push(friendId);

    await user.save();
    res.json({ message: 'Friend added successfully' });
  } catch (err) {
    console.error('Error adding friend:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.friends.pull(friendId);

    await user.save();
    res.json({ message: 'Friend removed successfully' });
  } catch (err) {
    console.error('Error removing friend:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

module.exports = router;
