import Message from "../models/message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io,userSocketMap } from "../server.js";

//Get all users except the logged in user
export const getUserForSidebar = async(req,res)=>{
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne: userId}}).select("-password");

        //Count number of message not seen 
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId: user._id, receiverId:userId,seen:false})
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length ;

            }
        })
        await Promise.all(promises);
        res.json({success:true , users:filteredUsers, unseenMessages})
    } catch (error) {
        console.log(error.message); 
       res.json({success:false , message:error.message}) 
    }
}

//get all message for selected user
export const getMessages = async (req, res)=>{
    try {
        const {id: selectedUserId}= req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:selectedUserId},
                 {senderId:selectedUserId,receiverId:myId},
            ]

        })
        await Message.updateMany({senderId:selectedUserId, receiverId: myId},
            {seen:true}
        );

        res.json({success: true, messages})

    } catch (error) {
       console.log(error.message); 
       res.json({success:false , message:error.message})  
    }
}

// api to mark message as seen ussing message id 

export const markMessageAsSeen = async (req,res)=>{
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id, {seen:true})
        res.json({success:true})
    } catch (error) {
        console.log(error.message); 
       res.json({success:false , message:error.message})   
    }
}


//Send message to selected user 
export const sendMessage = async(req,res)=>{
    try {
        const {text,image}= req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
           const uploadResponse = await cloudinary.uploader.upload(image);
           imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        //Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.json({success:true, newMessage});

    } catch (error) {
        
    }
}

// funtion to delete chat 

export const deleteChat = async (req,res)=>{
   const {receiver_id: receiver_id }= req.params;
   const sender_id = req.user._id  
try {
 console.log(`senderid:`,sender_id,`receiver_id:`,  receiver_id);

const result =  await Message.deleteMany({
      $or: [
    { senderId: sender_id, receiverId: receiver_id },
    { senderId: receiver_id, receiverId: sender_id }
  ]
    });

   ! (result.deletedCount) === 0 ?
   res.json({success:true,message:"chat deleted"}):
   res.json({success:false,message:"chat Allready deleted"})
 
    
} catch (error) {
 res.status(400).json({ssuccess:false,message:error}) 
}
}