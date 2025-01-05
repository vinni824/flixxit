import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { login,signup } from "../../store/actions";
import "./style.scss";

const Signup= () => {
  const [userData,setuserData]=useState({
       email:"",
       password:"",
       name:""
   })
 
     const [formData, setFormData] = useState({ email: '', password: '',name:'' });
     const [warnings, setWarnings] = useState({ email: false, password: false ,name:false});
     const [inputTouched, setInputTouched] = useState({ email: false, password: false ,name:false});
     const validateEmail = (email) => {
       const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       return re.test(String(email).toLowerCase());
     };
   
     const validatePhone = (mobile) => {
       const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
       return re.test(String(mobile).toLowerCase());
     };
   
  
   const auth=useSelector((state)=>state.state.auth);
 
   const dispatch=useDispatch()
  

 const navigate=useNavigate()
   useEffect(()=>{
     if(auth){
     navigate("/")
     }
   },[auth])
 
 
 
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

     if (name === 'email') {
       if (!validateEmail(value) && !validatePhone(value)) {
         setWarnings((prev) => ({ ...prev, email: true }));
       } else {
         setWarnings((prev) => ({ ...prev, email: false }));
       }
     }
 
     if (name === 'password') {
       if (!(value.length >= 4 && value.length <= 60)) {
         setWarnings((prev) => ({ ...prev, password: true }));
       } else {
         setWarnings((prev) => ({ ...prev, password: false }));
       }
     }

   
   };
 
   const handleChange = (e) => {
     const { name, value } = e.target;
     setFormData((prev) => ({ ...prev, [name]: value }));
   };
 
   const handleFocus = (e) => {
     const { name } = e.target;
     setInputTouched((prev) => ({ ...prev, [name]: true }));
   };
   const handleSubmit = (e) => {
     e.preventDefault();
     // Handle login logic
     if(!formData.name){ handleBlur({target:{name:'name',value:formData.name}}); }
     if(!formData.email){ handleBlur({target:{name:'email',value:formData.email}}); }
     if(!formData.password){ handleBlur({target:{name:'password',value:formData.password}});}
     if(!formData.email || !formData.password || !formData.name){return}
     if(warnings.email || warnings.password || warnings.name) return 

     dispatch(signup(formData,()=>{
      navigate('/login')
     }));
     console.log('Login form submitted', formData);
   };
   return (
 
<>
    <div class="main">
        <nav>
            <span></span>
            <div>
                <select class="btn">
                    <option value="">English</option>
                </select>
                <a href="/login"><button class="btn btn-red-sm" >Sign In</button></a>
            </div>
        </nav>
        <div class="box">
        </div>
        <div class="hero">
            <span>Enjoy big movies, hit series and more from ₹149
            </span>
            <span>Join today, Cancel anytime</span>
            <span>Ready to watch? Enter your email to create or restart your membership
            </span>
        
            <div className="auth-wrapper" style={{backgroundImage:'unset',backgroundColor:'transparent',height:'100%'}}>
 
 <form className="login" onSubmit={handleSubmit}>
   <h1 class="login__title">Sign Up</h1>
 
   <div class="login__group">
   <div class="login__group__wrapper">
     <input class="login__group__wrapper__input" type="text" 
          name="name"
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        style={warnings.name ? { border: '1px solid #E50914' } : {}}/>
     
     <label class="login__group__wrapper__label" style={formData?.name?{ top: '15px',
              fontSize: '0.7rem'}:{}}>Name</label>
     </div>
        {warnings.name && (
               <div className="warning-input" id="warningName">
                 Please enter a  name.
               </div>
             )}
   </div>
   <div class="login__group">
   <div class="login__group__wrapper">
     <input class="login__group__wrapper__input" type="text" 
        name="email"
          onChange={handleChange}
          onFocus={handleFocus}
     
          onBlur={handleBlur}
        style={warnings.email ? { border: '1px solid #E50914' } : {}}/>
     
     <label class="login__group__wrapper__label" style={formData?.email?{ top: '15px',
              fontSize: '0.7rem'}:{}}>Email or mobile number</label>
     </div>
        {warnings.email && (
               <div className="warning-input" id="warningEmail">
                 Please enter a valid email or mobile number.
               </div>
             )}
   </div>

   <div class="login__group">
   <div class="login__group__wrapper">
   <input class="login__group__wrapper__input" type="password" 
          name="password"
         onChange={handleChange}  
         onFocus={handleFocus}
         onBlur={handleBlur}
        style={warnings.password ? { border: '1px solid #E50914' } : {}}/>
     <label class="login__group__wrapper__label"
      style={formData?.password?{ top: '15px',
        fontSize: '0.7rem'}:{}}>Password</label>
   </div>
     
     {warnings.password && (
               <div className="warning-input" id="warningPassword">
                 Your password must contain between 4 and 60 characters.
               </div>
             )}
   </div>

   <button class="login__sign-in" type="submit">Sign Up</button>
   <div class="login__secondary-cta"><span class="login__secondary-cta__text" >Already have account at Flixxit?</span><a class="login__secondary-cta__text login__secondary-cta__text--need-help" href="/login">Login.</a></div>
   </form>
 </div>
            
        </div>
        <div class="separation"></div>

    </div>

    <section class="first">
        <div>
            <span> Enjoy on your TV</span>
            <span>Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.</span>
        </div>
        <div class="sec-img"><img src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png"
                alt="" /><video
                src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/video-tv-in-0819.m4v"
                autoplay="loop" muted></video>
        </div>

    </section>
    <div class="separation"></div>

    <section class="first second">
        <div class="sec-img"><img
                src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/mobile-0819.jpg" alt="" />
        </div>
        <div>

            <span>Download your shows to watch offline</span>
            <span>Save your favourites easily and always have something to watch.</span>
        </div>

    </section>

    <div class="separation"></div>

    <section class="first third">
        <div>
            <span>Watch everywhere</span>
            <span>Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.</span>
        </div>
        <div class="sec-img"><img
                src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/device-pile-in.png"
                alt="" /><video src="./assets/videos/video1.m4v" autoplay="loop" muted></video>
        </div>
    </section>
    <div class="separation"></div>

    <section class="first forth">
        <div class="sec-img"><img
                src="https://occ-0-6335-3647.1.nflxso.net/dnm/api/v6/19OhWN2dO19C9txTON9tvTFtefw/AAAABVr8nYuAg0xDpXDv0VI9HUoH7r2aGp4TKRCsKNQrMwxzTtr-NlwOHeS8bCI2oeZddmu3nMYr3j9MjYhHyjBASb1FaOGYZNYvPBCL.png?r=54d"
                alt="" />
        </div>
        <div>
            <span>Create profiles for kids</span>
            <span>Send children on adventures with their favourite characters in a space made just for them—free with
                your membership.</span>
        </div>

    </section>
    <div class="separation"></div>

    <section class="faq">
        <h2>Frequently Asked Questions</h2>
        <div class="faq-box">
            <li>
                <span>What is Flixxit?</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" color="#fff"
                    fill="none">
                    <path d="M12 4V20M20 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </li>
            <li>
                <span>How much does Flixxit cost?</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" color="#fff"
                    fill="none">
                    <path d="M12 4V20M20 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </li>
            <li>
                <span>Where can I watch?</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" color="#fff"
                    fill="none">
                    <path d="M12 4V20M20 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </li>
            <li>
                <span>How do i cancel?</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" color="#fff"
                    fill="none">
                    <path d="M12 4V20M20 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </li>
            <li>
                <span>What can I watch on Flixxit?</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" color="#fff"
                    fill="none">
                    <path d="M12 4V20M20 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </li>
            <li>
                <span>Is Flixxit good for kids?</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" color="#fff"
                    fill="none">
                    <path d="M12 4V20M20 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </li>
        </div>
    
            
    </section>
    <div class="separation"></div>


 
 

 </>
 
   );
 };

export default Signup