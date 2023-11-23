import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useHistory } from 'react-router-dom';
import { auth, storage } from './Firebas';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const history = useHistory();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePhotoChange = (e) => {
    const selectedFile = e.target.files[0];
    setPhoto(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Create the user in Firebase Authentication using the imported auth instance
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
  
      if (newUser) {
        // User is successfully created
        const db = getFirestore(); // Initialize Firestore
  
        // Save user data to Firestore, including photoURL
        const userCollection = collection(db, 'users');
        const userData = {
          name: name,
          email: email,
          photoURL: '', // This will be updated with the download URL
          uid: newUser.uid,
        };
  
        const docRef = await addDoc(userCollection, userData);
        console.log('User data added to Firestore with ID: ', docRef);
  
        // Upload the user's photo to Firebase Storage
        if (photo) {
          const storageRef = ref(storage, `user-images/${newUser.uid}/profile.jpg`);
          const snapshot = await uploadBytes(storageRef, photo);
          const downloadURL = await getDownloadURL(snapshot.ref);
  
          // Update the user's photoURL in Firestore
          const userDocRef = doc(db, 'users', docRef.id);
          await setDoc(userDocRef, { photoURL: downloadURL }, { merge: true });
  
          // Set the name and photoURL in Firebase Authentication
          await updateProfile(newUser, {
            displayName: name,
            photoURL: downloadURL,
          });
  
          console.log('Image URL:', downloadURL);
  
          // Redirect to the home page
          history.push('/');
        }
      } else {
        console.error('User is null.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };
  

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={handleNameChange} required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <div>
          <label htmlFor="photo">Avatar</label>
          <input type="file" id="photo" onChange={handlePhotoChange} accept="image/*" required />
        </div>
        <button type="submit">Signup</button>
      </form>
      <p>
        Already signed up? <a href="/login">Click here to login</a>
      </p>
    </div>
  );
};

export default Signup;
