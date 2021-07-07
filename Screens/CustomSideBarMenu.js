import * as React from 'react';
import { View, StyleSheet,Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import firebase from 'firebase';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

export default class CustomSideBarMenu extends React.Component{
    constructor(){
        super();
        this.state = {lightTheme: true}
    }

    fetchUser = async ()=>{
        let theme;
        await firebase.database().ref("/users/"+firebase.auth().currentUser.uid).on("value",(snapshot)=>{
            theme = snapshot.val().current_theme;
            this.setState({lightTheme: theme==="light"? true:false})
         })
    }

    componentDidMount(){
        this.fetchUser();
    }

    render(){
        let props = this.props
        return(
            <View style = {{flex: 1, justifyContent: "center"}}>
                <SafeAreaView style = {{flex: 1, backgroundColor: this.state.lightTheme?'white':'#15193c'}} />
                <Image source = {require('../assets/logo.png')} style = {styles.iconImage} />
                <DrawerContentScrollView {...props} >
                    <DrawerItemList {...props} />
                </DrawerContentScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    iconImage: {
        width: RFValue(140),
        height: RFValue(140),
        borderRadius: RFValue(70),
        alignSelf:"center",
        marginTop: RFValue(60),
        resizeMode:"contain"
    }
})