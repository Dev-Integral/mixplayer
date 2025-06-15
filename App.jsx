import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import TrackPlayer, { 
  Capability, 
  State, 
  Event, 
  useTrackPlayerEvents 
} from 'react-native-track-player';

const MIX_URL = "https://stream-169.zeno.fm/htrnfxelk4otv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJodHJuZnhlbGs0b3R2IiwiaG9zdCI6InN0cmVhbS0xNjkuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6ImdmUEtTeVotUUFlWUc3cjdINEMyMEEiLCJpYXQiOjE3NDc1Nzk4MTYsImV4cCI6MTc0NzU3OTg3Nn0.5-gLuUNgePaLXdA70Mr_IwHtN-YygZx1t74Hg2CVy34";

const { width: screenWidth } = Dimensions.get('window');

// Local images from assets folder
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
  const scrollViewRef = useRef(null);
  const slideInterval = useRef(null);

  // Initialize player
  useEffect(() => {
    setupPlayer();
    
    return () => {
      TrackPlayer.reset();
      clearInterval(slideInterval.current);
    };
  }, []);

  // Auto-play slider
  useEffect(() => {
    const autoPlay = () => {
      const nextSlide = (currentSlide + 1) % SLIDER_IMAGES.length;
      scrollViewRef.current?.scrollTo({
        x: nextSlide * screenWidth,
        animated: true
      });
      setCurrentSlide(nextSlide);
    };

    slideInterval.current = setInterval(autoPlay, 3000); // Change slide every 3 seconds

    return () => clearInterval(slideInterval.current);
  }, [currentSlide]);

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

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    setCurrentSlide(index);
  };

  return (
    <View style={styles.container}>
      {/* Tile 1: Image Slider */}
      <View style={styles.sliderContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {SLIDER_IMAGES.map((image, index) => (
            <Image 
              key={index}
              source={image}
              style={styles.slideImage}
            />
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

      {/* Tile 2: Album Art - Made larger */}
      <View style={styles.albumTile}>
        <Image 
          source={require('./assets/1.png')}
          style={styles.albumArt}
          resizeMode="contain"
        />
      </View>

      {/* Tile 3: Controls */}
      <View style={styles.controlsTile}>
        <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
          <Text style={styles.playButtonText}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
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
  sliderContainer: {
    height: 300, // Increased height for the slider
    marginBottom: 20,
    position: 'relative',
  },
  slideImage: {
    width: screenWidth - 40, // accounting for container padding
    height: '100%',
    resizeMode: 'cover',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#888',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#1DB954',
  },
  albumTile: {
    height: 300, // Made same height as slider
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumArt: {
    width: '90%', // Takes 90% of container width
    height: '90%', // Takes 90% of container height
  },
  controlsTile: {
    height: 80,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
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