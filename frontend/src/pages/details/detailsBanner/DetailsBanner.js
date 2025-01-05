
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import Genres from "../../../components/genres/Genres";
import CircleRating from "../../../components/circleRating/CircleRating";
import Img from "../../../components/lazyLoadImage/Img";
import PosterFallback from "../../../assets/no-poster.png";

import VideoPopup from "../../../components/videoPopup/VideoPopup";
import { addToList, downvote, fetchDataFromApi, removeFromList, upvote } from "../../../store/actions.js";

const DetailsBanner = ({ video, crew }) => {
  const [show, setShow] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const { mediaType, id } = useParams();
   const [data,setData]=useState();
    const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const navigate=useNavigate()

useEffect(()=>{
  setLoading(true);
      dispatch(fetchDataFromApi(`/movies/${mediaType}/${id}`,{},(res)=>{
        setData(res);
  
        setLoading(false);
      },()=>{
        setLoading(false);
      }))
},[mediaType, id])
    

const handleRefresh=()=>{
  
  dispatch(fetchDataFromApi(`/movies/${mediaType}/${id}`,{},(res)=>{
    setData(res);

 
  },()=>{
 
  }))
}

const handleUpvote=()=>{
   dispatch(upvote({movieId:id,type:mediaType},()=>{
    handleRefresh()

   },()=>{}))
}
    
const handleDownvote=()=>{
  dispatch(downvote({movieId:id,type:mediaType},()=>{
    handleRefresh()
  },()=>{}))
}
const handleMylist=()=>{
  if(!data?.mylist)
  dispatch(addToList({movieId:id,type:mediaType},()=>{
    handleRefresh()
},()=>{}))
else
dispatch(removeFromList({movieId:id,type:mediaType},()=>{
  handleRefresh()
},()=>{}))

}

   

  const { url } = useSelector((state) => state.state);

  const _genres = data?.genres?.map((g) => g.id);
   
  const director = crew?.filter((f)=>f.job === "Director")
  const writer = crew?.filter((f)=>f.job === "Screenplay" || f.job === "Story"|| f.job === "Writer" )
  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  return (
    <div className="detailsBanner">
      {!loading ? (
        <>
          {!!data && (
            <React.Fragment>
              <div className="backdrop-img">
                <Img src={url.backdrop + data.backdrop_path} />
              </div>
              <div className="opacity-layer"></div>

              <ContentWrapper>
                <div className="content">
                  <div className="left">
                    {data.poster_path ? (
                      <Img
                        className="posterImg"
                        src={url.backdrop + data.poster_path}
                      />
                    ) : (
                      <Img className="posterImg" src={PosterFallback} />
                    )}
                  </div>
                  <div className="right">
                
                    <div className="title">
                      {`${data.name || data.title} (${dayjs(
                        data?.release_data
                      ).format("YYYY")})`}
                      
                    </div>
                  
                  
                    <div className="subtitle">{data.tagline}</div>
                    <div className="row">
                    <Genres data={_genres} />
                  
                    </div>
                 
                       <div className="row">
                       <div className="btn-container">
                <button className="hero--button play" onClick={() => {
                     navigate(`/${data?.id}/videoplayer`)
                        }}><i className="fa-solid fa-play"></i>Watch</button>
                <button className="hero--button trailer" 
               onClick={() => {
                        setShow(true) 
                        setVideoId(video.key)
                        }}
                ><i className="fa-solid fa-circle-info"></i>Watch Trailer</button>
                </div>
                       </div>
                  
                  
                    <div className="action-wrapper">
                    <CircleRating rating={data.vote_average.toFixed(1)} />
                                          <div className="container-1">
                                <div className="like_dislike" id="like_dislike">
                                <div className="like" id="like" onClick={handleUpvote} data-status="inactive">
                                 { data?.votes?.userVote=='upvote'?
                                    <i id="like__icon" className="fa fa-thumbs-up"></i>:
                                    <i id="like__icon" className="fa-regular fa-thumbs-up"></i>}

                                    <span className="number" id="number">{data?.votes?.upvotes||''}</span>
                                </div>
                                <span className="divider"></span>
                                <div className="dislike" id="dislike" onClick={handleDownvote} data-status="inactive">
                                { data?.votes?.userVote=='downvote'?
                                    <i id="dislike__icon" className="fa fa-thumbs-down"></i>:
                                    <i id="dislike__icon" className="fa-regular fa-thumbs-down"></i>
                                }
                                </div>
                                </div>
                                </div>
                                <div className="container-2">
                                <div className="add-to-list" onClick={handleMylist} >
                                    {data?.mylist ? <i id="add-to-list__icon" className="fa  fa-check"></i>:
                                    <i id="add-to-list__icon" className="fa fa-plus"></i>
                                        }
                                </div>
                                </div>
                                </div>
                    <div className="overview">
                      <div className="heading">Overview</div>
                      <div className="description">{data.overview}</div>
                    </div>
                    <div className="info">
                      {data.status && (
                        <div className="infoItem">
                          <span className="text bold">Status: </span>
                          <span className="text">{data.status}</span>
                        </div>
                      )}
                      {data.release_date && (
                        <div className="infoItem">
                          <span className="text bold">Release Date: </span>
                          <span className="text">
                            {dayjs(data.release_date).format("MMM D, YYYY")}
                          </span>
                        </div>
                      )}
                      {data.runtime && (
                        <div className="infoItem">
                          <span className="text bold">Runtime: </span>
                          <span className="text">
                            {toHoursAndMinutes(data.runtime)}
                          </span>
                        </div>
                      )}
                    </div>
                    {director?.length > 0 && (
                        <div className="info">
                            <span className="text bold">
                                Director:{" "}
                            </span>
                            <span className="text">
                                {director?.map((d,i)=>(
                                    <span key={i}>{d.name}{director?.length-1 !== i && ", "}</span>
                                ))}
                            </span>
                        </div>
                    )}

                    {writer?.length > 0 && (
                        <div className="info">
                            <span className="text bold">
                                Writer:{" "}
                            </span>
                            <span className="text">
                                {writer?.map((d,i)=>(
                                    <span key={i}>{d.name}{writer?.length-1 !== i && ", "}</span>
                                ))}
                            </span>
                        </div>
                    )}
                    {data?.created_by?.length > 0 && (
                        <div className="info">
                            <span className="text bold">
                                Creator:{" "}
                            </span>
                            <span className="text">
                                {data?.created_by?.map((d,i)=>(
                                    <span key={i}>{d.name}{data?.created_by?.length-1 !== i && ", "}</span>
                                ))}
                            </span>
                        </div>
                    )}
                  </div>
                </div>
                <VideoPopup show={show}
                 setShow={setShow}
                 videoId={videoId}
                 setVideoId={setVideoId}
                />
              </ContentWrapper>
            </React.Fragment>
          )}
        </>
      ) : (
        <div className="detailsBannerSkeleton">
          <ContentWrapper>
            <div className="left skeleton"></div>
            <div className="right">
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
            </div>
          </ContentWrapper>
        </div>
      )}
    </div>
  );
};

export default DetailsBanner;
