import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions, 
  ScrollView,
  ActivityIndicator
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

// Global player state
let playerInitialized = false;

async function setupPlayer() {
  if (playerInitialized) {
    console.log('Player already initialized - skipping');
    return;
  }

  try {
    console.log('Initializing player...');
    await TrackPlayer.setupPlayer();
    playerInitialized = true;

    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
      ],
    });

    await TrackPlayer.add({
      id: 'radio-o',
      url: MIX_URL,
      title: 'Radio O',
      artist: 'Your soul station',
      artwork: require('../assets/1.png'),
      isLiveStream: true
    });

    console.log('Player initialized successfully');
  } catch (error) {
    console.error('Player setup error:', error);
    if (error.message.includes('already been initialized')) {
      playerInitialized = true;
      return;
    }
    throw error;
  }
}

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef(null);
  const slideInterval = useRef(null);
  const [currentKey, setCurrentKey] = useState('home');

  useEffect(() => {
    const initPlayer = async () => {
      try {
        await setupPlayer();
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initPlayer();

    return () => {
      console.log('Cleaning up...');
      clearInterval(slideInterval.current);
      // Note: We don't reset the player here to maintain background playback
    };
  }, []);

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

  const togglePlayback = async () => {
    try {
      setIsLoading(true);
      
      if (!playerInitialized) {
        await setupPlayer();
      }

      const state = await TrackPlayer.getState();
      if (state === State.Playing) {
        console.log('Stopping playback...');
        await TrackPlayer.stop();
        setIsPlaying(false);
      } else {
        console.log('Starting playback...');
        await TrackPlayer.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback toggle error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    console.log('Playback state changed:', event.state);
    switch (event.state) {
      case State.Playing:
        setIsPlaying(true);
        setIsLoading(false);
        break;
      case State.Stopped:
        setIsPlaying(false);
        setIsLoading(false);
        break;
      case State.Buffering:
        setIsLoading(true);
        break;
      default:
        setIsLoading(false);
    }
  });

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (screenWidth - 40));
    setCurrentSlide(index);
  };

  return currentKey === "home" ? (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Image 
          style={styles.header} 
          source={radio_o} 
          onError={(e) => console.log('Header image error:', e.nativeEvent.error)}
        />
        <TouchableOpacity onPress={() => setCurrentKey('contact')} style={styles.contactButton}>
          <FontAwesomeIcon icon={faContactBook} size={24} color="white" />
        </TouchableOpacity>
      </View>

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
              onError={(e) => console.log(`Slider image ${index} error:`, e.nativeEvent.error)}
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

      <View style={styles.albumTile}>
        <Image 
          source={require('../assets/10.png')}
          style={styles.albumArt}
          onError={(e) => console.log('Album art error:', e.nativeEvent.error)}
        />
      </View>

      <View style={styles.controlsTile}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#1DB954" />
        ) : (
          <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
            <Text style={styles.playButtonText}>{isPlaying ? '■' : '▶'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View> 
  ) : <Contact setCurrentKey={setCurrentKey} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    width: 80,
    height: 50,
    resizeMode: "cover",
    marginBottom: 20,
  },
  sliderContainer: {
    height: Dimensions.get('window').width > 767 ? 350 : 220,
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
    height: Dimensions.get('window').width > 767 ? 350 : 220,
    backgroundColor: '#1E1E1E',
    borderRadius: 30,
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