import React, {useEffect} from 'react';
import {View, Text, AsyncStorage} from 'react-native';
import firebase from 'react-native-firebase';
const App = () => {
  async function getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }
  async function checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      getToken();
    } else {
      resquestPermission();
    }
  }
  async function resquestPermission() {
    try {
      await firebase.messaging().requestPermission();
      getToken();
    } catch (err) {
      console.log('permission rejected');
    }
  }
  async function createNotificationListener() {
    firebase.notifications().onNotification(notification => {
      notification.android.setChannelId('insider').setSound('default');
      firebase.notifications().displayNotification(notification);
    });
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      const channel = new firebase.notifications.Android.Channel(
        'insider',
        'insider channel',
        firebase.notifications.Android.Importance.Max,
      );
      firebase.notifications().android.createChannel(channel);
      checkPermission();
      createNotificationListener();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <View>
      <Text>Hi</Text>
    </View>
  );
};

export default App;
