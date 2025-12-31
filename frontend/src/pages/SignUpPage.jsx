import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/authUser";

const SignUpPage = () => {
    const { searchParams } = new URL(document.location);
    const emailValue = searchParams.get("email")
    const [email, setEmail] = useState(emailValue || "");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const { signup } = useAuthStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        signup({ email, password, username });
    };

    return (
        <div className="h-screen w-full hero-bg">
            <header className="max-w-6xl mx-auto flex items-center justify-between p-4">
                <Link to="/">
                    <img src="/netflix-logo.png" alt="Netflix Logo" className="w-52" />
                </Link>
            </header>

            <div className="flex justify-center items-center mt-20 mx-4"> {/* Changed mx-20 → mx-4 for better mobile responsiveness */}
                <div className="w-full max-w-md p-8 space-y-8 bg-black/60 rounded-lg shadow-md"> {/* Fixed: classname → className, increased padding */}
                    <h1 className="text-center text-white text-3xl font-bold mb-8">
                        Sign Up
                    </h1>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-gray-300 block">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                id="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required // Good practice for forms
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="text-sm font-medium text-gray-300 block">
                                Username
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                id="username"
                                placeholder="johndoe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-gray-300 block">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                id="password"
                                placeholder="•••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit" // Explicitly set type
                            className="w-full py-3 bg-red-600 hover:bg-red-700 font-semibold text-white rounded-md transition duration-200"
                        >
                            Sign Up
                        </button>
                    </form>

                    <div className="text-center text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-red-500 hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;