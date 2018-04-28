import React, {Component} from 'react';
import RestClient from 'react-native-rest-client';
const config = require('../Configs/global');

export default class RESTConnector extends RestClient {
  constructor () {
    // Initialize with your base URL
    super(config.SERVER_URL);
  }
  // Now you can write your own methods easily
  fetchAudioFlows () {
    return this.GET(config.JSON_FILE)
  }
};