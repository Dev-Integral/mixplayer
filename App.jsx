import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player';

const MIX_URL = "https://stream-169.zeno.fm/htrnfxelk4otv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJodHJuZnhlbGs0b3R2IiwiaG9zdCI6InN0cmVhbS0xNjkuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6ImdmUEtTeVotUUFlWUc3cjdINEMyMEEiLCJpYXQiOjE3NDc1Nzk4MTYsImV4cCI6MTc0NzU3OTg3Nn0.5-gLuUNgePaLXdA70Mr_IwHtN-YygZx1t74Hg2CVy34";

export default function App() {
  const playbackState = usePlaybackState();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function setup() {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add({
        id: 'dj-mix',
        url: MIX_URL,
        title: 'My Favorite DJ Mix',
        artist: 'DJ Cool',
        artwork: 'https://link-to-artwork.jpg',
      });
    }

    setup();

    return () => {
      TrackPlayer.destroy();
    };
  }, []);

  const togglePlayback = async () => {
    const currentState = await TrackPlayer.getState();

    if (currentState === State.Playing) {
      await TrackPlayer.pause();
      setIsPlaying(false);
    } else {
      await TrackPlayer.play();
      setIsPlaying(true);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' }}>
      <Text style={{ color: 'white', fontSize: 20, marginBottom: 20 }}>🎧 DJ Mix Player</Text>
      <TouchableOpacity
        onPress={togglePlayback}
        style={{
          padding: 20,
          backgroundColor: '#1db954',
          borderRadius: 50,
        }}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>
          {isPlaying ? 'Pause' : 'Play'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
