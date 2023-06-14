import React from "react";

const Mmr:React.FC< { mmr: number } > = ({ mmr }) => {
    return (
        <span className='mmr-container icon-container'>
            <img className="trophy-icon transform hover:scale-125" src="trophy.png" alt="trophy" />
            <span className="mmr-number">{ mmr }</span>
        </span>
    );
}

export default Mmr;
