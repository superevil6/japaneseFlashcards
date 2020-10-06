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
            meaningAnswer: [],
            currentQuestionAnswers: [],
            showAnswer: false,
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
        this.state.studyData.forEach((kanji)=>{
            kanji.onyomi.forEach((yomi)=>{
                if(!onyomiAnswers.includes(yomi)){
                    onyomiAnswers.push(yomi);
                }
            })
        })
        this.setState({
            onyomiAnswers: onyomiAnswers
        })
    }
    render() {    

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

        const showExamples = () =>{
            this.setState({showExamples : !this.state.showExamples});
        }

        const nextCard = () =>{
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

        const generateOptions = (options, answers) =>{
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
                    console.log("Going")
                    let randomIndex = Math.round(Math.random() * options.length);
                    if(!randomizedQuestions.includes(options[randomIndex])){
                        console.log(options[randomIndex]);
                        randomizedQuestions.push({ 
                            option :options[randomIndex],
                            correct: false,
                            clicked: false
                        });
                        i++
                    } else {
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

        const showAnswers = () =>{
            if(this.state.currentQuestionAnswers.length === 0){
                generateOptions(this.state.onyomiAnswers, this.state.studyData[this.state.currentCard].onyomi);
            }
            return this.state.currentQuestionAnswers.map((answer, index)=>{
                if(answer){
                    return (
                        <TouchableOpacity key={index} 
                        style={answer.clicked ? 
                        answer.correct ? styles.optionCorrect : styles.optionIncorrect 
                        : styles.option}
                        onPress={() => chooseAnswer(answer, this.state.studyData[this.state.currentCard].onyomi)}>
                            <Text>
                                {answer.option}
                            </Text>
                        </TouchableOpacity>
                    )
                }
            })
        }

        const chooseAnswer = (answer, listOfAnswers) =>{
            answer.clicked = true;
            this.setState({currentQuestionAnswers : this.state.currentQuestionAnswers})

            if(listOfAnswers.includes(answer.option)){
                // this.setState({
                //     correctAnswers : this.state.correctAnswers ++
                // })
            } else {
                answer.clicked = true;
                return false;
            }
        }
        //styles


        //render
        return (
            <View style={styles.container}>
            {this.state.studyData.length > 0 && 
                <View 
                style={styles.card}
                >
                    {!this.state.showAnswer &&
                        <View>
                            <Text>{this.state.studyData[this.state.currentCard].kanji}</Text>
                            {/* {generateOptions(this.state.onyomiAnswers, this.state.studyData[this.state.currentCard].onyomi)} */}
                            {showAnswers()}
                        </View>
                    }
                    {this.state.showAnswer &&
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
                            showExamples
                            } />
                            {this.state.showExamples &&
                                <View>
                                    {examples()}
                                </View>
                            }
                        </View>
                    }
                </View>
            }
            <Button
            title='next'
            onPress={nextCard} 
            />
        </View>
        );
    }
}

export default kanji;
