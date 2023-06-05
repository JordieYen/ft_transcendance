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
            
            // if (searchQuery === '') {
            //     onReset();
            // } else {
            //     try {
            //         const response = await fetch(`http://localhost:3000/users/username/${searchQuery}`);
            //         if (response.ok) {
            //             const userData = await response.json();
            //             console.log('userData', userData);
            //             onSearch(userData);
            //         } else {
            //             throw new Error('User not found');
            //         }
            //     } catch (error) {
            //         console.log('Error fetching user data:', error);
            //     }
            // }
        }
    };

    return (
        <div className="search-bar flex justify-center mb-10">
            <input type="text"
            placeholder="Search by username"
            value={ searchQuery } 
            onChange={ e => setSearchQuery(e.target.value)}
            onKeyDown={ handlePress } />
        </div>
    );
};

export default SearchBar;
