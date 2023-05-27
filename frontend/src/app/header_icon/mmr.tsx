import React from "react";

const Mmr:React.FC< { mmr: number } > = ({ mmr }) => {
    return (
        <div className="mmr-container">
            <img className="trophy-icon" src="trophy.png" alt="trophy" />
            <span className="mmr-number">{ mmr }</span>
        </div>
    );
}

export default Mmr;
