import React, { useState, useEffect } from 'react';
import { AttachFile, Photo } from '@mui/icons-material';
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { auth } from './Signup/Firebas';
import './Message.css';
import { useSearchContext } from './Chatcontext';

const Message = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const {
    selectedUsers,
    setFileURLForUser,
    setTimestampsForUser,
    setUser,
    messages,
    setMessagesForUser, // Add this line
  } = useSearchContext();

  const fetchUsers = async () => {
    const db = getFirestore();
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const usersList = [];

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      usersList.push({ id: doc.id, ...userData });
    });

    setUser(usersList);

    if (selectedUsers && selectedUsers.uid) {
      const selectedUserId = selectedUsers.uid;
      const chatMessagesRef = collection(db, 'chatmessages');
      const userMessagesSnapshot = await getDocs(query(chatMessagesRef, where('receiver', '==', selectedUserId)));

      const messagesList = [];
      const fileURLList = [];
      const timestampsList = [];

      userMessagesSnapshot.forEach((doc) => {
        const messagesData = doc.data();
        const messagesArray = messagesData.messages;
      
        if (messagesArray && messagesArray.length > 0) {
          messagesList.push(messagesArray);
          fileURLList.push(messagesData.fileURL);
          timestampsList.push(messagesArray[0].timestamp);
        }
      });
      
      // Ensure that messages is defined and initialized as an array
      const messagesArray = messagesList.flat();
      
      // Update messages, fileURL, and timestamps state variables based on fetched data
      setMessagesForUser(selectedUserId, messagesArray);
      setFileURLForUser(selectedUserId, fileURLList.flat());
      setTimestampsForUser(selectedUserId, timestampsList);
      
      console.log('Fetched data for selected user:', messagesArray);
      
    } else {
      console.log('No user selected');
      setMessagesForUser({}, []);
      setFileURLForUser({}, []);
      setTimestampsForUser({}, []);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const sendMessageToChatMessages = async (
    messageContent,
    senderUserId,
    receiverUserId,
    fileURL
  ) => {
    if (messageContent && senderUserId && receiverUserId) {
      const db = getFirestore();
      const chatMessagesRef = collection(db, 'chatmessages');
  
      try {
        const timestamp = new Date();
  
        const dataToAdd = {
          content: messageContent,
          fileURL: fileURL || '',
          receiver: receiverUserId,
          sender: senderUserId,
          timestamp: timestamp.toUTCString(), // Convert timestamp to string
        };
  
        await addDoc(chatMessagesRef, dataToAdd);
  
        setMessage('');
        setMessagesForUser(receiverUserId, [dataToAdd]); // Updated this line
        setFile(null);
  
        console.log('Message and File URL sent to Firestore:', dataToAdd);
      } catch (error) {
        console.error('Error sending message to chatmessages: ', error);
      }
    } else {
      console.error('Invalid data for sending a message to chatmessages');
    }
  };
  
  const handleSendMessage = async () => {
    const senderUserId = auth.currentUser.uid;
    const receiverUserId = selectedUsers ? selectedUsers.uid : null;
    let fileURL = '';

    try {
      if (file) {
        const storage = getStorage();
        const storageRef = ref(storage, `user-uploads/${senderUserId}/${file.name}`);
        await uploadBytes(storageRef, file);
        fileURL = await getDownloadURL(storageRef);
        setFileURLForUser(receiverUserId, fileURL);
      }

      const timestamp = new Date();

      const dataToAdd = {
        messages: [
          {
            content: message,
            timestamp: timestamp,
            sender: senderUserId,
            receiver: receiverUserId,
          },
        ],
        fileURL: file ? fileURL : '', // Use the uploaded file URL or an empty string if no file
      };

      const db = getFirestore();
      const chatMessagesRef = collection(db, 'chatmessages');
      await addDoc(chatMessagesRef, dataToAdd);

      setMessage('');
      sendMessageToChatMessages(message, senderUserId, receiverUserId, fileURL);

      console.log('Message and File URL sent to Firestore:', dataToAdd);
    } catch (error) {
      console.error('Error sending message to chatmessages: ', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <>
      <div className="message-box">
        <div className="Type-message">
          <input
            type="text"
            placeholder="Type Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="icon">
            <label htmlFor="file-input">
              <AttachFile />
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="icon">
            <Photo />
          </div>
          <div>
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
