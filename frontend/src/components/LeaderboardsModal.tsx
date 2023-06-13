import React, { useState, useEffect, RefObject } from "react";
import toast from "react-hot-toast";

interface LeaderboardsModalProps {
  isOpen: boolean;
  closeModal: () => void;
  accRef: RefObject<HTMLDivElement>;
}

const LeaderboardsModal = ({
  isOpen,
  closeModal,
  accRef,
}: LeaderboardsModalProps) => {
  return (
    <div>
      {isOpen && (
        <div className="overlay fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/75">
          <div
            className="overlay-content w-[1300px] h-[680px] bg-onyxgrey rounded-3xl py-6 px-8 gap-3"
            ref={accRef}
          >
            <h2>
              <p className="text-3xl text-timberwolf">All time leaderboards</p>
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardsModal;
