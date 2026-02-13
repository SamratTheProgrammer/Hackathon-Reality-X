import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { dark } from "@clerk/themes";

export const Signup = () => {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-md relative z-10 flex flex-col items-center">
                <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors self-start">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-8">Join Reality-X</h1>

                <SignUp
                    signInUrl="/login"
                    forceRedirectUrl="/dashboard"
                    appearance={{
                        baseTheme: dark,
                        elements: {
                            rootBox: "w-full",
                            card: "bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl w-full",
                            headerTitle: "hidden",
                            headerSubtitle: "hidden",
                            socialButtonsBlockButton: "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white",
                            formFieldInput: "bg-zinc-950 border-zinc-800 text-white",
                            formButtonPrimary: "bg-green-500 hover:bg-green-400 text-black",
                            footerActionLink: "text-green-500 hover:text-green-400"
                        }
                    }}
                />
            </div>
        </div>
    );
};
