import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        flex: 1,
        width: '90%',
        padding: '100px',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEE',
        borderWidth: '1px',
        borderColor: "#000"
    },
    button: {
        zIndex: "100"
    },
    flipButton: {
        width: '100%'
    },
    option: {
        backgroundColor: "white",
        borderWidth: '1px',
        borderColor: "#000"
    },
    optionCorrect: {
        backgroundColor: "green",
        borderWidth: '1px',
        borderColor: "#000"
    },
    optionIncorrect: {
        backgroundColor: "red",
        borderWidth: '1px',
        borderColor: "#000"
    }
});