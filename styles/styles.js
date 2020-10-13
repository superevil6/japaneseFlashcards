import { StyleSheet } from 'react-native';

const lightTheme = {
    backgroundColor: "white",
    itemBackground: "#EEE",
    buttonColor: "red",
    textColor: "black",
    onDarkText: "white"
}

const darkTheme = {
    backgroundColor: "#222",
    itemBackground: "#444",
    buttonColor: "#880000",
    textColor: "white",
    onDarkText: "white"

}

const theme = lightTheme;

export default StyleSheet.create({
    mainButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.buttonColor,
        padding: "10px",
        marginLeft: "10px",
        marginRight: "10px"
    },
    mainButtonText: {
        color: theme.onDarkText
    },
    kanjiList:{
        flex: 1,
        flexDirection: "row",
        width: "100%",
        padding: "5px",
        margin: "5px",
        backgroundColor: theme.itemBackground
    },
    kanjiListItem: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        color: theme.textColor,
        fontSize: "1em",
        margin: "10px"
    },
    detailedKanjiList: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    detailedKanjiListKanji: {
        fontSize: "1.5em",
        color: theme.textColor,
        padding: "10px"
    },
    detailedKanjiListItem: {
        margin: "5px",
        color: theme.textColor
    },
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    genericText:{
        color: theme.textColor
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
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        width: "100%"
    },
    option: {
        width: "35%",
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