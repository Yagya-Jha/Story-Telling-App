import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './Screens/DrawerNavigator';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import Login from './Screens/Login';
import Loading from './Screens/Loading';
import Dashboard from './Screens/Dashboard';
import * as firebase from 'firebase';
import { firebaseConfig } from './Config';

if(! firebase.apps.length){
 firebase.initializeApp(firebaseConfig)
}else{
  firebase.app();
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: Loading,
  LoginScreen: Login,
  Dashboard: Dashboard,
});

const AppNavigator = createAppContainer(AppSwitchNavigator)

export default function App() {
    return (
      <AppNavigator />
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
