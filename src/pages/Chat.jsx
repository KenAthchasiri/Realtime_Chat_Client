import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { allUsersRoute, host } from '../utils/APIRoutes'
import Contacts from '../components/Contacts'
import Welcome from '../components/Welcome'
import ChatContainer from '../components/ChatContainer'
import {io} from 'socket.io-client'

const Chat = () => {
  const socket = useRef()
  const [contacts,setContacts] = useState([])
  const [currentUser,setCurrentUser] = useState(undefined)
  const [currentChat,setCurrentChat] = useState(undefined)
  const [isLoaded,setIsloaded] = useState(false)
  const navigate = useNavigate()

  const handleChatChange = (chat) => {
      setCurrentChat(chat)
  }

  useEffect(()=>{
    if(currentUser) {
      socket.current = io(host)
      socket.current.emit("add-user",currentUser._id)
    }
  },[currentUser])

  useEffect(()=>{
    const getCurrentUser = async () =>{
      setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")))
      setIsloaded(true)
    }
    if(!localStorage.getItem("chat-app-user")){
      navigate("/login")
    } else {
      getCurrentUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{

    const getContacts = async () => {
      if(currentUser) {
        if(currentUser.isAvatarImageSet) {
          const {data} = await axios.get(`${allUsersRoute}/${currentUser._id}`)
          setContacts(data)
        } else {
          navigate("/setavatar")
        }
      }
    }
    getContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentUser])

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
        {
          isLoaded && currentChat === undefined 
            ? <Welcome currentUser={currentUser}/> 
            : <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
        }

      </div>
    </Container>
  )
}

export default Chat

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #131324;
  .container{
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width:1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`