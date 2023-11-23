import React, { useEffect, useState } from 'react';
import { useSearchContext } from './Chatcontext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { auth } from './Signup/Firebas';
import './Messagedisplay.css';
import { Photo } from '@mui/icons-material';

const Messagedisplay = () => {
  const { selectedUsers, setFileURLForUser } = useSearchContext();
  const [userMessages, setUserMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = () => {
      if (selectedUsers && selectedUsers.uid) {
        const db = getFirestore();
        const chatMessagesRef = collection(db, 'chatmessages');

        const queryRef = query(
          chatMessagesRef,
          where('sender', 'in', [auth.currentUser.uid, selectedUsers.uid]),
          where('receiver', 'in', [auth.currentUser.uid, selectedUsers.uid])
        );

        const unsubscribe = onSnapshot(queryRef, (snapshot) => {
          const messagesList = [];
          snapshot.forEach((doc) => {
            const messageData = doc.data();
            messagesList.push({
              content: messageData.content,
              fileURL: messageData.fileURL || '',
              timestamp: messageData.timestamp,
              sender: messageData.sender,
              receiver: messageData.receiver,
            });
          });

          // Sort messages by timestamp in descending order
          const sortedMessages = sortMessagesByTimestamp(messagesList);

          setUserMessages(sortedMessages);
          setFileURLForUser(
            selectedUsers.uid,
            sortedMessages.map((message) => message.fileURL)
          );

          console.log('Real-time updates for sender and receiver:', sortedMessages);
        });

        return () => {
          unsubscribe(); // Unsubscribe the listener when the component unmounts
        };
      }
    };

    const sortMessagesByTimestamp = (messages) => {
      return messages.sort((a, b) => {
        const timestampA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
        const timestampB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
        return timestampA - timestampB; // Sort in ascending order
      });
    };

    fetchMessages();
  }, [selectedUsers]);

  const formatTimestamp = (message) => {
    if (!message || !message.timestamp) {
      return 'Invalid timestamp';
    }

    // Check if timestamp is a Firestore Timestamp object
    const timestamp = message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp);

    // Check if the timestamp is valid
    if (isNaN(timestamp.getTime())) {
      return 'Invalid timestamp';
    }

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, // Use 12-hour clock
    };

    return new Intl.DateTimeFormat('en-US', options).format(timestamp);
  };

  return (
    <div className="user-message-dashboard">
      {selectedUsers ? (
        <>
          {/* Display messages here */}
          <div className="message-container">
            {/* Combined messages */}
            {userMessages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender === auth.currentUser.uid ? 'sender' : 'receiver'} ${message.read ? 'read' : 'unread'}`}
              >
                <div className='message-parent'>
                  <div>
                    <p className='message-content'>{message.content}</p>
                    {message.fileURL && <img className='image-content' src={message.fileURL} alt="File" />}
                    <span className='time-content'>{formatTimestamp(message)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="user-Profile-message">
          <span>No user selected</span>
        </div>
      )}
    </div>
  );
};

export default Messagedisplay;
