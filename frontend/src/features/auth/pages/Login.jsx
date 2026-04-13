import { loginUser } from "../services/authService.js";
import useAuth from "../../../hooks/useAuth.js";
import { useNavigate, useLocation } from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleLogin = async (data) => {
    try {
      const res = await loginUser(data);
      console.log(res);
      login(res.data);
      navigate(from);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <AuthForm type="login" onSubmit={handleLogin} />
    </div>
  );
}
