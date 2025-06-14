import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import TrackPlayer, { 
  Capability, 
  State, 
  Event, 
  useTrackPlayerEvents 
} from 'react-native-track-player';

const MIX_URL = "https://stream-169.zeno.fm/htrnfxelk4otv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJodHJuZnhlbGs0b3R2IiwiaG9zdCI6InN0cmVhbS0xNjkuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6ImdmUEtTeVotUUFlWUc3cjdINEMyMEEiLCJpYXQiOjE3NDc1Nzk4MTYsImV4cCI6MTc0NzU3OTg3Nn0.5-gLuUNgePaLXdA70Mr_IwHtN-YygZx1t74Hg2CVy34";

// Mock images for the slider
const SLIDER_IMAGES = [
  require('./assets/1.png'),
  require('./assets/2.png'),
  require('./assets/3.png'),
];

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
    url: MIX_URL,
    title: 'Radio O',
    artist: 'Your soul station',
    artwork: require('./assets/1.png'),
  });
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Initialize player
  useEffect(() => {
    setupPlayer();
    
    return () => {
      TrackPlayer.reset();
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
      {/* Tile 1: Image Slider */}
      <View style={styles.tile}>
        <ScrollView 
          horizontal 
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const slide = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
            setCurrentSlide(slide);
          }}
        >
          {SLIDER_IMAGES.map((image, index) => (
            <Image key={index} source={image} style={styles.sliderImage} />
          ))}
        </ScrollView>
        <View style={styles.pagination}>
          {SLIDER_IMAGES.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.paginationDot, 
                index === currentSlide && styles.activeDot
              ]} 
            />
          ))}
        </View>
      </View>

      {/* Tile 2: Album Art */}
      <View style={styles.tile}>
        <Image 
          source={require('./assets/1.png')} 
          style={styles.albumArt} 
        />
      </View>

      {/* Tile 3: Controls */}
      <View style={styles.controlsTile}>
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
            <Text style={styles.playButtonText}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  tile: {
    height: 200,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#888',
    margin: 5,
  },
  activeDot: {
    backgroundColor: '#1DB954',
  },
  albumArt: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  controlsTile: {
    height: 100,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    justifyContent: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  playButton: {
    backgroundColor: '#1DB954',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    color: 'white',
    fontSize: 24,
  },
  contactButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
  },
});