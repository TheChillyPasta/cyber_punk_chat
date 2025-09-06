"use client"

import React, { useState , useEffect} from 'react';
import { Eye, EyeOff, MessageCircle, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation'


// Navigation utility (simulates React Router)
const navigateTo = (path) => {
  // In a real app, you'd use React Router's useNavigate or history.push
  console.log(`Navigating to: ${path}`);
  // For demo purposes, we'll show an alert
  alert(`Navigation: Redirecting to ${path}`);
};

const WhatsAppAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: ''
  });

  const [cookies, setCookie] = useCookies( ['auth_token'] );
  const router = useRouter();

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!isLogin && !formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 1) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    console.log('hey', process.env['VITE_API_URL'])

  const handleSubmit = async () => {
    
    if (!validateForm()) return;
    setIsLoading(true);
    setMessage('');
    
    try {
       const endpoint = process.env.VITE_API_URL + (isLogin ? '/api/accounts/login/' : '/api/accounts/register/');
      const requestBody = isLogin 
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, name: formData.name, password: formData.password };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (isLogin) {
          // Store access token in cookies for 1 day
          if (data.access) {
            setCookie('access_token', data.access);
            setCookie('email', requestBody.email)
            setMessage('Login successful! Redirecting to home...');
            
            // Navigate to home after a short delay
            setTimeout(() => {
                router.replace('/')
                // navigateTo('/home');

            }, 1500);
          } else {
            setMessage('Login successful but no access token received.');
          }
        } else {
          // Registration successful - navigate to login
          setMessage('Registration successful! Redirecting to login...');
          setTimeout(() => {
            setIsLogin(true);
            setFormData({ email: formData.email, name: '', password: '' });
            setMessage('');
          }, 1500);
        }
      } else {
        setMessage(data.message || `${isLogin ? 'Login' : 'Registration'} failed. Please try again.`);
      }
    } catch (error) {
      setMessage('Network error. Please check your connection and try again.');
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', name: '', password: '' });
    setErrors({});
    setMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{ backgroundColor: 'rgba(17, 27, 33, 1)' }}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" 
             style={{ 
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
             }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
               style={{ backgroundColor: 'rgb(134, 150, 160)' }}>
            <MessageCircle className="w-8 h-8" style={{ color: 'rgba(17, 27, 33, 1)' }} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'rgba(255,255,255, 0.8)' }}>
            Welcome to WhatsApp
          </h1>
          <p className="text-lg" style={{ color: 'rgb(134, 150, 160)' }}>
            {isLogin ? 'Sign in to continue' : 'Create your account'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="backdrop-blur-lg rounded-3xl p-8 shadow-2xl border"
             style={{ 
               backgroundColor: 'rgba(255,255,255, 0.1)',
               borderColor: 'rgba(134, 150, 160, 0.2)'
             }}>
          
          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: 'rgba(255,255,255, 0.8)' }}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5" style={{ color: 'rgb(134, 150, 160)' }} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 focus:ring-2 transition-all duration-200 placeholder-opacity-60"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255, 0.1)',
                    color: 'rgba(255,255,255, 0.8)',
                    focusRingColor: 'rgb(134, 150, 160)'
                  }}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Name Field (Signup only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: 'rgba(255,255,255, 0.8)' }}>
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5" style={{ color: 'rgb(134, 150, 160)' }} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 focus:ring-2 transition-all duration-200 placeholder-opacity-60"
                    style={{ 
                      backgroundColor: 'rgba(255,255,255, 0.1)',
                      color: 'rgba(255,255,255, 0.8)',
                      focusRingColor: 'rgb(134, 150, 160)'
                    }}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-400">{errors.name}</p>
                )}
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: 'rgba(255,255,255, 0.8)' }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" style={{ color: 'rgb(134, 150, 160)' }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border-0 focus:ring-2 transition-all duration-200 placeholder-opacity-60"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255, 0.1)',
                    color: 'rgba(255,255,255, 0.8)',
                    focusRingColor: 'rgb(134, 150, 160)'
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" style={{ color: 'rgb(134, 150, 160)' }} />
                  ) : (
                    <Eye className="h-5 w-5" style={{ color: 'rgb(134, 150, 160)' }} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-2xl text-sm ${
                message.includes('successful') 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ 
                backgroundColor: 'rgb(134, 150, 160)',
                color: 'rgba(17, 27, 33, 1)'
              }}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Toggle Auth Mode */}
          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: 'rgb(134, 150, 160)' }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={toggleAuthMode}
              className="mt-2 text-sm font-semibold hover:underline transition-all duration-200"
              style={{ color: 'rgba(255,255,255, 0.8)' }}
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs" style={{ color: 'rgb(134, 150, 160)' }}>
            By continuing, you agree to WhatsApp's Terms of Service and Privacy Policy
          </p>
          
          {/* Demo Info */}
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(134, 150, 160, 0.1)' }}>
            <p className="text-xs" style={{ color: 'rgb(134, 150, 160)' }}>
              <strong>Demo Info:</strong> After login, access token will be stored in cookies for 1 day.
              After registration, you'll be redirected to login page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppAuth;