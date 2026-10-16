import React from 'react'
import {  useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

function AdminProtected() {
    const {isAuthenticated, role} = useSelector((state)=> state.auth)
    if(!isAuthenticated){
        return <Navigate to="/login" replace/>
    }

    if(role !== "admin"){
        return <Navigate to="/dashboard" replace/>
    }

    return <Outlet/>
}

export default AdminProtected
