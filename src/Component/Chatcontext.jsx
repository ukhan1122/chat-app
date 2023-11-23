import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [users, setUser] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [userData, setUserData] = useState({
    messages: {},
    timestamps: {},
    fileURLs: {},
  });

  const setMessagesForUser = (userId, userMessages) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      messages: {
        ...prevUserData.messages,
        [userId]: [...(prevUserData.messages[userId] || []), ...userMessages],
      },
    }));
  };

  const setTimestampsForUser = (userId, userTimestamps) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      timestamps: {
        ...prevUserData.timestamps,
        [userId]: userTimestamps,
      },
    }));
  };

  const setFileURLForUser = (userId, userFileURLs) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      fileURLs: {
        ...prevUserData.fileURLs,
        [userId]: userFileURLs,
      },
    }));
  };

  return (
    <SearchContext.Provider
      value={{
        selectedUsers,
        setSelectedUsers,
        setMessagesForUser,
        setTimestampsForUser,
        setFileURLForUser,
        setUser,
        users,
        searchResults,
        setSearchResults,
        ...userData,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};
