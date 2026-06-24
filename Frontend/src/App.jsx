import FactGuardPage from "./pages/Factguardpage";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserProfile } from "../src/services/api.js";
export const serverUrl ="http://localhost:8000";
function App() {
  const dispatch = useDispatch();
    useEffect(()=>{
        getUserProfile(dispatch)  
    },[dispatch])

    const {userData} = useSelector((state)=>state.user);
    console.log(userData);
  return (
    <>
    <FactGuardPage/>
    
      
    </>
  )
}

export default App;
