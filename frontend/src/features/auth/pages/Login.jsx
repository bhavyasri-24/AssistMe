import {loginUser} from "../services/authService.js"
import useAuth from "../../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom"
import AuthForm from "../components/AuthForm.jsx"

export default function Login(){
  const {login} = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data)=>{
    try{
      const res = await loginUser(data);

      login(res.data);
      navigate("/");
    }catch(err){
      console.log(err); 
    }
  }

  return(
    <div>
      <h1>Login</h1>
      <AuthForm type="login"
      onSubmit={handleLogin}/>
    </div>
  )
}