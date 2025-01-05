import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { login,signup } from "../../store/actions";
import "./style.scss";
const Login = () => {
  const [userData,setuserData]=useState({
       email:"",
       password:"",
       name:""
   })
 
     const [formData, setFormData] = useState({ email: '', password: '' });
     const [warnings, setWarnings] = useState({ email: false, password: false });
     const [inputTouched, setInputTouched] = useState({ email: false, password: false });
     const validateEmail = (email) => {
       const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       return re.test(String(email).toLowerCase());
     };
   
     const validatePhone = (phone) => {
       const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
       return re.test(String(phone).toLowerCase());
     };
  
   const auth=useSelector((state)=>state.state.auth);
   console.log("authhh",auth)
 
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
     const { name, value } = e?.target;
     setFormData((prev) => ({ ...prev, [name]: value }));
   };
 
   const handleFocus = (e) => {
     const { name } = e.target;
     setInputTouched((prev) => ({ ...prev, [name]: true }));
   };
   const handleSubmit = (e) => {
     e.preventDefault();
 
   if(!formData.email){ handleBlur({target:{name:'email',value:formData.email}}); }
    if(!formData.password){ handleBlur({target:{name:'password',value:formData.password}});}
    if(!formData.email || !formData.password){return}
    if(warnings.email || warnings.password ) return 

     
      dispatch(login(formData));
     // Handle login logic
     console.log('Login form submitted', formData);
   };
   return (
 
 
 
 <div className="auth-wrapper">
 
 <form className="login" onSubmit={handleSubmit}>
   <h1 class="login__title">Sign In</h1>
 
   <div class="login__group">
   <div class="login__group__wrapper">
     <input class="login__group__wrapper__input" type="text" 
        name="email"
          onChange={handleChange}
          onFocus={handleFocus}
     
          onBlur={handleBlur}
        style={warnings.email ? { border: '1px solid #E50914' } : {}}/>
     
     <label class="login__group__wrapper__label" style={formData?.email?{ top: '15px',
              fontSize: '0.7rem'}:{}}>Email or phone number</label>
     </div>
        {warnings.email && (
               <div className="warning-input" id="warningEmail">
                 Please enter a valid email or phone number.
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

   <button class="login__sign-in" type="submit">Sign In</button>
   <div class="login__secondary-cta"><span class="login__secondary-cta__text" >New to Flixxit</span><a class="login__secondary-cta__text login__secondary-cta__text--need-help" href="/sign-up">Sign up now.</a></div>
   </form>
 </div>
 
   );
 };

export default Login;
