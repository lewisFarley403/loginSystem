import axios from "axios";
import React,{useState,useEffect} from 'react';
import Error from './Error'

function UserIDForm({masterUserID,token}) {
  const [attempts, setAttempts] = useState(0)
  const [userID,setUserID] = useState('')
  const [error, setError] = useState()
  
  // useEffect(() => {
  //   fetch('/checkUserID')
  // })
  return (
    <div className="App">
        <div id ='userIDWraper'>
          <label >UserID</label>
          <input type="text" id ='ID' onChange= {(event)=> {
            setUserID(event.target.value)
            }}></input>
            {error}
        </div>
        <input type="submit" id ='sub' onClick ={()=>{
          if (userID.length===10){
            //setError()
            axios.get(`/checkUserID?userID=${userID}&token=${token}`).then((data) => { 
              if (data.data=='False' ){
                if (attempts<3){
                  setAttempts(attempts+1)
                  setError(<Error message ={`Incorrect userID. Attempts left ${3-attempts}`}></Error>)
                }
                else{
                  setError(<Error message ={'Your account has been locked, please try again later'}></Error>)
                }
              }
              else if(data.data == 'True' && attempts<3){
                setError()
                masterUserID(userID)
                console.log('its good')
              }
            })
            console.log('send to server')
          }
          else{
            //error message
            console.error('too short userID')
            let div =document.getElementById('userIDWraper')
            // console.log(div.children)
            if(userID.length<10){
            setError(<Error message ='This UserID is too short'></Error>)
            }
            else{
            setError(<Error message ='This UserID is too long'></Error>)
            }
            // console.log(userID)
          }}}
        ></input>

    </div>
  );
}

export default UserIDForm;
