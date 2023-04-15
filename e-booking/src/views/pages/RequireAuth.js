import React from 'react'
import {useLocation,Navigate, Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';


function RequireAuth() {
    const isAuth= useSelector(state.auth.isAuth);
    const location= useLocation();

  return (
    isAuth ? 
    <Outlet/> : 
    <Navigate to='/login' state={from : location} replace/>
   
  )
}

export default RequireAuth