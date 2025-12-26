import React, { useState, useEffect } from "react";
import "./App.css";

// On deployment change URL into https://infoapp.page.gd/api/form.php
const API_URL = "http://localhost/form-react/form.php";

function App() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    dob: "",
    age: "",
    sex: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("add");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      // On deployment change URL into https://infoapp.page.gd/api/get_users.php
      const res = await fetch("http://localhost/form-react/get_users.php");
      const data = await res.json();

      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === "view") {
      fetchUsers();
    }
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "age" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.firstname || !formData.lastname || !formData.email) {
      setMessage("Please fill all required fields.");
      return;
    }

    setLoading(true);

    const url = editingId
    // On deployment change URL into https://infoapp.page.gd/api/update_user.php
      ? "http://localhost/form-react/update_user.php"
      : API_URL;

    const payload = editingId ? { ...formData, id: editingId } : formData;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(
          editingId ? "User updated successfully!" : "User added successfully!"
        );

        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          dob: "",
          age: "",
          sex: "",
        });

        setEditingId(null);
        fetchUsers();
      } else {
        setMessage(data.message || "Operation failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      dob: user.dob || "",
      age: user.age || "",
      sex: user.sex || "",
    });

    setEditingId(user.id);
    setActiveTab("add");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      // On deployment change URL into https://infoapp.page.gd/api/delete_user.php
      await fetch("http://localhost/form-react/delete_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setActiveTab("add")}
          >
            infoApp
          </span>
        </h1>
        <nav className="nav">
          <ul>
            <li>
              <button className="nav-link" onClick={() => setActiveTab("add")}>
                Add Profile
              </button>
            </li>
            <li>
              <button className="nav-link" onClick={() => setActiveTab("view")}>
                View Profile
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* SINGLE layout container */}
      <h2 className="section-title">Welcome to my Information App!</h2>
      <p> Created using React.js with PHP backend.</p>
      <main className="form-container">
        {/* Modal */}
        {message && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p className="message">{message}</p>
              <button className="close-btn" onClick={() => setMessage("")}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* ADD PROFILE */}
        {activeTab === "add" && (
          <>
            <h2>Add Profile Information</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="input-field"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="input-field"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="input-field"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="input-field"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className="input-field"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </>
        )}

        {/* VIEW USERS */}
        {activeTab === "view" && (
          <>
            <h2>View Profile Information</h2>

            {loadingUsers && <p>Loading users...</p>}

            {!loadingUsers && users.length === 0 && <p>No users found.</p>}

            {!loadingUsers && users.length > 0 && (
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Age</th>
                    <th>Sex</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        {user.firstname} {user.lastname}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.age}</td>
                      <td>{user.sex}</td>
                      <td>
                        <button className="action-btn edit-btn" onClick={() => handleEdit(user)}>Edit</button>
                        <button className="action-btn delete-btn"onClick={() => handleDelete(user.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
