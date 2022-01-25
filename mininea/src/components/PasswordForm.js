import React ,{useState,useEffect} from 'react';
import axios from 'axios';
import Error from './Error'
function PasswordForm({token,masterSet}){
    const [chars,setChars]=useState({chars:['fail'], indices:[0],error:'True'}) //request the password characters from the server {indexes:[...],chars:[...]}
                                                                                //has to have a place holder for when the component is mounted. believe because useEffect async?
    const [error, setError]=useState()
    const[attempts, setAttempts]=useState(0)
    const[characters,setCharacters] = useState(['','',''])
    useEffect(async ()=>{
        let data = await axios.get(`/characters?token=${token}`)
            console.log(data.data.indices)
            if(data.data.error ==='False'){
                console.log(data.data)

                //let info ={indices:data.data.indices,chars:data.data.chars}
                let info ={indices:data.data.indices}
                console.log(info)
                setChars(info);
            }
            else{
                console.log(data.data)
                console.log('error')
                setError(<Error message={'Invalid session token, Please try again later'}></Error>)//never want this error 
                setChars({indices:['errpr'],chars:['eror']})
            }
        

    },[])

    return(
        <div>
            <h2>Please enter the following characters from your password</h2>
            {/* {<p>{chars[chars.indices[0]]}</p>} */}
            {
                
            chars.indices.map((item,i)=>{
                return(
                    
                    <div>
                        
                        <label>{`${item+1}${(item+1==3)? 'rd':(item+1==2)?'nd':(item+1==1)?'st':'th'}`} </label>{/* show the correct suffix on number */}
                        <input type="text" onChange={(event)=>{
                            var c1 = characters
                            c1[i]=event.target.value
                            setCharacters(c1)
                        }}></input>
                    </div>
                )
            })}
            {error}
            <input type="submit" onClick={()=>{
                console.log(characters)
                axios.get(`/checkDigits?token=${token}&char1=${characters[0]}&char2=${characters[1]}&char3=${characters[2]}`).then((data)=>{
                    if(data.data =='True' && attempts!==3){
                        console.log('let in')
                        setError()
                        masterSet(characters)

                    }
                    else if(attempts<3){
                    setError(<Error message={`Incorrect letters, you have ${3-attempts}`}></Error>)
                    setAttempts(attempts+1)
                    }
                    else{
                        setError(<Error message={'Locked out'}></Error>)
                    }
                })

            }}></input>
        </div>
    )


}
export default PasswordForm
