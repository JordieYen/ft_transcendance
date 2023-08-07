import { useState } from "react";
import "../chat/ChatBox.css";


interface ChooseGameModeProps {
    onSelectGameMode: (gameMode: string) => void;
    isMatchmaking: boolean;
}

const ChooseGameMode = ({ onSelectGameMode, isMatchmaking }: ChooseGameModeProps) => {
    const [selectedGameMode, setSelectedGameMode] = useState<string>("classic");

    const handleGameMode = () => {
        console.log('ismatch', isMatchmaking);
        if (!isMatchmaking) {
            const newGameMode = selectedGameMode === "classic" ? "custom" : "classic";
            setSelectedGameMode(newGameMode);
            onSelectGameMode(newGameMode);
        }
    }

    return (
        <>
            <button className="bottom-nav-buttons px-2 py-2" onClick={handleGameMode} disabled={isMatchmaking}>
            { selectedGameMode }
            
            </button>
        </>

    
  );
};

export default ChooseGameMode;
