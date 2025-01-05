import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import "./style.scss";

import { fetchDataFromApi } from "../../store/actions";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import noResults from "../../assets/no-results.png";
import Spinner from "../../components/spinner/Spinner";
import { useDispatch } from "react-redux";
const SearchResult = () => {
  const [data,setData] = useState();
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const {query} = useParams();
 const dispatch = useDispatch();
  const fetchInitailData = () => {
    setLoading(true);
    dispatch(fetchDataFromApi(`/movies/search`,{filters:{query,page:pageNum}},(res)=>{
      setData(res);
      setPageNum((prev)=> prev + 1)
      setLoading(false);
    },()=>{
      setLoading(false);
    }))
  }
  //second page data
  const fetchNextPageData = () => {
    setLoading(true);
    dispatch( fetchDataFromApi(`/movies/search`,{filters:{query,page:pageNum}},(res)=>{
      if(data?.results){
        setData({...data, results: [...data?.results, ...res.results]})
      }else{
        setData(res);
      }
      setPageNum((prev) => prev+1)
      setLoading(false);
    }),()=>{
      setLoading(false);
    })
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
  
  useEffect(()=>{
    setPageNum(1);
    fetchInitailData();
  },[query])
  return (
    <div className="searchResultsPage">
      {loading && <Spinner  initial={true}/>}
       {!loading && (
        <ContentWrapper>
          {data?.results?.length>0 ? (
               <>
                <div className="pageTitle">
                  {`Search ${data.total_results>1? "results": "result"} of '${query}'`}
                </div>
                <InfiniteScroll 
                className="content"
                dataLength={data?.results?.length || []}
                next={fetchNextPageData}
                hasMore={pageNum<=data?.total_pages}
                loader={<Spinner />}
                >
                  {data?.results?.map((item,index)=>{
                    if(item.media_type === "person") return;
                    return (
                      <MovieCard key={index} data={item} onRefresh={handleRefresh} />
                    )
                  })}
                </InfiniteScroll>
               </>
          ):(
            <span className="resultNotFound pageTitle">
              Sorry, Results not Found!
            </span>
          )}
        </ContentWrapper>
       )}
    </div>
  )
}

export default SearchResult
