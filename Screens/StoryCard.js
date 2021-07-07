import AppLoading from 'expo-app-loading';
import * as React from 'react';
import { Text, View, StyleSheet, Platform, StatusBar,Image, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons'
import StoryScreen from './StoryScreen';
import firebase from 'firebase';

let custom_font = {'Bubblegum-Sans':require('../assets/fonts/BubblegumSans-Regular.ttf')}

export default class StoryCard extends React.Component{
    constructor(){
        super();
        this.state = {
            fontsLoaded: false,
            lightTheme: true,
            story_id: this.props.story.key,
            story_data: this.props.story.value,
            isLiked: false,
            likes: this.props.story.value.likes
        };
    }

    fetchUser = async ()=>{
        let theme;
        await firebase.database().ref("/users/"+firebase.auth().currentUser.uid).on("value",(snapshot)=>{
            theme = snapshot.val().current_theme;
            this.setState({lightTheme: theme==="light"})
        });
     }

    async loadFonts(){
        await Font.loadAsync(custom_font);
        this.setState({fontsLoaded: true});
    }

    componentDidMount(){
        this.loadFonts();
        this.fetchUser();
    }

    likeAction(){
        if(this.state.isLiked){
            firebase.database().ref("Posts").child(this.state.story_id).child('likes').set(
                firebase.database.ServerValue.increment(-1)
            );
            this.setState({likes: this.state.likes-=1, isLiked: false})
        }else {
            firebase.database().ref("Posts").child(this.state.story_id).child('likes').set(
                firebase.database.ServerValue.increment(1)
            );
            this.setState({likes: this.state.likes+=1, isLiked: true})
        }
    }

    render(){
        if(! this.state.fontsLoaded){
            return <AppLoading />
        }
        else{
            let images = {
                "image_1": require('../assets/story_image_1.png'),
                "image_2": require('../assets/story_image_2.png'),
                "image_3": require('../assets/story_image_3.png'),
                "image_4": require('../assets/story_image_4.png'),
                "image_5": require('../assets/story_image_5.png'),
            }
            return(
                <TouchableOpacity style = {styles.container} onPress = {()=>{this.props.navigation.navigate('StoryScreen', {story: this.props.story})}}>
                    <View style = {this.state.lightTheme?styles.cardContainerLight :styles.cardContainer}>
                        <Image source = {images[story.previewImage]} style = {styles.storyImg} />
                        <View style = {styles.titleContainer}>
                            <Text style = {this.state.lightTheme?styles.titleTextLight:styles.titleText}>
                                {this.props.story.title}
                            </Text>
                            <Text style = {this.state.lightTheme?styles.titleTextLight:styles.titleText}>
                                {this.props.story.author}
                            </Text>
                            <Text style = {this.state.lightTheme?styles.descriptionTextLight:styles.descriptionText}>
                                {this.props.story.description}
                            </Text>
                        </View>
                        <View style = {styles.actionContainer}>
                        <TouchableOpacity style = {this.state.isLiked? styles.likeButtonLiked: styles.likeButtonDisLiked} onPress = {()=> this.likeAction()}>
                                  <View style = {styles.likeButton}>
                                      <Ionicons name = {"heart"} size = {RFValue(25)} color = "white" />
                                          <Text style = {this.state.lightTheme? styles.likeTextLight:styles.likeText}>
                                              {this.state.likes}
                                          </Text>
                                  </View>
                        </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: '50%',
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
    storyImg: {
      width: "95%",
      height: RFValue(250),
      resizeMode: "contain",
      alignSelf:"center",
    },
    titleContainer: {
      paddingLeft: RFValue(20),
      justifyContent: "center"
    },
    titleText: {
      color: "white",
      fontSize: RFValue(28),
      fontFamily: "Bubblegum-Sans"
    },
    titleTextLight: {
        color: "black",
        fontSize: RFValue(28),
        fontFamily: "Bubblegum-Sans"
      },
    cardContainer: {
        marginTop: -20,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: "#15193c",
        padding: 10,
        borderRadius: 20,
        height: undefined,
    },
    cardContainerLight: {
        marginTop: -20,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 20,
        height: undefined,
        shadowColor: 'rgb(0,0,0)',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 2,
      },
    actionContainer:{
        justifyContent:"center",
        alignItems: "center",
        padding: RFValue(10),
    },
    likeButtonLiked: {
        width: RFValue(160),
        height: RFValue(40),
        flexDirection: "row",
        backgroundColor: "#eb3948",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: RFValue(30)
      },
      likeButtonDisLiked: {
        width: RFValue(160),
        height: RFValue(40),
        flexDirection: "row",
        borderColor: "#eb3948",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: RFValue(30),
        borderWidth: 2
      },
      likeText: {
        color: "white",
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(25),
        marginLeft: RFValue(5)
      },
      likeTextLight: {
        color: "black",
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(25),
        marginLeft: RFValue(5)
      },
    descriptionText:{
        color:"white",
        fontFamily:"Bubblegum-Sans",
        fontSize:RFValue(30),
        paddingTop: RFValue(10)
    },
    descriptionTextLight:{
        color:"black",
        fontFamily:"Bubblegum-Sans",
        fontSize:RFValue(30),
        paddingTop: RFValue(10)
    }
  });