import React,{useState} from 'react';
import axios from "axios";
import Error from './Error'
function EnterPin({token,masterSet}){
    const[freeze,setFreeze]=useState(false)//locks at 3 attempts
    const[error,setError]=useState()
    const [pin, setPin] = useState('')
    return(
        <div>
            
            <label>pin</label>
            <input type="text" maxlength ={4} onChange={(event)=>{
                setPin(event.target.value)
            }}></input>
            {error}
            
            <input type ='submit' onClick={()=>{
                if(pin.length==4){
                axios.get(`/checkpin?token=${token}&pin=${pin}`).then((data)=>{
                    if(data.data == "False" ){
                        console.log('locked')
                        setError(<Error message={'Incorrect Pin. You are now locked out of your account'}></Error>)//set the error var, it will force a rerender of the component so that the error will show up right away
                        setFreeze(true)
                    }
                    else if(freeze==false && data.data=='True'){ 
                        console.log('in pin')
                        masterSet(pin)
                    }
                })}
                else{
                    setError(<Error message ={'pin too short'}></Error>)
                }
            }}></input>
        </div>
    )
}
export default EnterPin;