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
    optionContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap"
    },
    option: {
        flex: 1,
        width: "50%",
        flexGrow: "1",
        justifyContent: "center",
        alignItems: "center",
        padding: '10px',
        margin: '10px',
        borderWidth: '1px',
        borderColor: "#000"
    },
    optionUnclicked: {
        backgroundColor: "white",
    },
    optionCorrect: {
        backgroundColor: "green"
    },
    optionIncorrect: {
        backgroundColor: "red"
    }
});