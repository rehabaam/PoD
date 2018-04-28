import React, {Component} from 'react';
import {View, Text, StyleSheet,Dimensions,} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Player from 'react-native-streaming-audio-player';
import config from '../Configs/global'
import connector from '../Services/RESTConnector'
import processor from '../Services/LevelProcessor'
import DoubleClick from 'react-native-double-click';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: '#fff',
      isFirstTime: true,
      appFlow: null,
      flowLevel: null,
      flowData:null,
      currentTime: 0
    };
  }

  levelSetter(level){
    this.setState({flowLevel: level});
  }

  advanceTenSeconds = () => {
    console.log("test")
    Player.seekTo (10000);
  }

  levelFlowIncreasing() {

    console.log(this.state.appFlow[this.state.flowLevel])
    level = processor.incrementalLevel(this.state.flowLevel)
    this.setState({flowLevel: level})
    // console.log(level);
  }

  levelFlowDecreasing() {
    
    console.log(this.state.appFlow[this.state.flowLevel])
    level = processor.decrementalLevel(this.state.flowLevel)
    this.setState({flowLevel: level})

  }

  readingJOSNFile(reponse){
    this.setState ({appFlow: reponse});
    console.log(this.state.appFlow)
    //Play About the app audio file
    this.firstTimeAudio();
  }

  platSorry(){
    this.onPlay(config.SORRY_URL,'Local');
  }

  fetchJSONFile(){
    const api = new connector();
    api.fetchAudioFlows()
    .then(reponse => this.readingJOSNFile(reponse)).catch(err => this.platSorry()); 
  }

  onPlay (file,location) {

    if( location != 'Local' ) {
      file = config.AUDIO_URL + file  + '.wav'
    }
    else{
      file = file
    }

    Player.play(file, {
      title: config.TITLE,
      artist: config.ARTIST,
      album_art_uri: config.ARTWORK,
      location: location
    });
    console.log(file);
  }

  onPause() {
    Player.pause();
  }

  onStop(){
    Player.stop();
  }

  firstTimeAudio(){
    this.setState({flowLevel: 0});
    this.onPlay('0000000','Remote');
  }

  onSwipeUp(gestureState) {
    this.setState({myText: 'You swiped up!'});
  }

  onSwipeDown(gestureState) {
    this.setState({myText: 'You swiped down!'});
  }

  onSwipeLeft(gestureState) {
    this.setState({myText: 'You swiped left!'});
  }

  onSwipeRight(gestureState) {
    this.setState({myText: 'You swiped right!'});
  }

  onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
      this.onPlay(this.state.appFlow[this.state.flowLevel].up,'Remote');
      this.levelFlowDecreasing();
        break;
      case SWIPE_DOWN:
      this.onPlay(this.state.appFlow[this.state.flowLevel].down,'Remote');
        break;
      case SWIPE_LEFT:
      this.onPlay(this.state.appFlow[this.state.flowLevel].left,'Remote');
        break;
      case SWIPE_RIGHT:
      this.onPlay(this.state.appFlow[this.state.flowLevel].right,'Remote');
      this.levelFlowIncreasing();
        break;
    }
  }
  componentDidMount(){
    this.fetchJSONFile();
  }

  render() {
    
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    return (
      
      <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        onSwipeUp={(state) => this.onSwipeUp(state)}
        onSwipeDown={(state) => this.onSwipeDown(state)}
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor
        }}
        >
    <DoubleClick onClick={this.advanceTenSeconds.bind(this)} style={styles.container}>
      </DoubleClick>
      </GestureRecognizer>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
     backgroundColor: '#fff',
  },
});