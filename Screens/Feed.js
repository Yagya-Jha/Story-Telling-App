import AppLoading from 'expo-app-loading';
import * as React from 'react';
import { Text, View, StyleSheet, Platform, StatusBar,Image,FlatList } from 'react-native';
import * as Font from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import StoryCard from './StoryCard'
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';

let custom_font = {'Bubbegum-Sans':require('../assets/fonts/BubblegumSans-Regular.ttf')}
let stories = require("./temp_stories.json");

export default class Feed extends React.Component{
    constructor(){
        super();
        this.state = {
            fontsLoaded: false,
            lighTheme: true,
            stories: [],
        };
    }

    fetchUser = async ()=>{
      let theme;
      await firebase.database().ref("/users/"+firebase.auth().currentUser.uid).on("value",(snapshot)=>{
          theme = snapshot.val().current_theme;
          this.setState({lightTheme: theme==="light"})
       })
      }

    async loadFonts(){
        await Font.loadAsync(custom_font);
        this.setState({fontsLoaded: true});
    }

    fetchStories = () =>{
      firebase.database().ref("/Posts/").on("value", (snapshot)=>{
        let stories = [];
        if(snapshot.val()){
          Object.keys(snapshot.val()).forEach(function(key){
            stories.push({key: key, value: snapshot.val()[key]})
          });
        }
        this.setState({stories: stories});
        this.props.setUpdateToFalse();
      },
      
      function(errorObject){console.log("Not able to read files" + errorObject.code)}
      );
    }

    componentDidMount(){
        this.loadFonts();
        this.fetchUser();
        this.fetchStories();
    }

    renderItem = ({item: story})=>{
        return <StoryCard story = {story} navigation = {this.props.navigation} />
    };

    keyExtractor = (item, index)=> index.toString();

    render(){
    if(! this.state.fontsLoaded){
        return <AppLoading />
    }
    else{
        return(
          <View style = {this.state.lightTheme?styles.containerLight:styles.container}>
          <SafeAreaView style = {styles.safeview}/>
              <View style = {styles.appTitle}>
                      <View style = {styles.appIcon}>
                          <Image source = {require('../assets/logo.png')} style = {styles.iconImage}/>
                      </View>
                      <View style = {styles.appTitleTextContainer}>
                          <Text style = {this.state.lightTheme?styles.appTitleTextLight:styles.appTitleText}>
                              Story-Telling App
                          </Text>
                      </View>
              </View>
                    
                      {! this.state.stories[0]?
                      (<View style = {styles.nostories}>
                        <Text style = {this.state.lightTheme?styles.nostoriesTextLight:styles.nostoriesText}>No Stories Available</Text>
                      </View>)
                        :
                        (<View style = {styles.cardContainer}>
                            <FlatList 
                            keyExtractor = {this.keyExtractor}
                            data = {this.state.stories}
                            renderItem = {this.renderItem}/>
                          </View>)}
          </View>
            )
        }
    }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor: "#15193c"
  },
  containerLight: {
    flex: 1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor: "white"
  },
    safeView: {
      marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
    },
    appTitle: {
      flex: 0.07,
      flexDirection: "row"
    },
    appIcon: {
      flex: 0.3,
      justifyContent: "center",
      alignItems: "center"
    },
    iconImage: {
      width: "100%",
      height: "100%",
      resizeMode: "contain"
    },
    appTitleTextContainer: {
      flex: 0.7,
      justifyContent: "center"
    },
    appTitleText: {
      color: "white",
      fontSize: RFValue(25),
      fontFamily: "Bubblegum-Sans"
    },
    appTitleTextLight: {
      color: "black",
      fontSize: RFValue(25),
      fontFamily: "Bubblegum-Sans"
    },
    cardContainer: {
      flex: 0.93
    },
    nostories:{
      flex: 0.85,
      justifyContent: "center",
      alignItems:"center"
    },
    nostoriesText:{
      color: 'white',
      fontSize: RFValue(40),
      fontFamily: 'Bubblegum-Sans'
    },
    nostoriesTextLight:{
      color: 'black',
      fontSize: RFValue(40),
      fontFamily: 'Bubblegum-Sans'
    },
  });
  