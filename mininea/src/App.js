import {React,useState,useEffect} from 'react';
import UserIDForm from './components/UserIDForm';
import EnterPin from './components/EnterPin'
import axios from "axios";
import PasswordForm from "./components/PasswordForm";
async function get_key(){
    const request =await axios.get('/clientToken')
    console.log(request)
    return request.data.data.data
}
function App(){
    const [token,setToken]=useState('')
    const[pword,setPassword]=useState(false)
    
    useEffect(async () => {
      let data = await axios.get('/clientToken');
      let tokenTemp = data.data.data // wtf? :D
      setToken(tokenTemp);
    }, [])// use effect is only called when the object is first created on the webpage. this is called mounting. using just useState will cause the component to continually rerender itself
    // ... and because use state is called every time the object is rendered, it will continuously bombard the server for a key

    const [userID,setUserID]=useState('')
    const [pin,setPin]=useState('')
    
    
    return(
        <div>
            {pword==false?
            <div>
            {(userID == '') ?<UserIDForm masterUserID = {setUserID} token ={token}></UserIDForm> :<div> <label>UserID</label> <input type="text" value={userID} readOnly={true} disabled={true}></input></div>} {/* this greys out the input box */}
            {userID !=''? (pin =='')?<EnterPin token ={token} masterSet = {setPin}></EnterPin>:<div> <label>Pin</label> <input type="text" value={pin} readOnly={true} disabled={true}></input></div>: null}
            {(userID!='' && pin !='' && pword==false)?<PasswordForm token ={token}masterSet={setPassword}></PasswordForm>:null}
            </div>:<h1>allowed in</h1>}
        </div>
        
    )
}
export default App;