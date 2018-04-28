import React, {Component} from 'react';
import {View, Text, StyleSheet,Dimensions,NetInfo} from 'react-native';
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
      currentTime: 0,
      isConnected: true
    };
  }


  //Reading Config file using REST GET
  readingJOSNFile(reponse){
    this.setState ({appFlow: reponse});
    console.log(this.state.appFlow)
    //Play About the app audio file
    this.firstTimeAudio();
  }


  //Audio Player functions
  platSorry(){
    this.onPlay(config.SORRY_URL,'Local');
  }

  fetchJSONFile(){
    const api = new connector();
    api.fetchAudioFlows()
    .then(reponse => this.readingJOSNFile(reponse)).catch(err => this.platSorry()); 
  }

  onPlay (file,location) {

    let artwork = null
    if( location != 'Local' ) {
      file = config.AUDIO_URL + file  + '.wav'
      artwork= config.ARTWORK
    }
    else{
      file = file
      artwork = 'default_artwork-t300x300' 
    }

    Player.play(file, {
      title: config.TITLE,
      artist: config.ARTIST,
      album_art_uri: artwork,
      location: location
    });
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

  advanceTenSeconds = () => {
    Player.seekTo (10000);
  }

  levelFlowIncreasing() {

    console.log(this.state.appFlow[this.state.flowLevel])
    level = processor.incrementalLevel(this.state.flowLevel)
    this.setState({flowLevel: level})
  }

  levelFlowDecreasing() {
    
    console.log(this.state.appFlow[this.state.flowLevel])
    level = processor.decrementalLevel(this.state.flowLevel)
    this.setState({flowLevel: level})

  }


  //Swipe handling functions
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

  swipeProcessor (direction){

    console.log(direction)
    console.log(this.state.appFlow[this.state.flowLevel].direction)
    this.onPlay(this.state.appFlow[this.state.flowLevel].direction,'Remote'); 
    if (direction == 'up')
    {
      this.onPlay(this.state.appFlow[this.state.flowLevel].up,'Remote'); 
      this.levelFlowDecreasing()
    }else {
      if (direction == 'right'){
        this.onPlay(this.state.appFlow[this.state.flowLevel].right,'Remote'); 
        this.levelFlowIncreasing();
      }else{
        if (direction == 'left'){
          this.onPlay(this.state.appFlow[this.state.flowLevel].left,'Remote'); 
          this.levelFlowIncreasing();
        }else{
          this.onPlay(this.state.appFlow[this.state.flowLevel].down,'Remote'); 
        }
      }
    }

  }

  onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
         this.state.isConnected ?  this.swipeProcessor('up') : this.platSorry(); 
        break;
      case SWIPE_DOWN:
         this.state.isConnected ?  this.swipeProcessor('down') : this.platSorry();
        break;
      case SWIPE_LEFT:
         this.state.isConnected ?  this.swipeProcessor('left') : this.platSorry();
        break;
      case SWIPE_RIGHT:
         this.state.isConnected ?  this.swipeProcessor('right') : this.platSorry();
        break;
    }
  }

  //App Loading functions
  componentDidMount(){
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  //Handle app connectivity
  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
      this.fetchJSONFile();
    } else {
      this.setState({ isConnected });
      this.platSorry();
    }
  };

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