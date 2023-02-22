import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../../Constants/styles'

const LoadingOverLay = ({ containerStyle }) => {
    return (
        <View style={[containerStyle]}>
            <ActivityIndicator size="large" color="black"></ActivityIndicator>
        </View>
    )
}

export default LoadingOverLay

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary700
    }
})