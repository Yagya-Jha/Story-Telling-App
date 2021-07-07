import AppLoading from 'expo-app-loading';
import * as React from 'react';
import { Text, View, StyleSheet, Platform, StatusBar,Image,TextInput, ScrollView, Dimensions,TouchableOpacity, Alert,Button } from 'react-native';
import * as Font from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import DropDownPicker from 'react-native-dropdown-picker';
import firebase from 'firebase';

let custom_font = {'Bubbegum-Sans':require('../assets/fonts/BubblegumSans-Regular.ttf')};

export default class CreateStory extends React.Component{
    constructor(){
        super();
        this.state = {
            fontsLoaded: false,
            previewImage: 'image_1',
            dropdownheight: 40,
            lightTheme: true,
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

    componentDidMount(){
        this.loadFonts();
        this.fetchUser();
    }

    async submitstory(){
        if(this.state.title.trim() && this.state.description.trim() && this.state.story.trim() && this.state.moral.trim()){
            let storydata = {
                previewImage: this.state.previewImage,
                title: this.state.title,
                description: this.state.description,
                story: this.state.story,
                moral: this.state.moral,
                author: firebase.auth().currentUser.displayName,
                created_on: new Date(),
                author_uid: firebase.auth().currentUser.uid,
                likes: 0,
            }
            await firebase.database().ref("/Posts/" + Math.random().toString(36).slice(2)).set(storydata)
            .then(function (snapshot){});
            this.props.setUpdateToTrue()
            this.props.navigation.navigate("Feed");
        }else{
            Alert.alert("Error", "All feilds are required", [{text: 'Ok',onPress: ()=>console.log("ok pressed")}], {cancelable: false})
        }
    }

    render(){
    if(! this.state.fontsLoaded){
        return <AppLoading />
    }else{
        let previewImages = {
            image_1: require("../assets/story_image_1.png"),
            image_2: require("../assets/story_image_2.png"),
            image_3: require("../assets/story_image_3.png"),
            image_4: require("../assets/story_image_4.png"),
            image_5: require("../assets/story_image_5.png")
        }
        return(
            <View style = {this.state.lightTheme?styles.containerLight:styles.container}>
            <SafeAreaView style = {styles.safeview}/>
                <View style = {styles.appTitle}>
                        <View style = {styles.appIcon}>
                            <Image source = {require('../assets/logo.png')} style = {styles.iconImage}/>
                        </View>
                        <View style = {styles.appTitleTextContainer}>
                            <Text style = {this.state.lightTheme?styles.appTitleTextLight:styles.appTitleText}>
                                New Story
                            </Text>
                        </View>
                </View>
                <View style = {styles.fieldContainer}>
                    <ScrollView>
                                <Image source = {previewImages[this.state.previewImage]} 
                                style = {{resizeMode:"contain",
                                          width: Dimensions.get('window').width-40,
                                          height: 250,
                                          borderRadius:10,
                                          marginBottom:10}}/>
                            <View style = {{height: RFValue(this.state.dropdownheight)}}>
                                <DropDownPicker items = {[
                                    {label: 'image 1', value: 'image_1'},
                                    {label: 'image 2', value: 'image_2'},
                                    {label: 'image 3', value: 'image_3'},
                                    {label: 'image 4', value: 'image_4'},
                                    {label: 'image 5', value: 'image_5'}
                                ]}
                                defaultValue = {this.state.previewImage}
                                containerStyle = {{height: 40, borderRadius: 20,marginHorizontal: RFValue(10), marginBottom: 10}}
                                style = {{backgroundColor: 'transparent'}}
                                onOpen = {()=>{this.setState({dropdownheight: 170})}}
                                onClose = {()=>{this.setState({dropdownheight: 40})}}
                                itemStyle = {{justifyContent:"flex-start"}}
                                dropDownStyle = {{backgroundColor: this.state.lightTheme?"#eee":'#2f345d'}}
                                labelStyle = {this.state.lightTheme?styles.dropDownlabelLight: styles.dropDownLabel}
                                arrowStyle = {this.state.lightTheme?styles.dropDownlabelLight: styles.dropDownLabel}
                                onChangeItem = {items=>this.setState({previewImage: items.value})}
                                />
                            <TextInput onChangeText = {title=>{this.setState({title})}}
                                    placeholder = {'Title'}
                                    placeholderTextColor = {this.state.lightTheme?'black':'white'}
                            style = {this.state.lightTheme?styles.inputFontLight:styles.inputFont}></TextInput>

                            <TextInput onChangeText = {description=>{this.setState({description})}}
                                    placeholder = {'Description'}
                                    placeholderTextColor = {this.state.lightTheme?'black':'white'}
                                    multiline = {true}
                                    numberOfLines = {4}
                                    style={[this.state.lightTheme?styles.inputFontLight:styles.inputFont,styles.inputFontExtra,styles.inputTextBig]}
                            ></TextInput>

                            <TextInput onChangeText = {story=>{this.setState({story})}}
                                    placeholder = {'Story'}
                                    placeholderTextColor = {this.state.lightTheme?'black':'white'}
                                    multiline = {true}
                                    numberOfLines = {20}
                                    style={[this.state.lightTheme?styles.inputFontLight:styles.inputFont, styles.inputFontExtra,styles.inputTextBig]}
                            ></TextInput>

                            <TextInput onChangeText = {moral=>{this.setState({moral})}}
                                    placeholder = {'Moral of the Story'}
                                    placeholderTextColor = {this.state.lightTheme?'black':'white'}
                                    multiline = {true}
                                    numberOfLines = {4}
                                    style={[this.state.lightTheme?styles.inputFontLight:styles.inputFont,styles.inputFontExtra,styles.inputTextBig]}
                            ></TextInput>
                        </View>
                        <View style = {styles.submitContainer}>
                            <Button title = "SUBMIT" onPress = {()=>this.submitstory()} color = '#841584' />
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#15193c"
    },
    containerLight: {
        flex: 1,
        backgroundColor: "white"
    },
    safeview: {
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
    fieldContainer: {
      flex: 0.85
    },
        previewContainer:{
        width: "93%",
        height: RFValue(250),
        alignSelf: "center",
        borderRadius: RFValue(10),
        marginVertical: RFValue(10),
        resizeMode: "contain"
    },
    inputFont:{
        height: RFValue(40),
        borderColor: "white",
        borderWidth: RFValue(1),
        borderRadius: RFValue(10),
        paddingLeft: RFValue(10),
        color: "white",
        fontFamily: "Bubblegum-Sans"
    },
    inputFontLight:{
        height: RFValue(40),
        borderColor: "black",
        borderWidth: RFValue(1),
        borderRadius: RFValue(10),
        paddingLeft: RFValue(10),
        color: "black",
        fontFamily: "Bubblegum-Sans"
    },
    inputFontExtra: {
        marginTop: RFValue(15)
      },
      inputTextBig: {
        textAlignVertical: "top",
        padding: RFValue(5)
      },
      submitContainer:{
        justifyContent:"center",
        alignItems:"center",
        marginTop: 20,
      },
      submitbutton:{
        backgroundColor: '#841584',
        justifyContent:"center",
        alignItems:"center",
      },
      submittext:{
        textAlign:"center",
        fontSize:RFValue(20),
        fontFamily: 'Bubblegum-Sans',
        color: 'black'
      },
      dropDownlabelLight:{
          color: 'black',
          fontFamily: 'Bubblegum-Sans'
      },
      dropDownLabel:{
        color: 'white',
        fontFamily: 'Bubblegum-Sans'
    }
  });