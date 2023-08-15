import React, { useState,useEffect } from 'react'
import styled from 'styled-components';
import Robot from '../assets/robot.gif';

const Welcome = () => {
    const [userName, setUserName] = useState(undefined);

    useEffect(() => {
        const setName = async() => {
            if(localStorage.getItem('chat-app-user')) {
                setUserName(await JSON.parse(localStorage.getItem('chat-app-user')).username);
            }
        }
        setName();
      }, []);

    return (
        <Container>
            <img src = {Robot} alt='Robot'></img>
            <h1>
                Welcome, <span>{userName}!</span>
            </h1>
            <h3>Select a chat and start messaging!</h3>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    flex-direction: column;
    img {
    height: 20rem;
    }
    span {
    color: #4e0eff;
    }
`

export default Welcome;