const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  movieId: { type: String, required: true, unique: true },
  title: { type: String, default:null },
  poster_path: { type: String, default: null},
  media_type:{type:String},
  ratings: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  voters: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      voteType: { type: String, enum: ['upvote', 'downvote'], required: true },
    },
  ],
  videos: {
    hd: { type: String }, // URL for HD quality video
    auto: { type: String }, // URL for Auto quality video
  },
  introSkipTime: { type: Number, default: 0 }, // Time to skip intro (in seconds)
});

module.exports = mongoose.model('Movie', movieSchema);
