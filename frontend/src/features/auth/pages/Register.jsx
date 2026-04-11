import {registerUser} from "../services/authService.js"
import AuthForm from "../components/AuthForm.jsx"

export default function Register(){
  const handleRegisterUser = async(data)=>{
    try{
      const res = await registerUser(data);
      console.log(res);
    }catch(err){
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <AuthForm type="register" onSubmit={handleRegisterUser}/>
    </div>
  )
}