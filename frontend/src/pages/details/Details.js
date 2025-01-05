import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./style.scss";


import DetailsBanner from "./detailsBanner/DetailsBanner";
import Cast from "./cast/Cast";
import VideoSection from "./videoSection/VideoSection";
import Similar from "./carousels/Similar";
import Recommendation from "./carousels/Recommendation";
import { useDispatch } from "react-redux";
import { fetchDataFromApi } from "../../store/actions";

const Details = () => {
    const { mediaType, id } = useParams();


      const[castData,setCastData]=useState();
            const [castLoading, setCastLoading] = useState(false);

            const[videosData,setVideosData]=useState();
            const [videosLoading, setVideosLoading] = useState(false);
           const dispatch = useDispatch();
      
           useEffect(()=>{
      
              setCastLoading(true);
              dispatch(fetchDataFromApi(`/movies/${mediaType}/${id}/credits`,{},(res)=>{
                setCastData(res);
                setCastLoading(false);
              },()=>{
                setCastLoading(false);
              }))
           },[mediaType,id])


           useEffect(()=>{

            setVideosLoading(true);
            dispatch(fetchDataFromApi(`/movies/${mediaType}/${id}/videos`,{},(res)=>{
              setVideosData(res);
              setVideosLoading(false);
            },()=>{
                setVideosLoading(false);
            }))
           },[mediaType,id])
  

    

    return (
        <div>
            <DetailsBanner video={videosData?.results?.[0]} crew={castData?.crew} />
            <Cast  data={castData?.cast}  loading={castLoading}/>
            <VideoSection data={videosData} loading={videosLoading} />
            <Similar mediaType={mediaType} id={id} />
            <Recommendation mediaType={mediaType} id={id} />
        </div>
    );
};

export default Details;