import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles.scss";

import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, logout, updateProfile } from "../../store/actions";
const Profile = () => {

     const [formData, setFormData] = useState({ name: '', preferences: '' ,email:''});
     const [warnings, setWarnings] = useState({ name:false });
     const [inputTouched, setInputTouched] = useState({ name:false });
     const [reset,setReset]=useState(false);
     const navigate=useNavigate()
 
   const auth=useSelector((state)=>state.state.auth);
   console.log("authhh",auth)
 
   const dispatch=useDispatch()

   useEffect(()=>{
    dispatch(getProfile((res)=>{
      setFormData({name:res?.name,preferences:res?.preferences,email:res?.email})

    },()=>{

    }))
   },[reset])



 
 
 
   const handleBlur = (e) => {
     const { name, value } = e?.target;
     setInputTouched((prev) => ({ ...prev, [name]: true }));
     if(name==='name'){
        if (!(value?.trim().length >= 1)) {
          setWarnings((prev) => ({ ...prev, name: true }));
        } else {
          setWarnings((prev) => ({ ...prev, name: false }));
        }
  
       }
   };
 
   const handleChange = (e) => {
     const { name, value } = e?.target;
     setFormData((prev) => ({ ...prev, [name]: value }));
   };
 
   const handleFocus = (e) => {
     const { name } = e.target;
     setInputTouched((prev) => ({ ...prev, [name]: true }));
   };
   const handleSubmit = (e) => {
     e.preventDefault();
 
     if(!formData.name){ handleBlur({target:{name:'name',value:formData.name}}); }
    if(warnings.name ) return 

     
      dispatch(updateProfile(formData,()=>{

      },()=>{

      }));
     // Handle login logic

   };

  return (
    <div className="profilePage">
     
        <ContentWrapper>
   
                <div className="pageTitle" style={{fontSize:'34px'}}>
                Edit Profile
                </div>
                <div>
    <div class="container">
  <form className="login" onSubmit={handleSubmit}>
  <div className="name-wrapper">
    <div className="img-wrapper">
       <img src="https://occ-0-5690-3663.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABXh10ggeTTdhZO1JIH_SNQ4gp0vsNnWfE8Mg2ckwzGvUzJMRpPFCujRK3Ex5K9VbkIyvUHQ92LBVdsemkj6zlpquL-qWMCNKeg.png?r=229"/>
    </div>
    <div class="login__group" >
   <div class="login__group__wrapper">
   <input class="login__group__wrapper__input" type="text" 
          name="name"
         onChange={handleChange}  
    
        value={formData?.name}
         onFocus={handleFocus}
         onBlur={handleBlur}
        style={warnings.name ? { border: '1px solid #E50914' } : {}}/>
     <label class="login__group__wrapper__label"
      style={formData?.name?{ top: '15px',
        fontSize: '0.7rem'}:{}}>Name</label>
   </div>
     
     {warnings.name && (
               <div className="warning-input" id="warningName">
                 Name cant be empty.
               </div>
             )}
   </div>
  </div>
  <div className="pageTitle">
  Preferences Handle
                </div>
<div className="bodyText">
Your handle is a unique name that will be used for playing with other Netflix members across all Netflix Games
    </div>
    <div class="login__group" >
   <div class="login__group__wrapper">
   <input class="login__group__wrapper__input" type="text" 
          name="preferences"
         onChange={handleChange}  
         value={formData?.preferences}
      
         onFocus={handleFocus}
         onBlur={handleBlur}
      />
     <label class="login__group__wrapper__label"
      style={formData?.preferences?{ top: '15px',
        fontSize: '0.7rem'}:{}}>Add Preferences</label>
   </div>
     
   
   </div>
 
   <hr />
   <div className="pageTitle">
  Contact Info
                </div>

                <div class="login__group" >
   <div class="login__group__wrapper">
   <input class="login__group__wrapper__input" type="email" 
          name="email"
         onChange={handleChange}  
          readOnly
          value={formData?.email}
         onFocus={handleFocus}
         onBlur={handleBlur}
        />
     <label class="login__group__wrapper__label"
      style={true?{ top: '15px',
        fontSize: '0.7rem'}:{}}>Email</label>
   </div>
     
   
   </div>
<div className="bodyText">
The email associated with this profile is also used for account access and recovery. Visit account security to make changes.
    </div>

<button className="save-button" type="submit">Save</button>
<button className="cancel-button" type="reset" onClick={()=>{
    setReset(!reset)
}}>Cancel</button>
  </form>
  <hr />

  <button className="logout-button"  onClick={()=>{
   dispatch(logout(()=>{
    navigate('/login')
   }))
}}>Logout</button>

</div>

                </div>
        
      
        </ContentWrapper>
      
    </div>
  )
}

export default Profile
