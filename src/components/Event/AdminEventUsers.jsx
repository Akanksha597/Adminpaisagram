import { useEffect, useState } from "react";

export default function AdminEventUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // change per page limit

  // ===============================
  // FETCH USERS
  // ===============================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://paisagramsbackend.vercel.app/api/campaion/");
      const result = await res.json();
      setUsers(result.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===============================
  // UNIQUE EVENTS
  // ===============================
  const eventNames = [...new Set(users.map((u) => u.eventName).filter(Boolean))];

  // ===============================
  // FILTER USERS
  // ===============================
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.mobile?.includes(search);

    const matchesEvent = activeEvent === "" || u.eventName === activeEvent;

    return matchesSearch && matchesEvent;
  });

  // ===============================
  // PAGINATION LOGIC
  // ===============================
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeEvent, search]);

  // ===============================
  // LOADING STATE
  // ===============================
  if (loading) {
    return (
      <p className="text-center mt-5 fw-bold text-primary">
        Loading users...
      </p>
    );
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div className="container mt-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold text-primary">All Campaign Users</h3>
        <p>Total Users: <b>{filteredUsers.length}</b></p>
      </div>

      {/* EVENT FILTER TABS */}
      <div className="mb-3">
        <button
          className={`btn btn-sm me-2 ${activeEvent === "" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveEvent("")}
        >
          All Events
        </button>
        {eventNames.map((event) => (
          <button
            key={event}
            className={`btn btn-sm me-2 ${activeEvent === event ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveEvent(event)}
          >
            {event}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name, email, or mobile"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="card shadow-sm">
        <table className="table table-bordered mb-0">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Event Name</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Occupation</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{startIndex + index + 1}</td>
                <td>{user.eventName || "-"}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
                <td>{user.occupation}</td>
              </tr>
            ))}

            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-3">
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-sm btn-outline-primary ms-2"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
