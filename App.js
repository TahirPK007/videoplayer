import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';

const App = () => {
  const [clicked, setclicked] = useState(false);
  const [paused, setpaused] = useState(false);
  const [fullScreen, setfullScreen] = useState(false);
  const ref = useRef();

  const [progress, setprogress] = useState(null);
  const format = seconds => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    const handleOrientationChange = orientation => {
      if (orientation === 'PORTRAIT') {
        setfullScreen(false);
      } else if (
        orientation === 'LANDSCAPE-LEFT' ||
        orientation === 'LANDSCAPE-RIGHT'
      ) {
        setfullScreen(true);
      }
    };
    Orientation.addOrientationListener(handleOrientationChange);

    return () => {
      // Clean up the event listener on unmount
      Orientation.removeOrientationListener(handleOrientationChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (fullScreen) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscape();
    }
  };

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={{width: '100%', height: fullScreen ? '100%' : 300}}
        onPress={() => [setclicked(true)]}>
        <Video
          source={{
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }}
          // onBuffer={this.onBuffer}
          // onError={this.videoError}
          muted
          paused={paused}
          ref={ref}
          onProgress={x => {
            setprogress(x);
          }}
          style={{width: '100%', height: fullScreen ? '100%' : 300}}
          resizeMode="contain"
        />
        {clicked && (
          <TouchableOpacity
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  ref.current.seek(parseInt(progress.currentTime) - 10);
                }}>
                <Image
                  style={{width: 40, height: 40, tintColor: 'white'}}
                  source={require('./src/images/backward.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setpaused(!paused);
                }}>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    tintColor: 'white',
                    marginLeft: 50,
                  }}
                  source={
                    paused
                      ? require('./src/images/play.png')
                      : require('./src/images/pause.png')
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  ref.current.seek(parseInt(progress.currentTime) + 10);
                }}>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    tintColor: 'white',
                    marginLeft: 50,
                  }}
                  source={require('./src/images/forward.png')}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                bottom: 0,
                paddingLeft: 20,
                paddingRight: 20,
                alignItems: 'center',
              }}>
              <Text style={{color: 'white'}}>
                {format(progress.currentTime)}
              </Text>
              <Slider
                style={{width: '80%', height: 40}}
                minimumValue={0}
                maximumValue={progress.seekableDuration}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="white"
                onValueChange={x => {
                  ref.current.seek(x);
                }}
              />
              <Text style={{color: 'white'}}>
                {format(progress.seekableDuration)}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                top: 20,
                paddingLeft: 20,
                paddingRight: 20,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  toggleFullScreen();
                }}>
                <Image
                  style={{height: 30, width: 30, tintColor: 'white'}}
                  source={require('./src/images/full-screen.png')}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default App;
