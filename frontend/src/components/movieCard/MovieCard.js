import React from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./style.scss";
import Img from "../lazyLoadImage/Img";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";
import PosterFallback from "../../assets/no-poster.png";
import { addToList, downvote, removeFromList, upvote } from "../../store/actions";

const MovieCard = ({ data, fromSearch, mediaType, onRefresh }) => {
  const { url } = useSelector((state) => state.state);
    const navigate = useNavigate();
      const dispatch = useDispatch();
    const posterUrl = data.poster_path
        ? url.poster + data.poster_path
        : PosterFallback;

        const handleRefresh=(id,type,action)=>{
          
            onRefresh(id,type,action);
        }
        
        const handleUpvote=(item)=>{
           dispatch(upvote({movieId:item?.id,type:item?.media_type||mediaType},()=>{
            handleRefresh(item?.id,item?.media_type||mediaType)
        
           },()=>{}))
        }
            
        const handleDownvote=(item)=>{
          dispatch(downvote({movieId:item?.id,type:item?.media_type||mediaType},()=>{
            handleRefresh(item?.id,item?.media_type||mediaType)
          },()=>{}))
        }
        const handleMylist=(item)=>{
          if(!item?.mylist)
          dispatch(addToList({movieId:item?.id,type:item?.media_type||mediaType
            },()=>{
            handleRefresh(item?.id,item?.media_type||mediaType)
        },()=>{}))
        else
        dispatch(removeFromList({movieId:item?.id,type:item?.media_type||mediaType},()=>{
          handleRefresh(item?.id,item?.media_type||mediaType,'remove')
        },()=>{}))
        
        }
    return (
        <div
            className="movieCard"
            onClick={() =>
                navigate(`/${data.media_type || mediaType}/${data.id}`)
            }
        >
            <div className="posterBlock">
                <Img className="posterImg" src={posterUrl} />
                {!fromSearch && (
                    <React.Fragment>
                        {/* <CircleRating rating={data.vote_average.toFixed(1)} /> */}
                        
                    </React.Fragment>
                )}
            </div>
            <div className="textBlock">
                <span className="title">{data.title || data.name}</span>
                <Genres data={data?.genre_ids?.slice(0, 2)} />

                <div className="action-wrapper">
                                          <div className="container-1">
                                <div className="like_dislike" id="like_dislike">
                                <div className="like" id="like" onClick={(e)=>{ e.stopPropagation();handleUpvote(data)}} data-status="inactive">
                                 { data?.votes?.userVote=='upvote'?
                                    <i id="like__icon" className="fa fa-thumbs-up"></i>:
                                    <i id="like__icon" className="fa-regular fa-thumbs-up"></i>}

                                    <span className="number" id="number">{data?.votes?.upvotes||''}</span>
                                </div>
                                <span className="divider"></span>
                                <div className="dislike" id="dislike" onClick={(e)=>{ e.stopPropagation();handleDownvote(data)}} data-status="inactive">
                                { data?.votes?.userVote=='downvote'?
                                    <i id="dislike__icon" className="fa fa-thumbs-down"></i>:
                                    <i id="dislike__icon" className="fa-regular fa-thumbs-down"></i>
                                }
                                </div>
                                </div>
                                </div>
                                <div className="container-2">
                                <div className="add-to-list" onClick={(e)=>{ e.stopPropagation();handleMylist(data)}} >
                                    {data?.mylist ? <i id="add-to-list__icon" className="fa  fa-check"></i>:
                                    <i id="add-to-list__icon" className="fa fa-plus"></i>
                                        }
                                </div>
                                </div>
                                              </div>
            </div>
        </div>
    );
};

export default MovieCard;