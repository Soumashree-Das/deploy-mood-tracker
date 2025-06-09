// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { createContext } from "react";

// const authConext = createContext();

// export const AuthProvider = ({children}) => {
//     const [authState,setAuthState] = useState({
//         token:null,
// import React, { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [authState, setAuthState] = useState({
//         token: null,
//         user: null,
//         isAuthenticated: false
//     });
//     const navigate = useNavigate();

//     // Initialize auth state from localStorage
//     // useEffect(() => {
//     //     const token = localStorage.getItem('token');
//     //     const user = localStorage.getItem('user');

//     //     if (token && user) {
//     //         setAuthState({
//     //             token,
//     //             user: JSON.parse(user),
//     //             isAuthenticated: true
//     //         });
//     //     }
//     // }, []);
//     useEffect(() => {
//     const token = localStorage.getItem('token');
//     const user = localStorage.getItem('user');

//     console.log("Retrieved from localStorage:", { token, user });

//     if (token && user) {
//         try {
//             const parsedUser = JSON.parse(user);
//             if (!parsedUser._id) {
//                 console.warn("Parsed user is missing _id:", parsedUser);
//             }

//             setAuthState({
//                 token,
//                 user: parsedUser,
//                 isAuthenticated: true
//             });
//         } catch (e) {
//             console.error("Failed to parse user from localStorage", e);
//         }
//     }
// }, []);


//     const login = (token, user) => {
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify(user));
//         setAuthState({
//             token,
//             user,
//             isAuthenticated: true
//         });
//     };

//     const logout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         setAuthState({
//             token: null,
//             user: null,
//             isAuthenticated: false
//         });
//         navigate('/login');
//     };

//     return (
//         <AuthContext.Provider value={{ ...authState, login, logout,setAuthState}}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => React.useContext(AuthContext);    

import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: null,
        user: null,
        isAuthenticated: false
    });
    const navigate = useNavigate();

    // Initialize auth state from localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        // console.log("Retrieved from localStorage:", { token, user });

        if (token && user) {
            try {
                const parsedUser = JSON.parse(user);
                if (!parsedUser._id) {
                    console.warn("Parsed user is missing _id:", parsedUser);
                }

                setAuthState({
                    token,
                    user: parsedUser,
                    isAuthenticated: true
                });
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
            }
        }
    }, []);

    const login = (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setAuthState({
            token,
            user,
            isAuthenticated: true
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState({
            token: null,
            user: null,
            isAuthenticated: false
        });
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ 
            ...authState, 
            login, 
            logout, 
            setAuthState,
            token: authState.token // Make sure token is explicitly available
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);