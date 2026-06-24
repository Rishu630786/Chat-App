import { createContext, useContext, useEffect, useRef,useState } from "react";
import { AuthContext } from "./AuthContext";
import { ChatContext } from "./ChatContext";




export const VideoCallContext = createContext(null);

export const VideoCallProvider=({children})=>{
    const {socket} = useContext(AuthContext)
    const {selectedUser} = useContext(ChatContext)
    const localVideo = useRef();
  const remoteVideo = useRef();
  const pc = useRef(null);
  const localStream = useRef(null);

  const [incomingCall, setIncomingCall] = useState(null);
  const[inCall,setInCall] = useState(false)
  const [calling, setCalling] = useState(null)
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);


const intialization = ()=>{
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
    return pc.current;
}






   
    useEffect(()=>{
        if(!socket) return;
        
       socket.emit("AAA", ()=>{
       console.log('socket emitted');
       })
       
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    pc.current.ontrack = e => {
      remoteVideo.current.srcObject = e.streams[0];
    };


    pc.current.onicecandidate = e => {
      if (e.candidate && remoteSocketId) {
        socket.emit("ice-candidate", {
          to: remoteSocketId,
          candidate: e.candidate
        });
      }
    };

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStream.current = stream;
        localVideo.current.srcObject = stream;
        stream.getTracks().forEach(t => pc.current.addTrack(t, stream));
      });

    

    return () => socket.disconnect();
    
  }, []);


  useEffect(()=>{
     if(!socket) return;


      const handleIncomingCall = ({ from, Profile, offer })=>{
        intialization()
    console.log(offer);
    console.log(from);
    
    setInCall(true);
    setIncomingCall({ from, offer });
}
    socket.on("incoming-call", handleIncomingCall );

    socket.on("call-answered", async answer => {
      await pc.current.setRemoteDescription(answer);
      setCallActive(true);
    });

    socket.on("ice-candidate", c => {
      pc.current.addIceCandidate(c);
    });

    socket.on("call-ended", endCall);

    return()=> socket.disconnect()
  },[socket])



  // 📞 CALL USER
  const callUser = async () => {
    setCalling(true)
   intialization()

    const offer = await pc.current.createOffer();
    console.log(offer);
    
    // await pc.current.setLocalDescription(offer);

    socket.emit("call-user", {
      to: selectedUser,
      offer
    });
  };

  // ✅ ACCEPT CALL
  const acceptCall = async () => {
    console.log('call Acepted');
    
    
    setRemoteSocketId(incomingCall.from);
    console.log(incomingCall.from);

    console.log(pc.current);
    
    
    await pc.current.setRemoteDescription(incomingCall.offer);


    const answer = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answer);

    socket.emit("answer-call", {
      to: incomingCall.from,
      answer
    });

    setIncomingCall(null);
    setCallActive(true);
  };

  // ❌ REJECT CALL
  const rejectCall = () => {
    socket.emit("call-ended", { to: incomingCall.from });
    setIncomingCall(null);
  };

  // 🔇 MUTE / UNMUTE
  const toggleMic = () => {
    localStream.current.getAudioTracks()[0].enabled = !micOn;
    setMicOn(!micOn);
  };

  // 📷 CAMERA ON / OFF
  const toggleCamera = () => {
    localStream.current.getVideoTracks()[0].enabled = !camOn;
    setCamOn(!camOn);
  };

  // 📴 DISCONNECT CALL
  const endCall = () => {
    socket.emit("call-ended", { to: remoteSocketId });

    pc.current.close();
    pc.current = new RTCPeerConnection();

    setCallActive(false);
    setRemoteSocketId(null);
    remoteVideo.current.srcObject = null;
  };

    
   const value={
         incomingCall,
         inCall,
         calling,
         callActive,
         localVideo,
         remoteVideo,
         callUser,
         acceptCall,
         rejectCall,
         toggleMic,
         toggleCamera,
         endCall
    }

    return(
        <VideoCallContext.Provider value={value}>
           {children}
        </VideoCallContext.Provider>
    )
}
