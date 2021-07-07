import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feed from './Feed';
import CreateStory from './CreateStory';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';

const Tab = createMaterialBottomTabNavigator();

export default class BottomTabNavigator extends React.Component {
  constructor(){
    super();
    this.state = {lightTheme: true, isUpdated: false};
  }

  fetchUser = async ()=>{
    let theme;
    await firebase.database().ref("/users/"+firebase.auth().currentUser.uid).on("value",(snapshot)=>{
        theme = snapshot.val().current_theme;
        this.setState({lightTheme: theme==="light"})
     })
    }
  changeUpdated = () => {
    this.setState({isUpdated: true})
  }
  removeUpdated = () => {
    this.setState({isUpdated: false})
  }

  renderfeed = (props) =>{
    return <Feed setUpdateToFalse = {this.removeUpdated} {...props}/>
  }

  renderStory = (props) =>{
    return <CreateStory setUpdateToTrue = {this.changeUpdated} {...props}/>
  }

  componentDidMount(){
    this.fetchUser();
  }
  render(){
    return (
        <Tab.Navigator
          labeled = {false}
          barStyle = {this.state.lightTheme?styles.bottomtabstyleLight:styles.bottomtabstyle}
          screenOptions = {({route})=>({
            tabBarIcon: ({focused, color, size})=>{
            let iconname;

            if(route.name==='Feed'){
              iconname = focused?'home':'home-outline';
            }else if(route.name === 'CreateStory'){
              iconname = focused?'add-circle':'add-circle-outline'
            }
            return < Ionicons name = {iconname} itemname size = {RFValue(25)} color = {color} style = {styles.icons}/>
            },})}
            tabBarOptions = {{
              activeTintColor: 'black',
              inactiveTintColor: 'grey'
            }}>
            <Tab.Screen name = "Feed" component = {this.renderfeed} options = {{unmountOnBlur: true}}/>
            <Tab.Screen name = "CreateStory" component = {this.renderStory} options = {{unmountOnBlur: true}}/>
          </Tab.Navigator>
    );
}
  }

  const styles = StyleSheet.create({
    bottomtabstyle:{
      backgroundColor: "#2f345d",
      height: '8%',
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
      overflow: "hidden",
      position: "absolute",
    },
    bottomtabstyleLight:{
      backgroundColor: "#eaeaea",
      height: '8%',
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
      overflow: "hidden",
      position: "absolute",
    },
    icons: {
      width: RFValue(30),
      height: RFValue(30),
    }
  });