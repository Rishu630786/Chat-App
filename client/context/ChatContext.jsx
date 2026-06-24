import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.jsx";
import toast from "react-hot-toast";

export const ChatContext = createContext(null);

export const ChatProvider = ({children})=>{
     
    const [messages, setMessages]= useState([]);
    const [users, setUsers]= useState([]);
    const [selectedUser, setSelectedUser]= useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});
    const [alert, setAlert] = useState(false);


    const{socket,axios} = useContext(AuthContext);

    //function to get all users for sidebar
    const getUsers = async ()=>{
        try {
         const {data} =  await axios.get("/api/messages/users");
         if(data.success){
            setUsers(data.users)
            setUnseenMessages(data.unseenMessages)
         }
        } catch (error) {
            toast.error(error.message)
        }
    }


    // functin to get messagefor selected user
    const getMessages = async (userId)=>{
        try {
         const {data} =   await axios.get(`/api/messages/${userId}`);
         if(data.success){
            setMessages(data.messages)
          
            
         }

        } catch (error) {
             toast.error(error.message)
        }
    }


    // function to send messages to selected user

    const sendMessage = async (messageData)=>{

       
        try {
            
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            
            
            if(data.success){
                console.log(data.success);
                setMessages((prev)=>[...prev, data.newMessage] )
            }else{
                toast.error(data.message);
            }
        } catch (error) {
             toast.error(error.message);
        }
    }

    // function to subscribe to messages for selected user
    const subscribeToMessages = async ()=>{
        if(!socket) return;

        socket.on("newMessage", (newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prev)=>[...prev, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);

            }else{
                setUnseenMessages((prev)=>({
                      ...prev, [newMessage.senderId]: prev[newMessage.senderId]
                       ? prev[newMessage.senderId] + 1
                       : 1,
                }))
            }
        })
    }

    // function to unsubscribe from messages
   const unsubscribeFromMessages =()=>{
    if (socket) socket.off("newMessage");
   }

   useEffect(()=>{
    subscribeToMessages();
    return ()=> unsubscribeFromMessages();
   },[socket,selectedUser])

// function to delete chat 
const deleteChat = async()=>{
    console.log("im clicked");
 const result = await axios.delete(`/api/messages/delete_chat/${selectedUser._id}`);
   !(result.data.success === true)? toast.success(result.data.message):toast.success(result.data.message)
   
  setAlert(false)
  
}




    const value = {
         messages, users, selectedUser ,alert, getUsers, getMessages, sendMessage,setSelectedUser, unseenMessages,setUnseenMessages , setAlert , deleteChat
    }

    return(
        <ChatContext.Provider value={value}>
              {children}
        </ChatContext.Provider>
    )
}