import { useState } from "react";
import Image from "next/image";

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

  return (
    <div className="search-bar flex justify-center mb-2">
      <div className="relative">
        <div>
          <input
            type="text"
            className="px-4 py-2 pr-10 rounded border border-gray-300 w-60 text-base overflow-ellipsis"
            placeholder="Search username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handlePress}
          />
        </div>
        <div className="absolute inset-y-0 right-0 px-3 flex items-center">
          <Image
            className="h-5 w-5 text-gray-500 ml-2"
            src="/search.png"
            alt="search"
            width={40}
            height={40}
            onClick={handleSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
