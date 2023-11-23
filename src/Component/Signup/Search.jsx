import React, { useState, useEffect, useContext } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import './Search.css';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { useSearchContext } from '../Chatcontext';
import { AuthContext } from '../Auth';

const db = getFirestore();

const Search = () => {
  const { loginuser } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    setSearchResults,
    selectedUsers,
    setSelectedUsers,
    setUser,
    searchResults,
  } = useSearchContext();

  // Load localselectedusers from localStorage on component mount
  const initialLocalselectedusers = JSON.parse(localStorage.getItem(`localselectedusers_${loginuser?.uid}`)) || [];
  const [localselectedusers, setLocalselectedusers] = useState(initialLocalselectedusers);

  useEffect(() => {
    // Save localselectedusers to localStorage whenever it changes
    localStorage.setItem(`localselectedusers_${loginuser?.uid}`, JSON.stringify(localselectedusers));
  }, [localselectedusers, loginuser]);

  const searchUsers = async (searchQuery) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('name', '>=', searchQuery), where('name', '<=', searchQuery + '\uf8ff'));
  
    const querySnapshot = await getDocs(q);
  
    const users = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      // Only include users where the searchQuery matches the name
      if (userData.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        users.push(userData);
      }
    });
  
    return users;
  };
  

  const handleSearch = async (query) => {
    if (query.trim() !== '') {
      const results = await searchUsers(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUsers(user);

    // Check if the clicked user is already in localselectedusers
    if (!localselectedusers.some(selectedUser => selectedUser.uid === user.uid)) {
     
  // Update localselectedusers and reverse the order
  setLocalselectedusers(prevUsers => [...prevUsers, user].reverse());
      setUser(user);
    }

    setSearchResults([]); // Clear search results
    setSearchQuery(''); // Clear the search query after selecting a user
    
  };
  useEffect(() => {
    document.getElementById("search-input").value = "";
  }, [searchQuery]);
  
  const clearSelectedUser = (index) => {
    const updatedUsers = [...localselectedusers];
    updatedUsers.splice(index, 1);
    setLocalselectedusers(updatedUsers);
  };
// Function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
  const clearAll = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div>
      <div>
        
          

<div className="search-container">
  <div className="search-bar">
    <SearchIcon
      className="search-icon"
      style={{
        color: '#555',
        marginRight: '10px',
      }}
    />
  <TextField  
  
  id="search-input"
  className="text-field"
  placeholder="Search..."
  variant="standard"
  value={searchQuery}
  onChange={(e) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  }}
 
/>

    {searchQuery && (
      <ClearIcon
        className="clear-icon"
        style={{
          cursor: 'pointer',
          color: '#555',
        }}
        onClick={clearAll}
      />
    )}
  </div>

  {/* ... (other JSX code) */}
</div>

      </div>

      {searchResults.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          <ul className="user-profile-search">
            {searchResults.map((user,index) => (
              <li key={user.uid} onClick={() => handleUserClick(user)}>
                <div className="user-image">
                  <img src={user.photoURL} alt={`Profile of ${user.name}`} />
                </div>
                <div className="user-name">{user.name}</div> 
                <div className="clear-user" onClick={() => clearSelectedUser(index)}>
      <ClearIcon />
    </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {localselectedusers.length > 0 && (
        <div>
          <ul className="user-profile-list">
          {localselectedusers.map((selectedUser, index) => (
  <li key={index} onClick={() => handleUserClick(selectedUser)}>
    <div className="user-image">
      <img src={selectedUser.photoURL} alt={`Profile of  ${capitalizeFirstLetter(selectedUser.name)}`} />
    </div>
    <div className="user-name">{capitalizeFirstLetter(selectedUser.name)}</div>
    <div className="clear-user" onClick={() => clearSelectedUser(index)}>
      <ClearIcon />
    </div>
  </li>
))}

          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
