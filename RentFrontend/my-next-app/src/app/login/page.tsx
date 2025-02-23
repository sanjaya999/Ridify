"use client"

import { useState } from "react";
import Link from "next/link";

export default function login(){

    const [credentials, setCredentials] = useState({
        email:"",
        password:""
    });
    const [error , setError] = useState("");

    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        setError("");


    }
    
    return(
        <>
       <form >
        <input type="text" onSubmit={handleSubmit} placeholder="Email"
        value={credentials.email}
        onChange={(e)=>setCredentials({...credentials , email: e.target.value})} 
        className="w-full p-2 border rounded mb-5"/>

        <input type="password" placeholder="Password"
        value={credentials.password}
        onChange={(e)=>setCredentials({...credentials , password: e.target.value})} 
        className="w-full p-2 border rounded"/>

       <button type="submit" className="w-full bg-red-500 text-white py-2 rounded" >
        Sign In
       </button>
       <p className="text-black">Dont have an Account ?</p>
       
       <Link href="/register" className="text-red-500">Register</Link>
       </form>

        </>
    )
}

