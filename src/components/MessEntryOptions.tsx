import { Link } from "react-router-dom";

const MessEntryOptions = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1f0036] to-[#3c006f] px-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl w-full max-w-md p-8 md:p-12 space-y-6 text-white">
                {/* <div className="flex flex-col items-center">
                    <div className="bg-gradient-to-tr from-purple-500 to-blue-500 p-3 rounded-full">
                        <span className="text-white font-bold text-xl">Mess Manager</span>
                    </div>
                </div> */}

                <div className="flex flex-col md:flex-row gap-4">
                    <Link
                        to="/create-mess"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-center font-semibold py-2 rounded-full transition"
                    >
                        Create Mess
                    </Link>

                    <Link
                        to="/join-mess"
                        className="w-full bg-green-500 hover:bg-green-600 text-white text-center font-semibold py-2 rounded-full transition"
                    >
                        Join Mess
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MessEntryOptions;
