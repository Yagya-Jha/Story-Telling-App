import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { Text, View } from 'react-native';
import DrawerNavigator from './DrawerNavigator';

export default class Dashboard extends React.Component{
    render(){
        return(
            <NavigationContainer>
                <DrawerNavigator />
            </NavigationContainer>
        )
    }
}