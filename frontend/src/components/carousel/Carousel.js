import React, { useRef } from "react";
import {
    BsFillArrowLeftCircleFill,
    BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import Img from "../lazyLoadImage/Img";
import PosterFallback from "../../assets/no-poster.png";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";

import "./style.scss";
import { addToList, downvote, removeFromList, upvote } from "../../store/actions";

const Carousel = ({ data, loading, endpoint, title ,onRefresh }) => {
    const carouselContainer = useRef();
    const { url } = useSelector((state) => state.state);
    const navigate = useNavigate();
  const dispatch = useDispatch();
    const navigation = (dir) => {
        const container = carouselContainer.current;

        const scrollAmount =
            dir === "left"
                ? container.scrollLeft - (container.offsetWidth + 20)
                : container.scrollLeft + (container.offsetWidth + 20);

        container.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
        });
    };

    const skItem = () => {
        return (
            <div className="skeletonItem">
                <div className="posterBlock skeleton"></div>
                <div className="textBlock">
                    <div className="title skeleton"></div>
                    <div className="date skeleton"></div>
                </div>
            </div>
        );
    };


      const handleRefresh=(id,type)=>{
          
            onRefresh(id,type);
        }
        
        const handleUpvote=(item)=>{
           dispatch(upvote({movieId:item?.id,type:item?.media_type||endpoint},()=>{
            handleRefresh(item?.id,item?.media_type||endpoint)
        
           },()=>{}))
        }
            
        const handleDownvote=(item)=>{
          dispatch(downvote({movieId:item?.id,type:item?.media_type||endpoint},()=>{
            handleRefresh(item?.id,item?.media_type||endpoint)
          },()=>{}))
        }
        const handleMylist=(item)=>{
          if(!item?.mylist)
          dispatch(addToList({movieId:item?.id,type:item?.media_type||endpoint
            },()=>{
            handleRefresh(item?.id,item?.media_type||endpoint)
        },()=>{}))
        else
        dispatch(removeFromList({movieId:item?.id,type:item?.media_type||endpoint},()=>{
          handleRefresh(item?.id,item?.media_type||endpoint)
        },()=>{}))
        
        }

    return (
        <div className="carousel">
            <ContentWrapper>
                {title && <div className="carouselTitle">{title}</div>}
           
                {!loading ? (
                  
                     data?.length>0?
                     <>   
                <BsFillArrowLeftCircleFill
                    className="carouselLeftNav arrow"
                    onClick={() => navigation("left")}
                />
                <BsFillArrowRightCircleFill
                    className="carouselRighttNav arrow"
                    onClick={() => navigation("right")}
                />
                 <div className="carouselItems" ref={carouselContainer}>
                        {data?.map((item) => {
                            const posterUrl = item?.poster_path
                                ? url?.poster + item?.poster_path
                                : PosterFallback;
                            return (
                                <div
                                    key={item.id}
                                    className="carouselItem"
                                    onClick={() =>
                                        navigate(
                                            `/${item?.media_type || endpoint}/${
                                                item?.id
                                            }`
                                        )
                                    }
                                >
                                    <div className="posterBlock">
                                        <Img src={posterUrl} />
                                        {/* <CircleRating
                                            rating={item.vote_average.toFixed(
                                                1
                                            )}
                                        /> */}
                                      
                                    </div>
                                    <div className="textBlock">
                                        <span className="title">
                                            {item?.title || item?.name}
                                        </span>
                                        <Genres
                                            data={item?.genre_ids.slice(0, 2)}
                                        />
                                             <div className="action-wrapper">
                                          <div className="container-1">
                                <div className="like_dislike" id="like_dislike">
                                <div className="like" id="like" onClick={(e)=>{ e.stopPropagation();handleUpvote(item)}} data-status="inactive">
                                 { item?.votes?.userVote=='upvote'?
                                    <i id="like__icon" className="fa fa-thumbs-up"></i>:
                                    <i id="like__icon" className="fa-regular fa-thumbs-up"></i>}

                                    <span className="number" id="number">{item?.votes?.upvotes||''}</span>
                                </div>
                                <span className="divider"></span>
                                <div className="dislike" id="dislike" onClick={(e)=>{ e.stopPropagation();handleDownvote(item)}} data-status="inactive">
                                { item?.votes?.userVote=='downvote'?
                                    <i id="dislike__icon" className="fa fa-thumbs-down"></i>:
                                    <i id="dislike__icon" className="fa-regular fa-thumbs-down"></i>
                                }
                                </div>
                                </div>
                                </div>
                                <div className="container-2">
                                <div className="add-to-list" onClick={(e)=>{ e.stopPropagation();handleMylist(item)}} >
                                    {item?.mylist ? <i id="add-to-list__icon" className="fa  fa-check"></i>:
                                    <i id="add-to-list__icon" className="fa fa-plus"></i>
                                        }
                                </div>
                                </div>
                                              </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    </>:<div style={{color:'#fff'}}>No data found!</div>
                   
                ) : (
                    <div className="loadingSkeleton">
                        {skItem()}
                        {skItem()}
                        {skItem()}
                        {skItem()}
                        {skItem()}
                    </div>
                )}
            </ContentWrapper>
        </div>
    );
};

export default Carousel;