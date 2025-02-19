import { useEffect, useState, useRef, useCallback } from "react";
import './index.css'

const API_URL = "https://dummyjson.com/users?limit=15&skip=";

function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observer = useRef();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}${page * 15}`);
      if (!response.ok) throw new Error("Failed to fetch users.");
      const data = await response.json();
      setUsers((prev) => [...prev, ...data.users]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const lastUserRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        { threshold: 1 }
      );
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  return (
    <div className="container">
      <h1>User List</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Pin Code</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} ref={index === users.length - 1 ? lastUserRef : null}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.gender}</td>
              <td>{user.phone}</td>
              <td>{user.address.address}</td>
              <td>{user.address.postalCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default App;
