import * as React from 'react'
import {createDrawerNavigator} from '@react-navigation/drawer'
import StackNavigator from './StackNavigator';
import Profile from './Profile'
import Logout from './Logout';
import firebase from 'firebase';
import CustomSideBarMenu from './CustomSideBarMenu';

const Drawer = createDrawerNavigator();

export default class DrawerNavigator extends React.Component{
    constructor(){
        super();
        this.state = {lightTheme: true};
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
        return(
            <Drawer.Navigator 
            drawerContentOptions = {{activeTintColor: '#e91e63', inactiveTintColor: this.state.lightTheme?'black':'white'}}
            drawerContent = {(props)=><CustomSideBarMenu{...props} />}
            >
                <Drawer.Screen name = "Home" component = {StackNavigator} options = {{unmountOnBlur: true}}></Drawer.Screen>
                <Drawer.Screen name = "Profile" component = {Profile} options = {{unmountOnBlur: true}}></Drawer.Screen>
                <Drawer.Screen name = "Logout" component = {Logout} options = {{unmountOnBlur: true}}></Drawer.Screen>
            </Drawer.Navigator>
        );
    }
}