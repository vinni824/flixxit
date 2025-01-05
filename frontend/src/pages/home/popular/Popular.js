import React, { useEffect, useState } from 'react'
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper'
import SwitchTabs from '../../../components/switchTabs/SwitchTabs'

import Carousel from '../../../components/carousel/Carousel'
import { useDispatch } from 'react-redux'
import { fetchDataFromApi } from '../../../store/actions'

const Popular = () => {
    const [endpoint, setEndpoint] = useState("movie");
   
        const dispatch = useDispatch();
        const [data,setData]=useState();
        const [loading,setLoading]=useState(false);
                  const [refresh,setRefresh]=useState(false);
        useEffect(()=>{
          setLoading(true);
             dispatch( fetchDataFromApi('/movies/popular',{type:endpoint},(res)=>{
                  
                  setLoading(false);
                  console.log("trending",res)
                    setData(res)
                  },()=>{
                     setData()
                     setLoading(false);
                  }))
    
        },[endpoint,refresh])
    const onTabChange = (tab) => {
        setEndpoint(tab === "Movies" ? "movie" : "tv");
    }

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
    <div className='carouselSection'>
      <ContentWrapper>
      <span className="carouselTitle">What's Popular</span>
      <SwitchTabs data={["Movies", "TV Shows"]} onTabChange={onTabChange} />
      </ContentWrapper>
      <Carousel data={data?.results} loading={loading} endpoint={endpoint}      onRefresh={handleRefresh}/>
    </div>
  )
}

export default Popular
