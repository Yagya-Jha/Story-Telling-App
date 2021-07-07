import * as React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import firebase from 'firebase';

export default class Loading extends React.Component{

    checkLogin = () =>{
        firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                this.props.navigation.navigate("Dashboard");
                console.log("checked");
            }else{
                this.props.navigation.navigate("LoginScreen");
                console.log("checked again");
            }
        });
        
    }

    componentDidMount(){
        this.checkLogin();
    }

    render(){
        return(
            <View style = {{flex: 1, justifyContent:"center", alignItems:"center", backgroundColor: 'orange'}}>
                <ActivityIndicator size = "large"/>
            </View>
        )
    }
}