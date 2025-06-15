import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions, 
  ScrollView 
} from 'react-native';
import TrackPlayer, { 
  Capability, 
  State, 
  Event, 
  useTrackPlayerEvents 
} from 'react-native-track-player';
import radio_o from "../assets/radio_o.png";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faContactBook } from '@fortawesome/free-solid-svg-icons';
import Contact from './Contact';

const MIX_URL = "https://stream-169.zeno.fm/htrnfxelk4otv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJodHJuZnhlbGs0b3R2IiwiaG9zdCI6InN0cmVhbS0xNjkuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6ImdmUEtTeVotUUFlWUc3cjdINEMyMEEiLCJpYXQiOjE3NDc1Nzk4MTYsImV4cCI6MTc0NzU3OTg3Nn0.5-gLuUNgePaLXdA70Mr_IwHtN-YygZx1t74Hg2CVy34";

const { width: screenWidth } = Dimensions.get('window');

// Local images from assets folder
const SLIDER_IMAGES = [
  require('../assets/1.png'),
  require('../assets/2.png'),
  require('../assets/3.png'),
  require('../assets/4.png'),
  require('../assets/5.png'),
  require('../assets/6.png'),
  require('../assets/7.png'),
  require('../assets/8.png'),
  require('../assets/9.png'),
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
    artwork: require('../assets/1.png'),
  });
}

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef(null);
  const slideInterval = useRef(null);
  const [currentKey, setCurrentKey] = useState('home');

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
        x: nextSlide * (screenWidth - 40),
        animated: true
      });
      setCurrentSlide(nextSlide);
    };

    slideInterval.current = setInterval(autoPlay, 3000);

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
    const index = Math.round(contentOffset / (screenWidth - 40));
    setCurrentSlide(index);
  };

  return currentKey === "home" ? (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Image style={styles.header} source={radio_o} />
        <TouchableOpacity onPress={()=> setCurrentKey('contact')} style={styles.contactButton}>
          <FontAwesomeIcon icon={faContactBook} size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Image Slider */}
      <View style={styles.sliderContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ width: (screenWidth - 40) * SLIDER_IMAGES.length }}
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

      {/* Album Art */}
      <View style={styles.albumTile}>
        <Image 
          source={require('../assets/10.png')}
          style={styles.albumArt}
        />
      </View>

      {/* Controls */}
      <View style={styles.controlsTile}>
        <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
          <Text style={styles.playButtonText}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
      </View>
    </View> 
  ) : (<Contact setCurrentKey={setCurrentKey} />);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    width: 120,
    height: 70,
    resizeMode: "cover",
    marginBottom: 20,
  },
  sliderContainer: {
    height: 400,
    marginBottom: 20,
    position: 'relative',
  },
  slideImage: {
    width: Dimensions.get('window').width - 40,
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10
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
    backgroundColor: 'yellow',
  },
  albumTile: {
    height: 350,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumArt: {
    width: '100%',
    height: '100%',
    borderRadius: 10
  },
  controlsTile: {
    height: 80,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
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
});