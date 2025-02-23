"use client"

import Link from "next/link";
import { useState } from "react"
import {post} from "../api/api"

interface User{
    name:string;
    email:string;
    password:string;
}

export default function Register() {  // Capitalized for React component naming convention
    const [user, setUser] = useState<User>({
        name: "",
        email: "",
        password: "" 
    })
    const [error, setError] = useState("")
    const [success , setSuccess] = useState("")
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const response = await post(`/users/register`, user);
            if(response.status === 200){
                setSuccess("Account created successfully")
            }
        } catch (error:any) {
            setError(error.response?.data?.message || error.message);
        }
    }

    return (
        <>
            {success &&<p className="text-green-500">{success}</p>}
            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit}>  
                <input 
                    type="text" 
                    placeholder="Name"
                    value={user.name}
                    onChange={(e) => setUser({...user, name: e.target.value})} 
                    className="w-full p-2 border text-black rounded mb-5"
                />

                <input 
                    type="email"  
                    placeholder="Email"
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})} 
                    className="w-full p-2 border text-black rounded mb-5"
                />

                <input 
                    type="password" 
                    placeholder="Password"
                    value={user.password}
                    onChange={(e) => setUser({...user, password: e.target.value})} 
                    className="w-full p-2 border text-black rounded"
                />

                <button type="submit" className="w-full bg-red-500 text-white py-2 rounded">
                    Sign In
                </button>
                
                
                <p className="text-black">Don't have an Account?</p>
                <Link href="/login" className="text-red-500">Login</Link>
            </form>
        </>
    )
}