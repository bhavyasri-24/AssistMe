import {useEffect} from "react";
import {socket} from "../sockets/socket";

export default function useSocket(roomId){
  useEffect(()=>{
    socket.emit("join_room", roomId);

    return ()=>{
      socket.off("receive_message");
    }}, [roomId]);

    return socket;
}