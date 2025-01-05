import React, { useEffect, useState } from "react";

import Carousel from "../../../components/carousel/Carousel";
import { useDispatch } from "react-redux";
import { fetchDataFromApi } from "../../../store/actions";

const Similar = ({ mediaType, id }) => {

    const[data,setData]=useState();
      const [loading, setLoading] = useState(false);
     const dispatch = useDispatch();
        
     useEffect(()=>{

        setLoading(true);
        dispatch(fetchDataFromApi(`/movies/${mediaType}/${id}/similar`,{},(res)=>{
          setData(res);
          setLoading(false);
        },()=>{
          setLoading(false);
        }))
     },[mediaType,id])
      

    const title = mediaType === "tv" ? "Similar TV Shows" : "Similar Movies";

       const handleRefresh=(id,type)=>{
            
        
            dispatch(fetchDataFromApi(`/movies/${type}/${id}/metadata`, {},(res)=>{
              if (res) {
            
                setData({
                  ...data,
                  results: data?.results?.map((item) =>{
                     return    item.id == id ?{ ...item,...res,} : item
                   }
                   ),
               });
              } 
             
            },()=>{}))
          }

    return (
        <Carousel
            title={title}
            data={data?.results}
            loading={loading}
            endpoint={mediaType}
            onRefresh={handleRefresh}
        />
    );
};

export default Similar;