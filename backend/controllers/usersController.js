const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const Movie = require('../models/Movie');


exports.register = async (req, res) => {
  try {
    const {name, email, password } = req.body;
    console.log("body",req.body)
    const user = new User({ name,email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const {userId} = req.user;
    const user = await User.findById(userId).select('-password'); // Exclude password field

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }


    res.status(200).json({
        name: user.name,
        email: user.email,
        preferences: user.preferences,
      
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    // Get userId from protected route (set by the middleware)
    const {userId} = req.user;

    // Get the data from the request body (e.g., updated name, email, etc.)
    const { name, preferences } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the fields if they are provided (assuming validation and hashing are handled)
    if (name) user.name = name;
    // if (password) user.password = password; // In real-world, you should hash the password before saving
    if( preferences) user.preferences= preferences;
    // Save the updated user data
    await user.save();

    // Respond with the updated user details
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences:user.preferences
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Add a movie to the watchlist
exports.addToWatchlist = async (req, res) => {
  try {
    const {userId} = req.user;
    const { movieId} = req.body;
    const type=req?.body?.type||"movie";



    if (!movieId) {
      return res.status(400).json({ success: false, message: 'Movie ID is required' });
    }

    
     const tmdbResponse = await axios.get(process.env.TMDB_URL+`/${type}/${movieId}`,
          {params:{},headers:{Authorization: "bearer " + process.env.TMDB_API_KEY}});

        
    const movie = tmdbResponse.data;
  
    // Add movie to the user's watchlist
    const user = await User.findById(userId);

    // Check if the movie is already in the watchlist
    const exists = user.watchlist.some((item) => item.id == movieId);
    console.log("exits",exists)
    if (exists) {
      return res.status(400).json({ success: false, message: 'Movie already in watchlist' });
    }

    user.watchlist.push({id:movie.id,media_type:type});
    await user.save();

    res.status(200).json({ success: true, message: 'Movie added to watchlist', watchlist: user.watchlist });
  } catch (error) {
    console.log("err",error)
    res.status(500).json({ success: false, error: error.message });
  }
};

// Remove a movie from the user's watchlist
exports.removeFromWatchlist = async (req, res) => {
  try {
    // Get userId from protected route (set by the middleware)
    const {userId} = req.user;

    // Get the movieId from the request parameters
    const { movieId } = req.body;
    const type=req?.body?.type||"movie";

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the movie exists in the user's watchlist
    const movieIndex = user.watchlist.findIndex(movie =>  movie.id== movieId && movie.media_type==type);

    if (movieIndex === -1) {
      return res.status(400).json({ message: 'Movie not found in watchlist' });
    }

    // Remove the movie from the watchlist
    user.watchlist.splice(movieIndex, 1);

    // Save the updated user data
    await user.save();

    // Respond with the updated watchlist
    res.status(200).json({
      message: 'Movie removed from watchlist',
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.error('Error removing movie from watchlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserVoteForMovie = (movie, userId) => {
  // Check if the current user has voted on this movie, and return their vote.
  // Assuming movie.voters contains user votes, you can filter by userId
  const userVote = movie.voters.find(vote => vote.userId.toString() === userId.toString());
  return userVote ? userVote.voteType : null; // 'upvote', 'downvote', or null
};

// Get the watchlist
exports.getWatchlist = async (req, res) => {
  try {
    const { userId } = req.user;
    const page = parseInt(req.query.page, 10) || 1; // Ensure page is an integer, default to 1
    const limit = 10; // Adjust limit as needed

    // Fetch the user and their watchlist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const totalWatchlistItems = user.watchlist?.length || 0;

    // Calculate total pages
    const totalPages = Math.ceil(totalWatchlistItems / limit);

    // Handle invalid or out-of-range page numbers gracefully
    if (page < 1 || page > totalPages) {
      return res.status(400).json({ success: false, error: 'Invalid page number' });
    }

    // Paginate the user's watchlist
    const paginatedWatchlist = user.watchlist.slice((page - 1) * limit, page * limit);

    // Process each movie in the paginated watchlist

    const results = [];
    for (const movie of paginatedWatchlist) {
      const movieInDb = await Movie.findOne({ movieId: movie.id,media_type:movie?.media_type });
        const tmdbResponse = await axios.get(process.env.TMDB_URL+`/${movie?.media_type||'movie'}/${movie.id}`,
            {params:{},headers:{Authorization: "bearer " + process.env.TMDB_API_KEY}});
        const obj=tmdbResponse?.data;
      const updatedMovie = {
        ...obj,
        media_type:movie?.media_type, 
        votes: movieInDb
          ? {
              upvotes: movieInDb.ratings.upvotes,
              downvotes: movieInDb.ratings.downvotes,
              userVote: getUserVoteForMovie(movieInDb, userId),
            }
          : {
              upvotes: 0,
              downvotes: 0,
              userVote: null,
            },
        videos: movieInDb?.videos || [],
        introSkipTime: movieInDb?.introSkipTime || null,
        mylist: user.watchlist.some((ele) => ele.id === movie.id && ele.media_type==movie.media_type),
      };
    

      results.push(updatedMovie);
    }

    res.status(200).json({
      data: {
        page,
        limit,
        results,
        total_pages: totalPages,
        total_results: totalWatchlistItems,
      },
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Toggle autoplay for a movie
exports.toggleAutoplay = async (req, res) => {
  try {
    const userId = req.user.id;
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ success: false, message: 'Movie ID is required' });
    }

    const user = await User.findById(userId);

    const movie = user.watchlist.find((item) => item.movieId === movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found in watchlist' });
    }

    // Toggle the autoplay flag
    movie.autoplay = !movie.autoplay;
    await user.save();

    res.status(200).json({ success: true, message: 'Autoplay toggled', watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};