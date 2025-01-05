import { isTokenValid } from "../App";
import { ADDLIST, BANNERDATA, CONFIGURL, GENRES, LOGIN, LOGOUT, MOVIEDATA, MYLIST, REMOVELIST, SEARCHDATA } from "./actionType";


const initialState={
    auth: isTokenValid()?true:false,
    genres: {},
    mylist:[],
    url:{},
}

const reducer=(oldState=initialState,action)=>{
    const {type,payload} = action;
    switch (type) {
  
       
        case ADDLIST:
            return { ...oldState,mylist:[...oldState.mylist,payload]}
        case REMOVELIST:
            let newArray=oldState.mylist.filter((e)=>{return e!==payload})    
            return {...oldState,mylist:[...newArray]}

        case LOGIN:
            return {...oldState,auth:isTokenValid()} 
            
        case BANNERDATA:
            return {...oldState,bannerData:payload}   

        case LOGOUT:
            localStorage.removeItem("auth_token")
            return {...oldState,auth:false}   
        case GENRES:
            return {...oldState,genres:payload}
        case MYLIST:
            return {...oldState,mylist:payload}
        case CONFIGURL:
            return {...oldState,url:payload}
        case SEARCHDATA:
            return {...oldState,searchData:payload}
        case MOVIEDATA:
            return {...oldState,movieData:payload}
        default:
           return  oldState
        
    }
}


export default reducer;