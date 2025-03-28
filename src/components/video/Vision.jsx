import React, { Component } from 'react';
import { connect } from 'twilio-video';
import axios from 'axios';
import './Video.css';
class VideoCallComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      identity: '',
      room: null,
      isRecording: false,
      participants: []
    };
    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();
  }

  joinRoom = async () => {
    try {
      const { identity, roomName } = this.state;
      const response = await axios.post('http://localhost:3001/token', {
        identity,
        roomName
      });

      const { token } = response.data;
      const room = await connect(token, {
        name: roomName,
        audio: true,
        video: { width: 640 }
      });

      this.setState({ room });

      // Afficher le stream local
      room.localParticipant.videoTracks.forEach(publication => {
        if (publication.isSubscribed) {
          const track = publication.track;
          this.localVideoRef.current.appendChild(track.attach());
        }
      });

      // Gérer les participants
      room.participants.forEach(this.participantConnected);
      room.on('participantConnected', this.participantConnected);
      room.on('participantDisconnected', this.participantDisconnected);

    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  participantConnected = (participant) => {
    this.setState(prevState => ({
      participants: [...prevState.participants, participant]
    }));

    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        const track = publication.track;
        this.remoteVideoRef.current.appendChild(track.attach());
      }
    });

    participant.on('trackSubscribed', track => {
      if (track.kind === 'video') {
        this.remoteVideoRef.current.appendChild(track.attach());
      }
    });
  };

  participantDisconnected = (participant) => {
    this.setState(prevState => ({
      participants: prevState.participants.filter(p => p !== participant)
    }));
  };

  startRecording = async () => {
    try {
      await axios.post('http://localhost:3001/start-recording', { 
        roomName: this.state.roomName 
      });
      this.setState({ isRecording: true });
      alert('Enregistrement démarré!');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  stopRecording = async () => {
    try {
      await axios.post('http://localhost:3001/stop-recording', { 
        roomName: this.state.roomName 
      });
      this.setState({ isRecording: false });
      alert('Enregistrement arrêté!');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  leaveRoom = () => {
    const { room } = this.state;
    if (room) {
      room.disconnect();
      this.setState({ room: null, participants: [] });
      if (this.localVideoRef.current) this.localVideoRef.current.innerHTML = '';
      if (this.remoteVideoRef.current) this.remoteVideoRef.current.innerHTML = '';
    }
  };

  componentWillUnmount() {
    this.leaveRoom();
  }

  render() {
    const { roomName, identity, room, isRecording, participants } = this.state;

    return (
      <div className="video-call-container">
        {!room ? (
          <div className="join-form">
            <h2>Rejoindre une visioconférence</h2>
            <input
              type="text"
              placeholder="Votre nom"
              value={identity}
              onChange={(e) => this.setState({ identity: e.target.value })}
            />
            <input
              type="text"
              placeholder="Nom de la salle"
              value={roomName}
              onChange={(e) => this.setState({ roomName: e.target.value })}
            />
            <button onClick={this.joinRoom}>Rejoindre</button>
          </div>
        ) : (
          <div className="room-container">
            <h2>Salle: {roomName}</h2>
            
            <div className="video-grid">
              <div className="local-video" ref={this.localVideoRef}></div>
              <div className="remote-videos" ref={this.remoteVideoRef}></div>
            </div>

            <div className="controls">
              <button 
                onClick={this.startRecording} 
                disabled={isRecording}
              >
                Démarrer l'enregistrement
              </button>
              <button 
                onClick={this.stopRecording} 
                disabled={!isRecording}
              >
                Arrêter l'enregistrement
              </button>
              <button onClick={this.leaveRoom}>Quitter la salle</button>
            </div>

            <div className="participants">
              <h3>Participants ({participants.length + 1})</h3>
              <ul>
                <li>Vous ({identity})</li>
                {participants.map((participant, index) => (
                  <li key={index}>{participant.identity}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default VideoCallComponent;