"use client"

import { useRouter } from 'next/navigation'
import { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';

export default  function WithAuth(WrappedComponent){

  return function AuthenticatedComponent(props) {
    
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [cookies, setCookie] = useCookies(['access_token']);
    
    useEffect(() => {
      console.log(cookies, 'cookies')
      const checkAuth = () => {
        const token = cookies.access_token
        if (!token) {
          // No token found, redirect to login
          router.replace('/auth');
          return;
        }
        
        // Token exists, user is authenticated
        setAuthenticated(true);
        setIsLoading(false);
      };

      // Check authentication after component mounts
      checkAuth();
    }, [router]);

    // Show loading spinner while checking authentication
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking authentication...</p>
          </div>
        </div>
      );
    }

    // If not authenticated, don't render the component (redirect will happen)
    // if (!authenticated) {
    //   return null;
    // }

    // User is authenticated, render the protected component
    return <WrappedComponent {...props} />;
  };
};