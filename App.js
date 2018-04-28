/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Swipper from './src/MainScreen/Swipper';
import SplashScreen from 'react-native-splash-screen'

type Props = {};
export default class App extends Component<Props> {

  componentDidMount() {
  	SplashScreen.hide();
  }

  
  render() {
    return (
      <View style={styles.container}>
        <Swipper /> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
});
