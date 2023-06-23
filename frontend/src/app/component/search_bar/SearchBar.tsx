import { useState } from "react";

interface SearchBarProps {
    onSearch: (searchQuery: string) => void;
    onReset: () => void;
}

const SearchBar = ( { onSearch, onReset } : SearchBarProps ) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handlePress =  (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            console.log('searchQuery', searchQuery);
            if (searchQuery === "") {
                onReset();
            } else {
                onSearch(searchQuery);
            }
        }
    };

    return (
        <div className="search-bar flex justify-center mb-2">
            <input type="text"
            placeholder="Search by username"
            value={ searchQuery } 
            onChange={ e => setSearchQuery(e.target.value)}
            onKeyDown={ handlePress } />
        </div>
    );
};

export default SearchBar;
