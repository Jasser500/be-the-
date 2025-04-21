import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import AgoraRTM from 'agora-rtm-sdk';
import '../styles/main.css';
import '../styles/room.css';

const APP_ID = "YOUR_AGORA_APP_ID";

const Room = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get('room') || 'main';
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isMicActive, setIsMicActive] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [streams, setStreams] = useState([]);
  const [mainStream, setMainStream] = useState(null);

  const streamsContainerRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const rtcClientRef = useRef(null);
  const rtmClientRef = useRef(null);
  const channelRef = useRef(null);
  const localTracksRef = useRef([]);
  const localScreenTracksRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/lobby');
      return;
    }

    const initRoom = async () => {
      try {
        // Initialize RTM client
        const rtmClient = AgoraRTM.createInstance(APP_ID);
        await rtmClient.login({ uid: user._id, token: null });
        await rtmClient.addOrUpdateLocalUserAttributes({
          name: user.username,
          avatar: user.avatar || ''
        });

        // Join channel
        const channel = await rtmClient.createChannel(roomId);
        await channel.join();

        // Set up event handlers
        channel.on('MemberJoined', handleMemberJoined);
        channel.on('MemberLeft', handleMemberLeft);
        channel.on('ChannelMessage', handleChannelMessage);

        // Initialize RTC client
        const rtcClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        await rtcClient.join(APP_ID, roomId, null, user._id);
        rtcClient.on('user-published', handleUserPublished);
        rtcClient.on('user-left', handleUserLeft);

        // Store clients and channel
        rtmClientRef.current = rtmClient;
        rtcClientRef.current = rtcClient;
        channelRef.current = channel;

        // Get initial members
        const initialMembers = await channel.getMembers();
        updateMemberList(initialMembers);

        // Add welcome message
        addBotMessage(`Welcome to the room ${user.username}! 👋`);

      } catch (error) {
        console.error('Room initialization failed:', error);
        alert('Failed to initialize room. Please try again.');
      }
    };

    initRoom();

    return () => {
      leaveRoom();
    };
  }, [roomId, user, navigate]);

  const handleMemberJoined = async (memberId) => {
    try {
      const member = await rtmClientRef.current.getUserAttributes(memberId);
      addMember({ id: memberId, ...member });
      addBotMessage(`${member.name} joined the room! 👋`);
    } catch (error) {
      console.error('Error getting member attributes:', error);
      addMember({ id: memberId, name: `User-${memberId.substring(0, 5)}` });
    }
  };

  const handleMemberLeft = async (memberId) => {
    removeMember(memberId);
    const member = members.find(m => m.id === memberId);
    if (member) {
      addBotMessage(`${member.name} left the room.`);
    }
  };

  const handleChannelMessage = async (messageData, memberId) => {
    const data = JSON.parse(messageData.text);
    if (data.type === 'chat') {
      addMessage(data.displayName, data.message);
    } else if (data.type === 'user_left') {
      removeStream(data.uid);
    }
  };

  const handleUserPublished = async (user, mediaType) => {
    await rtcClientRef.current.subscribe(user, mediaType);
    
    if (mediaType === 'video') {
      const remoteStream = {
        uid: user.uid,
        videoTrack: user.videoTrack,
        audioTrack: user.audioTrack
      };
      addStream(remoteStream);
    }

    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = (user) => {
    removeStream(user.uid);
    channelRef.current.sendMessage({ 
      text: JSON.stringify({ type: 'user_left', uid: user.uid })
    });
  };

  const joinStream = async () => {
    try {
      const tracks = await AgoraRTC.createMicrophoneAndCameraTracks(
        {}, 
        { 
          encoderConfig: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 }
          } 
        }
      );

      localTracksRef.current = tracks;
      await rtcClientRef.current.publish(tracks);

      const localStream = {
        uid: user._id,
        videoTrack: tracks[1],
        audioTrack: tracks[0],
        isLocal: true
      };

      addStream(localStream);
    } catch (error) {
      console.error('Failed to join stream:', error);
    }
  };

  const toggleMic = async () => {
    if (localTracksRef.current[0]) {
      await localTracksRef.current[0].setMuted(!isMicActive);
      setIsMicActive(!isMicActive);
    }
  };

  const toggleCamera = async () => {
    if (localTracksRef.current[1]) {
      await localTracksRef.current[1].setMuted(!isCameraActive);
      setIsCameraActive(!isCameraActive);
    }
  };

  const toggleScreenShare = async () => {
    if (isSharingScreen) {
      await stopScreenShare();
    } else {
      await startScreenShare();
    }
  };

  const startScreenShare = async () => {
    try {
      const screenTracks = await AgoraRTC.createScreenVideoTrack({}, 'auto');
      localScreenTracksRef.current = screenTracks;
      
      await rtcClientRef.current.unpublish(localTracksRef.current[1]);
      await rtcClientRef.current.publish(screenTracks);

      setIsSharingScreen(true);
    } catch (error) {
      console.error('Screen sharing failed:', error);
    }
  };

  const stopScreenShare = async () => {
    try {
      await rtcClientRef.current.unpublish(localScreenTracksRef.current);
      await rtcClientRef.current.publish(localTracksRef.current[1]);
      
      localScreenTracksRef.current.close();
      localScreenTracksRef.current = null;
      
      setIsSharingScreen(false);
    } catch (error) {
      console.error('Failed to stop screen share:', error);
    }
  };

  const leaveRoom = async () => {
    try {
      if (channelRef.current) {
        await channelRef.current.leave();
      }
      
      if (rtmClientRef.current) {
        await rtmClientRef.current.logout();
      }
      
      if (rtcClientRef.current) {
        if (localTracksRef.current) {
          localTracksRef.current.forEach(track => track.stop());
          localTracksRef.current.forEach(track => track.close());
          await rtcClientRef.current.unpublish(localTracksRef.current);
        }
        
        if (localScreenTracksRef.current) {
          localScreenTracksRef.current.stop();
          localScreenTracksRef.current.close();
          await rtcClientRef.current.unpublish(localScreenTracksRef.current);
        }
        
        await rtcClientRef.current.leave();
      }
      
      navigate('/lobby');
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      await channelRef.current.sendMessage({ 
        text: JSON.stringify({
          type: 'chat',
          message: messageInput,
          displayName: user.username
        })
      });

      addMessage(user.username, messageInput);
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const addMember = (member) => {
    setMembers(prev => [...prev, member]);
  };

  const removeMember = (memberId) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const updateMemberList = (memberIds) => {
    Promise.all(memberIds.map(async id => {
      try {
        const attributes = await rtmClientRef.current.getUserAttributes(id);
        return { id, ...attributes };
      } catch {
        return { id, name: `User-${id.substring(0, 5)}` };
      }
    })).then(memberData => {
      setMembers(memberData);
    });
  };

  const addStream = (stream) => {
    setStreams(prev => [...prev, stream]);
  };

  const removeStream = (streamId) => {
    setStreams(prev => prev.filter(s => s.uid !== streamId));
  };

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, text, isBot: false }]);
    scrollMessagesToBottom();
  };

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { sender: 'Mumble Bot', text, isBot: true }]);
    scrollMessagesToBottom();
  };

  const scrollMessagesToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const expandStream = (streamId) => {
    const stream = streams.find(s => s.uid === streamId);
    if (stream) {
      setMainStream(stream);
    }
  };

  const minimizeStream = () => {
    setMainStream(null);
  };

  return (
    <div className="room-container">
      <header id="nav">
        <div className="nav--list">
          <button id="members__button" onClick={() => setShowMembers(!showMembers)}>
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
              <path d="M24 18v1h-24v-1h24zm0-6v1h-24v-1h24zm0-6v1h-24v-1h24z" fill="#ede0e0"/>
              <path d="M24 19h-24v-1h24v1zm0-6h-24v-1h24v1zm0-6h-24v-1h24v1z"/>
            </svg>
          </button>
          <a href="/lobby">
            <h3 id="logo">
              <img src="./images/logo.png" alt="Mumble Logo" />
              <span>Mumble</span>
            </h3>
          </a>
        </div>
        <div id="nav__links">
          <button id="chat__button" onClick={() => setShowChat(!showChat)}>
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
              <path d="M24 20h-3v4l-5.333-4h-7.667v-4h2v2h6.333l2.667 2v-2h3v-8.001h-2v-2h4v12.001zm-15.667-6l-5.333 4v-4h-3v-14.001l18 .001v14h-9.667zm-6.333-2h3v2l2.667-2h8.333v-10l-14-.001v10.001z"/>
            </svg>
          </button>
          <button className="nav__link" id="leave__button" onClick={leaveRoom}>
            Leave
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M16 10v-5l8 7-8 7v-5h-8v-4h8zm-16-8v20h14v-2h-12v-16h12v-2h-14z"/>
            </svg>
          </button>
        </div>
      </header>

      <main className="container">
        <div id="room__container">
          {/* Members Sidebar */}
          <section id="members__container" className={showMembers ? 'active' : ''}>
            <div id="members__header">
              <p>Participants</p>
              <strong id="members__count">{members.length}</strong>
            </div>
            <div id="member__list">
              {members.map(member => (
                <div key={member.id} className="member__wrapper" id={`member__${member.id}__wrapper`}>
                  <span className="green__icon"></span>
                  {member.avatar && (
                    <img src={member.avatar} className="avatar__sm" alt={member.name} />
                  )}
                  <p className="member_name">{member.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Video Streams */}
          <section id="stream__container">
            {mainStream && (
              <div id="stream__box" onClick={minimizeStream}>
                <div className="video__container" id={`user-container-${mainStream.uid}`}>
                  <div 
                    className="video-player" 
                    id={`user-${mainStream.uid}`}
                    ref={el => {
                      if (el && mainStream.videoTrack) {
                        mainStream.videoTrack.play(el);
                      }
                    }}
                  ></div>
                </div>
              </div>
            )}

            <div id="streams__container" ref={streamsContainerRef}>
              {streams.filter(stream => !mainStream || stream.uid !== mainStream.uid).map(stream => (
                <div 
                  key={stream.uid} 
                  className="video__container" 
                  id={`user-container-${stream.uid}`}
                  onClick={() => expandStream(stream.uid)}
                >
                  <div 
                    className="video-player" 
                    id={`user-${stream.uid}`}
                    ref={el => {
                      if (el && stream.videoTrack) {
                        stream.videoTrack.play(el);
                      }
                    }}
                  ></div>
                </div>
              ))}
            </div>
            
            <div className="stream__actions">
              <button 
                id="camera-btn" 
                className={isCameraActive ? 'active' : ''}
                onClick={toggleCamera}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M5 4h-3v-1h3v1zm10.93 0l.812 1.219c.743 1.115 1.987 1.781 3.328 1.781h1.93v13h-20v-13h3.93c1.341 0 2.585-.666 3.328-1.781l.812-1.219h5.86zm1.07-2h-8l-1.406 2.109c-.371.557-.995.891-1.664.891h-5.93v17h24v-17h-3.93c-.669 0-1.293-.334-1.664-.891l-1.406-2.109zm-11 8c0-.552-.447-1-1-1s-1 .448-1 1 .447 1 1 1 1-.448 1-1zm7 0c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z"/>
                </svg>
              </button>
              <button 
                id="mic-btn" 
                className={isMicActive ? 'active' : ''}
                onClick={toggleMic}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2v-7c0-1.103.897-2 2-2zm0-2c-2.209 0-4 1.791-4 4v7c0 2.209 1.791 4 4 4s4-1.791 4-4v-7c0-2.209-1.791-4-4-4zm8 9v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13v-2h-2v2h-4v2h10v-2h-4z"/>
                </svg>
              </button>
              <button 
                id="screen-btn" 
                className={isSharingScreen ? 'active' : ''}
                onClick={toggleScreenShare}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M0 1v17h24v-17h-24zm22 15h-20v-13h20v13zm-6.599 4l2.599 3h-12l2.599-3h6.802z"/>
                </svg>
              </button>
              <button 
                id="leave-btn" 
                style={{ backgroundColor: '#FF5050' }}
                onClick={leaveRoom}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M16 10v-5l8 7-8 7v-5h-8v-4h8zm-16-8v20h14v-2h-12v-16h12v-2h-14z"/>
                </svg>
              </button>
            </div>

            <button id="join-btn" onClick={joinStream}>
              Join Stream
            </button>
          </section>

          {/* Chat Sidebar */}
          <section id="messages__container" className={showChat ? 'active' : ''}>
            <div id="messages" ref={messagesContainerRef}>
              {messages.map((message, index) => (
                <div key={index} className="message__wrapper">
                  <div className={`message__body ${message.isBot ? 'message__body__bot' : ''}`}>
                    <strong className={message.isBot ? 'message__author__bot' : 'message__author'}>
                      {message.sender}
                    </strong>
                    <p className="message__text">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <form id="message__form" onSubmit={sendMessage}>
              <input 
                type="text" 
                name="message" 
                placeholder="Send a message..." 
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                autoComplete="off"
              />
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Room;