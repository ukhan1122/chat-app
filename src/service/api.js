import axios from 'axios'
const url = 'http://localhost:8000'

export const adduser = async(data)=>{
try {
    await axios.post( `${url}/add`,data)
    
} catch (error) {
    console.log("eoor while adduser api",error.message)
}
}
export const getuser = async(data)=>{
    try {
       const res =  await axios.get(`${url}/user`,data)
       return res.data;
        
    } catch (error) {
        
    console.log("eoor while adduser api",error.message)

        
    }
}
export const setuserlist = async (data)=>{
    try {
       const res = await axios.post(`${url}/userlist/add`,data)
       return res.data;
        
    } catch (error) {
        
    console.log("eoor while adduser api",error.message)
        
    }
}
export const getuserlist = async (data)=>{
    try {
       const res = await axios.post(`${url}/userlist/get`,data)
       return res.data  ;
        
    } catch (error) {
        
    console.log("eoor while gettuser api",error.message)
        
    }
}