const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  reactionId: mongoose.Schema.Types.ObjectId,
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: function (value) {
      const formattedDate = formatTimeStamp(value);
      console.log('Formatted Date:', formattedDate);
      return formattedDate;
    },
  },
});

const thoughtSchema = new mongoose.Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: function (value) {
      return formatTimeStamp(value);
    },
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  reactions: [reactionSchema],
}, {
  toJSON: {
    getters: true
  },
  _id: false,
});

thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = mongoose.model('Thought', thoughtSchema);
module.exports = Thought;
