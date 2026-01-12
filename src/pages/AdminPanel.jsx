import { useAuth } from "../auth/AuthContext";

const AdminPanel = () => {
  const { logout } = useAuth();

  return (
    <div className="text-center mt-4">
      <h2>Welcome to Admin Panel</h2>
      <button className="btn btn-danger mt-3" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default AdminPanel;
