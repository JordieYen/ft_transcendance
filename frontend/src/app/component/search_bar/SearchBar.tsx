import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface SearchBarProps {
  onSearch: (searchQuery: string) => void;
  onReset: () => void;
}

const SearchBar = ({ onSearch, onReset }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handlePress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("searchQuery", searchQuery);
      if (searchQuery === "") {
        onReset();
      } else {
        onSearch(searchQuery);
      }
    }
  };

  const handleSearch = () => {
    if (searchQuery === "") {
      onReset();
    } else if (searchQuery !== "") {
      onSearch(searchQuery);
    }
  };

  // return (
  //   <div className="friend-search-bar flex justify-center mb-2 sm:pt-4 md:pt-4 lg:pt-0">
  //     <div className="flex items-center">
  //       <input
  //         type="text"
  //         className="px-4 py-2 rounded border border-gray-300 w-60 text-base overflow-ellipsis"
  //         placeholder="Search username..."
  //         value={searchQuery}
  //         onChange={(e) => setSearchQuery(e.target.value)}
  //         onKeyDown={handlePress}
  //       />
  //       <FontAwesomeIcon
  //         icon={faSearch}
  //         className="text-gray-500 cursor-pointer"
  //         onClick={handleSearch}
  //       />
  //     </div>
  //   </div>
  // );

  // return (
  //   <div className="friend-search-bar flex justify-center mb-2 sm:pt-4 md:pt-4 lg:pt-0">
  //     <div className="rounded-md shadow-sm flex items-center">
  //       <input
  //         type="text"
  //         className="block w-full py-2 pr-10 px-4 sm:text-sm sm:leading-5 rounded-m border-gray-300 placeholder-gray-500 text-center"
  //         placeholder="Search username..."
  //         value={searchQuery}
  //         onChange={(e) => setSearchQuery(e.target.value)}
  //         onKeyDown={handlePress}
  //       />
  //       <FontAwesomeIcon
  //         icon={faSearch}
  //         className="h-5 w-5 cursor-pointer  text-myyellow ml-3"
  //         onClick={handleSearch}
  //       />
  //     </div>
  //   </div>
  // );
  return (
    <div className="friend-search-bar flex justify-center mb-2 sm:pt-4 md:pt-4 lg:pt-0">
      <div className="rounded-lg shadow-sm flex items-center">
        <input
          type="text"
          className="block w-full py-2 pr-10 pl-4 sm:text-sm sm:leading-5 rounded-m border rounded-lg border-gray-300 placeholder-gray-500 text-center bg-gray-100 focus:outline-none hover:scale-105"
          placeholder="Search username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handlePress}
        />
          <FontAwesomeIcon
            icon={faSearch}
            className="h-5 w-5 cursor-pointer text-timberwolf ml-3"
            onClick={handleSearch}
          />
      </div>
    </div>
  );
};

export default SearchBar;
