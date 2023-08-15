import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios';
import styled from 'styled-components';
import {io} from 'socket.io-client'
import { useNavigate } from 'react-router-dom';
import { allUserRoute } from '../utils/APIRoutes';
import { host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';

const Chat = () => {
  const navigate = useNavigate();

  const socket = useRef();

  const [contacts, setContacts] = useState([]);
  const [currUser, setCurrUser] = useState(undefined);
  const [currChat, setcurrChat] = useState(undefined);

  useEffect(() => {
    const getUser = async () => {
      if(!localStorage.getItem('chat-app-user')) {
          navigate('/login');
      } else {
        setCurrUser(await JSON.parse(localStorage.getItem('chat-app-user')));
      }
    }
    getUser();
  },[navigate])

  useEffect(() => {
    if(currUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currUser._id);
    }
  },[currUser])

  useEffect(() => {
    const getAllUsers = async () => {
      if(currUser) {
        if(currUser.isAvatarImageSet) {
          const res = await axios.get(`${allUserRoute}/${currUser._id}`);
          setContacts(res.data);
        } else {
          navigate('/setAvatar')
        }
      }
    }
    getAllUsers();
  },[currUser,navigate])

  const handleChatChange = (chat) => {
    setcurrChat(chat);
  }

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currUser = {currUser} changeChat = {handleChatChange}/>
        {
          currChat === undefined ? (
            <Welcome/>
          ) : (
            <ChatContainer currChat = {currChat} currUser = {currUser} socket = {socket}/>
          )

        }
        
      </div>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #1f1f38;
  .container {
    height: 85vh;
    width: 86vw;
    background-color: #0f172a;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
    @media screen and (min-width: 481px) and (max-width: 719px) {
      grid-template-columns: 45% 55%;
    }
    @media screen and (min-width: 360px) and (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }
`

export default Chat;