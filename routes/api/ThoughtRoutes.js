const express = require('express');
const router = express.Router();
const { Thought } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    console.error('Error retrieving thoughts:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with that ID' });
    }
    res.json(thought);
  } catch (err) {
    console.error('Error retrieving thought by ID:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newThought = await Thought.create(req.body);
    res.status(201).json(newThought);
  } catch (err) {
    console.error('Error creating thought:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedThought);
  } catch (err) {
    console.error('Error updating thought by ID:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params.id);
    if (!deletedThought) {
      return res.status(404).json({ message: 'No thought found with that ID' });
    }
    res.json(deletedThought);
  } catch (err) {
    console.error('Error deleting thought by ID:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const { reactionId, reactionBody, username } = req.body;

    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $push: {
          reactions: {
            reactionId,
            reactionBody,
            username,
          },
        },
      },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: 'No thought found with that ID' });
    }

    res.json({ message: 'Reaction added successfully' });
  } catch (err) {
    console.error('Error adding reaction to thought:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const { thoughtId, reactionId } = req.params;

    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $pull: {
          reactions: {
            _id: reactionId,
          },
        },
      },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: 'No thought found with that ID' });
    }

    res.json({ message: 'Reaction deleted successfully' });
  } catch (err) {
    console.error('Error deleting reaction from thought:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

module.exports = router;
