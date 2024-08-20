// File: src/pages/UsersList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = await getDocs(collection(db, 'profiles'));
        setUsers(usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Users List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} className="mb-4">
            <Link to={`/profile/${user.id}`} className="text-blue-500 hover:underline">
              {user.displayName || user.email}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
