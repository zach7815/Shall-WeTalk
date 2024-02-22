import React, { createContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import {useSocket} from "./SocketProvider";

const VideoChatSocketContext = createContext();

const videoChatSocket = io('http://localhost:8000')


const VideoChatSocketProvider = ({ id, children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");
  // const videoChatSocket = useSocket();

  // console.log("videoChatSocket",videoChatSocket)

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef();

  useEffect(() => {
    // console.log("navigator",navigator.mediaDevices)
    
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        // console.log("current",currentStream)
        setStream(currentStream);
      });
    
    videoChatSocket.on("me", (id) => setMe(id));

    videoChatSocket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    return () => {
      videoChatSocket.off("me");
      videoChatSocket.off("callUser");
    };
  }, []);

  useEffect(() => {
    if (stream && myVideo.current) {
      // console.log("myVid",myVideo)
      // console.log("stream",stream)
      myVideo.current.srcObject = stream;
    }
  }, [stream]);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      videoChatSocket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      // console.log("currentStream",currentStream)
      // console.log("userVid",userVideo)
      userVideo.current.srcObject = currentStream;



    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    console.log("Calling user with ID:", id);
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      console.log("Emitting callUser event");
      videoChatSocket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    // console.log('USER VIDEO !', userVideo)
    // console.log('USER VIDEO current!', userVideo.current.srcObject)
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    videoChatSocket.on("callAccepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <VideoChatSocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </VideoChatSocketContext.Provider>
  );
};

export { VideoChatSocketContext, VideoChatSocketProvider };
