import React, {createContext, useContext, useEffect, useState} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user , setUser] = useState(null);
    const [ isAuthenticated, setIsAuthenticated ] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token){
            const role = localStorage.getItem('role');
            const userId = localStorage.getItem('user');
            setUser({id: userId, role: role});
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = (responseData)=>{
        localStorage.setItem('accessToken', responseData.data.accessToken);
        localStorage.setItem('refresh', responseData.data.refreshToken);
        localStorage.setItem('role', responseData.data.role);
        localStorage.setItem('user', responseData.data.id); // Store actual user ID
        localStorage.setItem('userName', responseData.data.name);
        setUser({id: responseData.data.id, role: responseData.data.role}); // Set user object correctly
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
    };

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth=()=>{
    return useContext(AuthContext);
};