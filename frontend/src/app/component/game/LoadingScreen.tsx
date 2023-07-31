import { UserData } from "@/store/useUserStore";
import Image from "next/image";

interface LoadingScreenProps {
    player1User: UserData;
    player2User: UserData;
}

const LoadingScreen = ({ player1User, player2User} : LoadingScreenProps ) => {
    return (
        <div className="loading-container absolute top-20 w-4/5 h-3/5 left-1/2 transform -translate-x-1/2">
            <div className="flex justify-between bg-black p-4 rounded-lg h-full">
                <div className="flex flex-col items-center justify-top">
                    <p className="text-white">Player 1: {player1User?.username}</p>
                    <Image
                    className="transform hover:scale-125 object-cover rounded-full"
                    src={player1User?.avatar || ""}
                    alt="user avatar"
                    width={150}
                    height={150}
                    />
                 </div>
                <div className="flex flex-col items-center justify-center">
                    <p className="text-white text-4xl font-bold">VS</p>
                </div>
                <div className="flex flex-col items-center justify-end">
                    <p className="text-white">Player 2: {player2User?.username}</p>
                    <Image
                        className="transform hover:scale-125 object-cover rounded-full"
                        src={player2User?.avatar || ""}
                        alt="user avatar"
                        width={150}
                        height={150}
                    />
                </div>
            </div>
        </div>
      );
}

export default LoadingScreen;
