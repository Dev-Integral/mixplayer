import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TrackPlayer, { 
  Capability, 
  State, 
  Event, 
  useTrackPlayerEvents 
} from 'react-native-track-player';
const MIX_URL = "https://stream-169.zeno.fm/htrnfxelk4otv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJodHJuZnhlbGs0b3R2IiwiaG9zdCI6InN0cmVhbS0xNjkuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6ImdmUEtTeVotUUFlWUc3cjdINEMyMEEiLCJpYXQiOjE3NDc1Nzk4MTYsImV4cCI6MTc0NzU3OTg3Nn0.5-gLuUNgePaLXdA70Mr_IwHtN-YygZx1t74Hg2CVy34";

// Setup audio player
async function setupPlayer() {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
    ],
  });

  await TrackPlayer.add({
    id: 'radio-o',
    url: MIX_URL, // Replace with your URL
    title: 'Radio O',
    artist: 'Your soul station',
  });
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize player
  useEffect(() => {
    setupPlayer();
    
    return () => {
      TrackPlayer.reset(); // Changed from destroy() to reset()
    };
  }, []);

  // Toggle play/pause
  const togglePlayback = async () => {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
      setIsPlaying(false);
    } else {
      await TrackPlayer.play();
      setIsPlaying(true);
    }
  };

  // Listen for playback state
  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.state === State.Playing) setIsPlaying(true);
    else if (event.state === State.Paused) setIsPlaying(false);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DJ Mix Player</Text>
      <TouchableOpacity onPress={togglePlayback} style={styles.button}>
        <Text style={styles.buttonText}>{isPlaying ? '⏸' : '▶'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1DB954',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
  },
});