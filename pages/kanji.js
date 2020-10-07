import React, { Component } from 'react';
import { Button, View, SafeAreaView, Text, Alert, TouchableOpacity, TouchableHighlight } from 'react-native';
import styles from '../styles/styles';

class kanji extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studyData: [],
            onyomiAnswers: [],
            kunyomiAnswers: [],
            meaningAnswers: [],
            currentQuestionAnswers: [],
            showAnswer: false,
            correctAnswers: 0,
            currentCard: 0,
            showExamples: false
        };
      }
    componentWillMount = () =>{
        //This will be passed in as a prop later.
        const kanjiData = require('../data/kanji.json');
        this.setState({studyData : kanjiData.kanji})

    }
    componentDidMount = () => {
        let onyomiAnswers = [];
        let kunyomiAnswers = [];
        let meaningAnswers = [];
        this.state.studyData.forEach((kanji)=>{
            kanji.onyomi.forEach((yomi)=>{
                if(!onyomiAnswers.includes(yomi)){
                    onyomiAnswers.push(yomi);
                }
            })
            kanji.kunyomi.forEach((yomi)=>{
                if(!kunyomiAnswers.includes(yomi)){
                    kunyomiAnswers.push(yomi);
                }
            })
            kanji.englishWord.forEach((word)=>{
                if(!meaningAnswers.includes(word)){
                    meaningAnswers.push(word);
                }
            })
        })
        this.setState({
            onyomiAnswers: onyomiAnswers,
            kunyomiAnswers: kunyomiAnswers,
            meaningAnswers: meaningAnswers,
            phase: "meaning"
        });
        console.log(this.state.phase);
    }
    
    nextCard = () =>{
        if(this.state.currentCard < this.state.studyData.length - 1){
            this.setState({
                showAnswer : false,
                currentCard : this.state.currentCard += 1
            })
        } else {
            this.setState({
                showAnswer : false,
                currentCard : 0
            })
        }
    }

    nextPhase = () =>{
        let nextPhase;
        let nextCard = this.state.currentCard;
        switch(this.state.phase){
            case "meaning":
                nextPhase = "kunyomi";
            break;
            case "kunyomi":
                nextPhase = "onyomi"
            break;
            case "onyomi":
                nextPhase = "stroke";
            break;
            case "stroke":
                nextPhase = "meaning";
                nextCard = this.state.currentCard += 1;
            break;
        }
        console.log("Crashes before");

        this.setState({
            currentQuestionAnswers: [],
            phase: nextPhase,
            correctAnswers: 0,
            currentCard: nextCard
        })
    }

    generateOptions = (options, answers) =>{
        if(options.length > 0){
            console.log(options);
            let randomizedQuestions = [];
            //Add the correct answers
            answers.forEach((answer)=>{
                randomizedQuestions.push({
                    option: answer,
                    correct: true,
                    clicked: false
                });
            })
            for(let i = 0; i < options.length - answers.length;){
                let randomIndex = Math.round(Math.random() * (options.length - 1));
                console.log(randomIndex);
                let optionAlreadyExists = false; 
                randomizedQuestions.forEach((question)=>{
                    if(question.option === options[randomIndex]){
                        optionAlreadyExists = true;
                    }
                });
                if(!optionAlreadyExists){
                    console.log(options[randomIndex]);
                    randomizedQuestions.push({ 
                        option :options[randomIndex],
                        correct: false,
                        clicked: false
                    });
                    i++
                }
                else {
                    continue;
                }
            }
            //Shuffle the values so the answers aren't at the top.
            for(let i = randomizedQuestions.length - 1; i > 0; i--){
                let j = Math.floor(Math.random() * (i + 1));
                let temp = randomizedQuestions[i];
                randomizedQuestions[i] = randomizedQuestions[j];
                randomizedQuestions[j] = temp;
            }
            this.setState({
                currentQuestionAnswers : randomizedQuestions
            });
        }
    }

    showAnswers = (listAnswers, kanjiAnswers) =>{
        if(this.state.currentQuestionAnswers.length === 0){
            this.generateOptions(listAnswers, kanjiAnswers);
        }
        return this.state.currentQuestionAnswers.map((answer, index)=>{
            if(answer){
                return (
                    <TouchableOpacity key={index} 
                    style={[styles.option, answer.clicked ? 
                    answer.correct ? styles.optionCorrect : styles.optionIncorrect 
                    : styles.optionUnclicked]}
                    onPress={() => this.chooseAnswer(answer, kanjiAnswers)}>
                        <Text>
                            {answer.option}
                        </Text>
                    </TouchableOpacity>
                )
            }
        })
    }

    chooseAnswer = (answer, listOfAnswers) =>{
        answer.clicked = true;
        this.setState({currentQuestionAnswers : this.state.currentQuestionAnswers})

        if(listOfAnswers.includes(answer.option)){
            this.nextPhase();
        } else {
            console.log(this.state)

            return false;
        }
    }
    render() {
        let currentView = <View><Text>Loading</Text></View>;
        console.log(this.state.phase);
        if(this.state.phase && this.state.currentCard){
            switch(this.state.phase){
                case "meaning":
                    currentView = <View style={styles.optionContainer}>{this.showAnswers(this.state.meaningAnswers, this.state.studyData[this.state.currentCard].englishWord)}</View>
                break;
                case "kunyomi":
                    currentView = <View style={styles.optionContainer}>{this.showAnswers(this.state.kunyomiAnswers, this.state.studyData[this.state.currentCard].kunyomi)}</View>

                break;
                case "onyomi":
                    currentView = <View style={styles.optionContainer}>{this.showAnswers(this.state.onyomiAnswers, this.state.studyData[this.state.currentCard].onyomi)}</View>
                break;
                case "stroke":
                    currentView = <View style={styles.optionContainer}>{this.showAnswers(this.state.onyomiAnswers, this.state.studyData[this.state.currentCard].onyomi)}</View>
                break;
            }
        }

        //View methods
        const onyomi = () =>{
            return this.state.studyData[this.state.currentCard].onyomi.map((yomi, index)=>{
                return(
                    <Text key={index}>{yomi}
                    {index < this.state.studyData[this.state.currentCard].onyomi.length -1 ? ', ' : ''}
                    </Text>
                )
            })
        }

        const kunyomi = () =>{
            return this.state.studyData[this.state.currentCard].kunyomi.map((yomi, index)=>{
                return(
                    <Text key={index}>{yomi}
                    {index < this.state.studyData[this.state.currentCard].kunyomi.length -1 ? ', ' : ''}
                    </Text>            
                )
            })
        }

        const examples = () =>{
            return this.state.studyData[this.state.currentCard].compoundWordExamples.map((example, index)=>{
                return <View key={index}>
                    <Text>{example.word}</Text>
                    <Text>{example.meaning}</Text>
                    <Text>{example.pronunciation}</Text>
                </View>
            })
        }        

        //render
        return (
            <View style={styles.container}>
            {this.state.studyData.length > 0 && 
                <View 
                style={styles.card}
                >
                    <View>
                        <Text>{this.state.studyData[this.state.currentCard].kanji}</Text>
                        {currentView}
                    </View>
                    {/* {this.state.showAnswer &&
                        <View>
                            <Text>{this.state.studyData[this.state.currentCard].englishWord}</Text>
                            <Text>{this.state.studyData[this.state.currentCard].kanji}</Text>
                            {this.state.studyData[this.state.currentCard].kunyomi &&
                                <Text>Kunyomi: {kunyomi()}</Text>
                            }
                            {this.state.studyData[this.state.currentCard].onyomi &&
                                <Text>Onyomi: {onyomi()}</Text>
                            }
                            <Button
                            title='Show Examples' 
                            onPress={
                            this.showExamples
                            } />
                            {this.state.showExamples &&
                                <View>
                                    {examples()}
                                </View>
                            }
                        </View>
                    } */}
                </View>
            }
            <Button
            title='next'
            onPress={this.nextCard} 
            />
        </View>
        );
    }
}

export default kanji;
