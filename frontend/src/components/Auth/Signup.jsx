import React, { useState } from 'react';

const Signup = ({ onSignup, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3001/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();


            if (!response.ok) {
                throw new Error(data.message || 'Signup failed.');
            }
            // 회원가입 성공 시 토큰과 사용자 정보를 로컬 스토리지에 저장
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            onSignup(data.user);

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-5 relative overflow-hidden">
            {/* Floating background effects */}
            <div className="absolute w-[500px] h-[500px] bg-gradient-radial from-pink-300/30 to-transparent -top-[250px] -left-[250px] animate-float" />
            <div className="absolute w-[400px] h-[400px] bg-gradient-radial from-purple-400/30 to-transparent -bottom-[200px] -right-[200px] animate-float-reverse" />

            <div className="w-full max-w-[480px] bg-white/10 backdrop-blur-[30px] backdrop-saturate-[180%] rounded-[30px] p-12 shadow-[0_8px_32px_rgba(31,38,135,0.37)] border border-white/20 relative z-10 animate-glow">
                <h2 className="m-0 mb-10 text-4xl font-black bg-gradient-to-r from-white via-pink-300 to-red-400 bg-clip-text text-transparent text-center tracking-tight">
                    Sign Up
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="username" className="block mb-2.5 text-sm font-bold text-white/90 uppercase tracking-wider">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            disabled={isLoading}
                            className="w-full px-5 py-4 border-2 border-white/20 rounded-2xl text-base transition-all duration-300 bg-white/10 text-white font-medium placeholder:text-white/50 focus:outline-none focus:border-pink-300 focus:bg-white/15 focus:shadow-[0_0_25px_rgba(240,147,251,0.5)] focus:-translate-y-0.5 disabled:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="email" className="block mb-2.5 text-sm font-bold text-white/90 uppercase tracking-wider">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            disabled={isLoading}
                            className="w-full px-5 py-4 border-2 border-white/20 rounded-2xl text-base transition-all duration-300 bg-white/10 text-white font-medium placeholder:text-white/50 focus:outline-none focus:border-pink-300 focus:bg-white/15 focus:shadow-[0_0_25px_rgba(240,147,251,0.5)] focus:-translate-y-0.5 disabled:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-2.5 text-sm font-bold text-white/90 uppercase tracking-wider">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password (min 6 characters)"
                            disabled={isLoading}
                            className="w-full px-5 py-4 border-2 border-white/20 rounded-2xl text-base transition-all duration-300 bg-white/10 text-white font-medium placeholder:text-white/50 focus:outline-none focus:border-pink-300 focus:bg-white/15 focus:shadow-[0_0_25px_rgba(240,147,251,0.5)] focus:-translate-y-0.5 disabled:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block mb-2.5 text-sm font-bold text-white/90 uppercase tracking-wider">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter password"
                            disabled={isLoading}
                            className="w-full px-5 py-4 border-2 border-white/20 rounded-2xl text-base transition-all duration-300 bg-white/10 text-white font-medium placeholder:text-white/50 focus:outline-none focus:border-pink-300 focus:bg-white/15 focus:shadow-[0_0_25px_rgba(240,147,251,0.5)] focus:-translate-y-0.5 disabled:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                    </div>
                    {error && (
                        <div className="my-5 px-5 py-4 bg-red-400/20 text-red-200 rounded-2xl text-sm text-center border border-red-400/30 backdrop-blur-[10px] font-semibold">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-pink-300 to-red-400 bg-[length:200%_200%] text-white border-none rounded-full text-base font-extrabold cursor-pointer transition-all duration-500 mt-2.5 shadow-[0_10px_40px_rgba(245,87,108,0.5)] relative overflow-hidden uppercase tracking-[2px] hover:enabled:-translate-y-1 hover:enabled:scale-105 hover:enabled:shadow-[0_15px_50px_rgba(245,87,108,0.7)] disabled:bg-white/20 disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-60 before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-[left] before:duration-600 hover:before:left-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                <div className="mt-8 text-center text-white/80 text-base font-medium">
                    Already have an account?{' '}
                    <button
                        onClick={onSwitchToLogin}
                        className="bg-none border-none text-pink-300 font-extrabold cursor-pointer px-1 text-base transition-all duration-300 hover:text-red-400 hover:scale-110"
                        style={{ textShadow: '0 0 10px rgba(240, 147, 251, 0.5)' }}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
