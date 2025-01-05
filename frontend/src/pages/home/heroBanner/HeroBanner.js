/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import Img from "../../../components/lazyLoadImage/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import { fetchDataFromApi } from "../../../store/actions";
const HeroBanner = () => {
  const [background, setBackground] = useState("");
  const [query, setQuery] = useState("");
 const dispatch = useDispatch();
  const navigate = useNavigate();
  const { url} = useSelector((state) => state.state);
  const [show, setShow] = useState(false);
  const [videoId, setVideoId] = useState();
  const [loading,setLoading]=useState(false);
  const [movieData,setMovieData]=useState();


    // const bg =
    //   url.backdrop +
    //   data?.results?.[index]?.backdrop_path;
    //   console.log("movie data",data)
    // setBackground(bg);


  


  useEffect( ()=>{

   fetchBannerMovie("/movies/banner")
   
  },[])



  const fetchBannerMovie= async (url)=>{
        setLoading(true);
        dispatch( fetchDataFromApi(url,{},(res)=>{
          setLoading(false);
         console.log('ress',res)
          const index=Math.floor(Math.random() *res?.results?.length||0);
          setMovieData(res?.results?.[index])
        },()=>{
          setLoading(false);
        })
              
              )
    
     
      
  }




  return (
    <div className="heroBanner">
      {!loading && (
        <div className="backdrop-img">
          <Img src={url?.backdrop +movieData?.backdrop_path} />
        </div>
      )}
      <div className="opacity-layer"></div>
      <ContentWrapper>
        {/* <div className="heroBannerContent">
          <span className="title">Welcome</span>
          <span className="subTitle">
            Millions of movies, TV shows and people to discover. Explore now.
          </span>
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search for a movies a tv show..."
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={searchQueryHandler}
            />
            <button>Search</button>
          </div>
        </div> */}
         <div role="banner" className="hero heroBannerContent">
                <h3 className="hero--logo"  >{movieData?.title}</h3>
               
                {/* <img className="hero--logo" src={url.backdrop +movieData?.poster_path} alt="Movie title logo"/> */}
                <p className="hero--description">{movieData?.overview}</p>
                <div className="btn-container">
                <button className="hero--button play" onClick={() => {
                      
                        navigate(`/${movieData?.id}/videoplayer`)
                      
                        }}><i className="fa-solid fa-play"></i>Watch</button>
                <button className="hero--button info" 
                    onClick={() =>
                navigate(`/${movieData?.media_type || 'movie'}/${movieData?.id}`)
            }
                ><i className="fa-solid fa-circle-info"></i>More information</button>
                </div>
            
            </div>
    
      </ContentWrapper>
    </div>
  );
};

export default HeroBanner;
