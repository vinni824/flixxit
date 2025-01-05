const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;
const Movie = require('../models/Movie');
const User = require('../models/User');



  
  // Helper to get the user's vote on a particular movie
  const getUserVoteForMovie = (movie, userId) => {
    // Check if the current user has voted on this movie, and return their vote.
    // Assuming movie.voters contains user votes, you can filter by userId
    const userVote = movie.voters.find(vote => vote.userId.toString() === userId.toString());
    return userVote ? userVote.voteType : null; // 'upvote', 'downvote', or null
  };
  
 
  

  exports.getConfiguration = async (req, res) => {
    try {
      // Fetch recent most streaming movies from TMDb

      const tmdbResponse = await axios.get(process.env.TMDB_URL+'/configuration',
         {params:{},headers:{Authorization: "bearer " + process.env.TMDB_API_KEY}});
  
 
      res.status(200).json({data: tmdbResponse?.data});
    } catch (error) {
      console.log("errorr",error)
      res.status(500).json({ error: error.message });
    }
  }; 
  exports.getGenres = async (req, res) => {
    try {
      // Define endpoint categories
      const  {type}=req;
      const endPoints =type?[type]: ["tv", "movie"];
      const allGenres = [];
  
      // Generate API requests
      const promises = endPoints.map((category) =>
        axios.get(`${process.env.TMDB_URL}/genre/${category}/list`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        })
      );
  
      // Wait for all requests to resolve
      const responses = await Promise.all(promises);
  
      // Process each response
      responses.forEach(({ data }) => {
        data.genres?.forEach((genre) => {
          allGenres.push(genre);
        });
      });
  
      // Respond with aggregated genres
      res.status(200).json({ data: allGenres });
    } catch (error) {
      console.error("Error fetching genres:", error.message);
      res.status(500).json({ error: "Failed to fetch genres" });
    }
  };
  
  


exports.getBannerContent = async (req, res) => {
    try {
      // Fetch recent most streaming movies from TMDb

      const tmdbResponse = await axios.get(process.env.TMDB_URL+'/movie/upcoming',
         {params:{},headers:{Authorization: "bearer " + process.env.TMDB_API_KEY}});
    
  
      const movies = tmdbResponse.data.results;
     
  
      // Format the response if needed (e.g., limit number of results, add extra fields)
      // const formattedMovies = movies.map((movie) => ({
      //   id: movie.id,
      //   title: movie.title,
      //   overview: movie.overview,
      //   release_date: movie.release_date,
      //   poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      //   backdrop_path: `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`,
      //   vote_average: movie.vote_average,
      // }));
  
      res.status(200).json({data: tmdbResponse.data});
    } catch (error) {
      console.log("errorr",error)
      res.status(500).json({ error: error.message });
    }
  };  

  exports.getTrendingContent = async (req, res) => {
    try {
      // Fetch recent most streaming movies from TMDb

      const type=req.type||'day'

      const tmdbResponse = await axios.get(process.env.TMDB_URL+`/trending/all/${type}`,
         {params:{},headers:{Authorization: "bearer " + process.env.TMDB_API_KEY}});
    
         const userId = req.user ? req.user.userId : null;
         const user = await User.findById(userId);
     
        if (user) {
          // Check each movie's vote information from the database
          for(const movie of tmdbResponse?.data?.results){
            const movieInDb = await Movie.findOne({ movieId: movie.id ,media_type:movie?.media_type  });
    
            if (movieInDb) {
              movie.votes = {
                upvotes: movieInDb.ratings.upvotes,
                downvotes: movieInDb.ratings.downvotes,
                userVote: getUserVoteForMovie(movieInDb, userId)
              };
              movie.videos= movieInDb?.videos,
              movie.introSkipTime= movieInDb?.introSkipTime
            } else {
              movie.votes = {
                upvotes: 0,
                downvotes: 0,
                userVote: null
              };
            }
   
            const isPresent = user.watchlist?.some(ele =>ele.id == movie.id && ele.media_type==movie?.media_type  );
          
            movie.mylist=  isPresent
           }
   
          }
     
  
      res.status(200).json({data: tmdbResponse.data});
    } catch (error) {
      console.log("errorr",error)
      res.status(500).json({ error: error.message });
    }
  };  

  exports.getPopularContent = async (req, res) => {
    try {
      // Fetch recent most streaming movies from TMDb

      const type=req.type||'movie'

      const tmdbResponse = await axios.get(process.env.TMDB_URL+`/${type}/popular`,
         {params:{},headers:{Authorization: "bearer " + process.env.TMDB_API_KEY}});
    
         const userId = req.user ? req.user.userId : null;
         const user = await User.findById(userId);
     
        if (user) {
          // Check each movie's vote information from the database
          for(const movie of tmdbResponse?.data?.results){
            const movieInDb = await Movie.findOne({ movieId: movie.id ,media_type:type });
    
            if (movieInDb) {
              movie.votes = {
                upvotes: movieInDb.ratings.upvotes,
                downvotes: movieInDb.ratings.downvotes,
                userVote: getUserVoteForMovie(movieInDb, userId)
              };
              movie.videos= movieInDb?.videos,
              movie.introSkipTime= movieInDb?.introSkipTime
            } else {
              movie.votes = {
                upvotes: 0,
                downvotes: 0,
                userVote: null
              };
            }
   
            const isPresent = user.watchlist?.some(ele =>ele.id == movie.id && ele.media_type==type );          
            movie.mylist=  isPresent
           }
   
          }
     
  
      res.status(200).json({data: tmdbResponse.data});
    } catch (error) {
      console.log("errorr",error)
      res.status(500).json({ error: error.message });
    }
  };  

  exports.getTopratedContent = async (req, res) => {
    try {
      // Fetch recent most streaming movies from TMDb

      const type=req.type||'movie'

      const tmdbResponse = await axios.get(process.env.TMDB_URL+`/${type}/top_rated`,
         {params:{},headers:{Authorization: "bearer " + process.env.TMDB_API_KEY}});
         const userId = req.user ? req.user.userId : null;
         const user = await User.findById(userId);
     
        if (user) {
          // Check each movie's vote information from the database
          for(const movie of tmdbResponse?.data?.results){
            const movieInDb = await Movie.findOne({ movieId: movie.id,media_type:type });
    
            if (movieInDb) {
              movie.votes = {
                upvotes: movieInDb.ratings.upvotes,
                downvotes: movieInDb.ratings.downvotes,
                userVote: getUserVoteForMovie(movieInDb, userId)
              };
              movie.videos= movieInDb?.videos,
              movie.introSkipTime= movieInDb?.introSkipTime
            } else {
              movie.votes = {
                upvotes: 0,
                downvotes: 0,
                userVote: null
              };
            }
            const isPresent = user.watchlist?.some(ele =>ele.id == movie.id && ele.media_type==type );
          
            movie.mylist=  isPresent
           }
   
          }
    

     
  
      res.status(200).json({data: tmdbResponse.data});
    } catch (error) {
      console.log("errorr",error)
      res.status(500).json({ error: error.message });
    }
  }; 

exports.exploreContent = async (req, res) => {
  try {
    const { filters,type} = req.query;

    console.log("req",req)
    
    const tmdbResponse = await axios.get(process.env.TMDB_URL+`/discover/${type}`,
      {params:{...filters},headers:{Authorization: "bearer " + process.env.TMDB_API_KEY}});

      const userId = req.user ? req.user.userId : null;
      const user = await User.findById(userId);
  
     if (user) {
       // Check each movie's vote information from the database
       for(const movie of tmdbResponse?.data?.results){
         const movieInDb = await Movie.findOne({ movieId: movie.id });
 
         if (movieInDb) {
           movie.votes = {
             upvotes: movieInDb.ratings.upvotes,
             downvotes: movieInDb.ratings.downvotes,
             userVote: getUserVoteForMovie(movieInDb, userId)
           };
           movie.videos= movieInDb?.videos,
           movie.introSkipTime= movieInDb?.introSkipTime
         } else {
           movie.votes = {
             upvotes: 0,
             downvotes: 0,
             userVote: null
           };
         }

         const isPresent = user.watchlist?.some(ele =>ele.id == movie.id);          
         movie.mylist=  isPresent
        }

       }


    res.status(200).json({data:tmdbResponse.data});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
exports.searchMovies = async (req, res) => {
  try {
    const { filters } = req.query;

    const tmdbResponse = await axios.get(process.env.TMDB_URL+`/search/multi`,
      {params:{...filters},headers:{Authorization: "bearer " + process.env.TMDB_API_KEY}});
      const userId = req.user ? req.user.userId : null;
      const user = await User.findById(userId);
  
     if (user) {
       // Check each movie's vote information from the database
       for(const movie of tmdbResponse?.data?.results){
         const movieInDb = await Movie.findOne({ movieId: movie.id ,media_type:movie?.media_type });
 
         if (movieInDb) {
           movie.votes = {
             upvotes: movieInDb.ratings.upvotes,
             downvotes: movieInDb.ratings.downvotes,
             userVote: getUserVoteForMovie(movieInDb, userId)
           };
           movie.videos= movieInDb?.videos,
           movie.introSkipTime= movieInDb?.introSkipTime
         } else {
           movie.votes = {
             upvotes: 0,
             downvotes: 0,
             userVote: null
           };
         }

     
         const isPresent = user.watchlist?.some(ele =>ele.id == movie.id && ele.media_type==movie?.media_type);        
         movie.mylist=  isPresent
        }

       }

    res.status(200).json({data:tmdbResponse.data});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get movie details
exports.getMovieDetails = async (req, res) => {
  try {
    const { id ,type} = req.params;
    const tmdbResponse = await axios.get(process.env.TMDB_URL+`/${type||'movie'}/${id}`,
      {params:{},headers:{Authorization: "bearer " + process.env.TMDB_API_KEY}});

      const userId = req.user ? req.user.userId : null;
       const user = await User.findById(userId);
      const movie=tmdbResponse.data;
      if (user) {
        // Check each movie's vote information from the database
          const movieInDb = await Movie.findOne({ movieId: movie.id });
  
          if (movieInDb) {
            movie.votes = {
              upvotes: movieInDb.ratings.upvotes,
              downvotes: movieInDb.ratings.downvotes,
              userVote: getUserVoteForMovie(movieInDb, userId)
            };
            movie.videos= movieInDb?.videos,
            movie.introSkipTime= movieInDb?.introSkipTime
          } else {
            movie.votes = {
              upvotes: 0,
              downvotes: 0,
              userVote: null
            };
          }

          const isPresent = user.watchlist?.some(ele =>ele.id == movie.id);
        
          movie.mylist=  isPresent

        }
      
  
    res.status(200).json({data: movie});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSimilarMovieDetails = async (req, res) => {
  try {
    const { id ,type} = req.params;
    const tmdbResponse = await axios.get(process.env.TMDB_URL+`/${type||'movie'}/${id}/similar`,
      {params:{},headers:{Authorization: "bearer " + process.env.TMDB_API_KEY}});
      const userId = req.user ? req.user.userId : null;
      const user = await User.findById(userId);
  
     if (user) {
       // Check each movie's vote information from the database
       for(const movie of tmdbResponse?.data?.results){
         const movieInDb = await Movie.findOne({ movieId: movie.id,media_type:type });
 
         if (movieInDb) {
           movie.votes = {
             upvotes: movieInDb.ratings.upvotes,
             downvotes: movieInDb.ratings.downvotes,
             userVote: getUserVoteForMovie(movieInDb, userId)
           };
           movie.videos= movieInDb?.videos,
           movie.introSkipTime= movieInDb?.introSkipTime
         } else {
           movie.votes = {
             upvotes: 0,
             downvotes: 0,
             userVote: null
           };
         }

         const isPresent = user.watchlist?.some(ele =>ele.id == movie.id && ele.media_type==type);
       
         movie.mylist=  isPresent
        }

       }
    res.status(200).json({data:  tmdbResponse?.data});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getRecommendationsMovieDetails = async (req, res) => {
  try {
    const { id ,type} = req.params;
    const tmdbResponse = await axios.get(process.env.TMDB_URL+`/${type||'movie'}/${id}/recommendations`,
      {params:{},headers:{Authorization: "bearer " + process.env.TMDB_API_KEY}});
      const userId = req.user ? req.user.userId : null;
      const user = await User.findById(userId);
 
   
     if (user) {
       // Check each movie's vote information from the database
       for(const movie of tmdbResponse?.data?.results){
         const movieInDb = await Movie.findOne({ movieId: movie.id,media_type:type });
 
         if (movieInDb) {
           movie.votes = {
             upvotes: movieInDb.ratings.upvotes,
             downvotes: movieInDb.ratings.downvotes,
             userVote: getUserVoteForMovie(movieInDb, userId)
           };
           movie.videos= movieInDb?.videos,
           movie.introSkipTime= movieInDb?.introSkipTime
         } else {
           movie.votes = {
             upvotes: 0,
             downvotes: 0,
             userVote: null
           };
         }

  
         const isPresent = user.watchlist?.some(ele =>ele.id == movie.id && ele.media_type==type);
       
         movie.mylist=  isPresent
        }

       }
    res.status(200).json({data:  tmdbResponse?.data});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMovieVideos = async (req, res) => {
  try {
    const { id ,type} = req.params;
    const tmdbResponse = await axios.get(process.env.TMDB_URL+`/${type||'movie'}/${id}/videos`,
      {params:{},headers:{Authorization: "bearer " + process.env.TMDB_API_KEY}});
    res.status(200).json({data: tmdbResponse.data});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMovieCredits = async (req, res) => {
  try {
    const { id ,type} = req.params;
    const tmdbResponse = await axios.get(process.env.TMDB_URL+`/${type||'movie'}/${id}/credits`,
      {params:{},headers:{Authorization: "bearer " + process.env.TMDB_API_KEY}});
    res.status(200).json({data: tmdbResponse.data});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMovieMetaDetails = async (req, res) => {
  try {
    const { id ,type} = req.params;


      const userId = req.user ? req.user.userId : null;
       const user = await User.findById(userId);
      const movie={};
      if (user) {
        // Check each movie's vote information from the database
          const movieInDb = await Movie.findOne({ movieId: id,media_type:type });
  
          if (movieInDb) {
            movie.votes = {
              upvotes: movieInDb.ratings.upvotes,
              downvotes: movieInDb.ratings.downvotes,
              userVote: getUserVoteForMovie(movieInDb, userId)
            };
            movie.videos= movieInDb?.videos,
            movie.introSkipTime= movieInDb?.introSkipTime
          } else {
            movie.votes = {
              upvotes: 0,
              downvotes: 0,
              userVote: null
            };
          }

          const isPresent = user.watchlist?.some(ele =>ele.id == id && ele.media_type==type);
        
          movie.mylist=  isPresent

        }
      
  
    res.status(200).json({data: movie});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// Upvote a movie
exports.upvoteMovie = async (req, res) => {
  try {
    const { movieId,type } = req.body;
    const { userId } = req.user; // Assuming JWT middleware sets `req.user`

    if (!movieId) {
      return res.status(400).json({ success: false, message: 'Movie ID is required' });
    }

    // Find the movie by its ID
    let movie = await Movie.findOne({ movieId ,media_type:type });

    // If the movie does not exist, create it and initialize upvote
    if (!movie) {
      movie = new Movie({
        movieId,
        ratings: { upvotes: 1, downvotes: 0 },
        voters: [{ userId, voteType: 'upvote' }],
        media_type:type
      });

      await movie.save();

      return res.status(201).json({
        success: true,
        message: 'Movie created and upvoted successfully',
        ratings: movie.ratings,
      });
    }

    // Check if the user has already voted
    const existingVote = movie.voters.find((vote) => vote.userId.toString() === userId);

    if (existingVote) {
      if (existingVote.voteType === 'upvote') {
        return res.status(400).json({
          success: false,
          message: 'User already upvoted this movie',
        });
      }

      // If the user had a downvote, update it to an upvote
      movie.ratings.downvotes -= 1;
      existingVote.voteType = 'upvote';
    } else {
      // Add a new upvote
      movie.voters.push({ userId, voteType: 'upvote' });
    }

    // Increment the upvote count
    movie.ratings.upvotes += 1;

    await movie.save();

    res.status(200).json({
      success: true,
      message: 'Upvoted successfully',
      ratings: movie.ratings,
    });
  } catch (error) {
    console.error('Error during upvote:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Downvote a movie
exports.downvoteMovie = async (req, res) => {
  try {
    const { movieId,type } = req.body;
    const { userId } = req.user; // Assuming JWT middleware sets `req.user`

    // Validate request body
    if (!movieId) {
      return res.status(400).json({ success: false, message: 'Movie ID is required' });
    }

    // Find the movie in the database
    let movie = await Movie.findOne({ movieId ,media_type:type});

    // If the movie is not found, create it and add a downvote
    if (!movie) {
      movie = new Movie({
        movieId,
        ratings: { upvotes: 0, downvotes: 1 },
        voters: [{ userId, voteType: 'downvote' }],
        media_type:type
      });

      await movie.save();

      return res.status(201).json({
        success: true,
        message: 'Movie created and downvoted successfully',
        ratings: movie.ratings,
      });
    }

    // Check if the user has already voted
    const existingVote = movie.voters.find((vote) => vote.userId.toString() === userId);

    if (existingVote) {
      if (existingVote.voteType === 'downvote') {
        return res.status(400).json({
          success: false,
          message: 'User already downvoted this movie',
        });
      }

      // If the user had an upvote, update it to a downvote
      movie.ratings.upvotes -= 1;
      existingVote.voteType = 'downvote';
    } else {
      // Add a new downvote
      movie.voters.push({ userId, voteType: 'downvote' });
    }

    // Increment the downvote count
    movie.ratings.downvotes += 1;

    await movie.save();

    res.status(200).json({
      success: true,
      message: 'Downvoted successfully',
      ratings: movie.ratings,
    });
  } catch (error) {
    console.error('Error during downvote:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};



// Function to add video to movie
exports.addVideoToMovie = async (req, res) => {
    try {
      const { movieId, hdUrl, autoUrl, introSkipTime } = req.body;
  
      const movie = await Movie.findOne({ movieId: movieId });
      
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      // Update movie with video URLs and introSkipTime
      movie.videos = {
        hd: hdUrl,
        auto: autoUrl,
      };
      movie.introSkipTime = introSkipTime;
  
      await movie.save();
  
      res.status(200).json({ message: 'Video added successfully', movie });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
