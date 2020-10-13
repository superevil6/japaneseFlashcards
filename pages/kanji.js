import React, { Component } from 'react';
import { Button, View, SafeAreaView, Text, Alert, TouchableOpacity, TouchableHighlight } from 'react-native';
import styles from '../styles/styles';
import AsyncStorage from '@react-native-community/async-storage';

//Kanji Query:
//SELECT `id`, `Kanji`, `Strokes`, `JLPT-test`, `Reading within Joyo`, `Translation of Kun`, `Translation of on` FROM KanjiTable ORDER BY `Kanji Frequency without Proper Nouns` DESC


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
            totalCorrectAnswers: 0,
            currentCard: 0,
            showExamples: false,
            quizFinished: false,
            failed: false

        };
      }
    componentWillMount = () =>{
        //This will be passed in as a prop later.
        console.log(this.props.route.params.kanji)
        this.setState({studyData : this.props.route.params.kanji})

    }
    componentDidMount = () => {
        let onyomiAnswers = [];
        let kunyomiAnswers = [];
        let meaningAnswers = [];
        this.state.studyData.forEach((kanji)=>{
            if(kanji.onyomi && kanji.onyomi.length > 0){
                kanji.onyomi.forEach((yomi)=>{
                    if(!onyomiAnswers.includes(yomi)){
                        onyomiAnswers.push(yomi);
                    }
                })
            }
            if(kanji.kunyomi && kanji.kunyomi.length > 0){
                kanji.kunyomi.forEach((yomi)=>{
                    if(!kunyomiAnswers.includes(yomi)){
                        kunyomiAnswers.push(yomi);
                    }
                })
            }
            if(kanji.englishWords && kanji.englishWords.length > 0){
                kanji.englishWords.forEach((word)=>{
                    if(!meaningAnswers.includes(word)){
                        meaningAnswers.push(word);
                    }
                })
            }
        })
        this.setState({
            onyomiAnswers: onyomiAnswers,
            kunyomiAnswers: kunyomiAnswers,
            meaningAnswers: meaningAnswers,
        });
        if(this.state.studyData.length > 0){
            this.nextPhase();
        }
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

    saveKanjiProgress = async (kanji) =>{
        console.log("saving kanji");
        let kanjiString = "@kanji_"+kanji.id;
        let progress;
        if(this.state.failed === false && kanji.progress && kanji.progress <= 4){
            console.log("already progress, adding more")
            progress = kanji.progress;
            progress++;
        } else if (this.state.failed === false && !kanji.progress){
            console.log("no progress")
            progress = 1;
        }
        else if (this.state.failed){
            console.log("failed")
            progress = 0;
        }
        try {
            console.log(kanjiString + progress);
            let progressString = JSON.stringify({"progress": progress});
            console.log(progressString);
            await AsyncStorage.setItem(kanjiString, progressString)
          } catch(e) {
              throw(e);
            // save error
          }
    }

    nextPhase = () =>{
        let nextPhase;
        let nextCard = this.state.currentCard;
        if(this.state.studyData[this.state.currentCard]){
            switch(this.state.phase){
                case undefined:
                    nextPhase = "meaning";
                break;
                case "meaning":
                    console.log("this is true");
                    if(this.state.studyData[this.state.currentCard].kunyomi && this.state.studyData[this.state.currentCard].kunyomi.length > 0){
                        nextPhase = "kunyomi";
                    } else {
                        nextPhase = "onyomi";
                    }
                break;
                case "kunyomi":
                    if(this.state.studyData[this.state.currentCard].onyomi && this.state.studyData[this.state.currentCard].onyomi.length > 0){
                        nextPhase = "onyomi";
                    } else {
                        nextPhase = "stroke";
                    }            
                break;
                case "onyomi":
                    if(this.state.studyData[this.state.currentCard].stroke && this.state.studyData[this.state.currentCard].stroke.length > 0){
                        nextPhase = "stroke";
                    } else {
                        nextPhase = "meaning";
                        nextCard += 1;
                        //save progress
                        this.saveKanjiProgress(this.state.studyData[this.state.currentCard]);
                    }              
                break;
                case "stroke":
                    nextPhase = "meaning";
                    nextCard += 1;
                    this.saveKanjiProgress(this.state.studyData[this.state.currentCard]);
                    //save progress
                break;
            }
            this.setState({
                currentQuestionAnswers: [],
                phase: nextPhase,
                correctAnswers: 0,
                totalCorrectAnswers: 0,
                currentCard: nextCard,
                clickDisabled: false,
                failed: false
            })
        } else {
            this.setState({
                quizFinished : true
            })
        }
    }

    generateOptions = (options, answers) =>{
        if(options.length > 0){
            let randomizedQuestions = [];
            //Add the correct answers
            answers.forEach((answer)=>{
                randomizedQuestions.push({
                    option: answer,
                    correct: true,
                    clicked: false
                });
            })
            //Fill up the remaining answers
            for(let i = 0; i < options.length - answers.length;){
                let randomIndex = Math.round(Math.random() * (options.length - 1));
                let optionAlreadyExists = false; 
                randomizedQuestions.forEach((question)=>{
                    if(question.option === options[randomIndex]){
                        optionAlreadyExists = true;
                    }
                });
                if(!optionAlreadyExists){
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
                currentQuestionAnswers : randomizedQuestions,
                totalCorrectAnswers: answers.length
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
                    <TouchableOpacity 
                    key={index} 
                    disabled={this.state.clickDisabled}
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

    showAllAnswers = () =>{
        let allAnswers = [];
        this.state.currentQuestionAnswers.forEach((answer)=>{
            allAnswers.push(answer);
        });
        allAnswers.forEach((answer)=>{
            answer.clicked = true;
        });
        this.setState({
            currentQuestionAnswers : allAnswers
        })
    }

    chooseAnswer = (answer, listOfAnswers) =>{
        answer.clicked = true;
        this.setState({currentQuestionAnswers : this.state.currentQuestionAnswers})

        if(listOfAnswers.includes(answer.option)){
            this.setState({
                correctAnswers: this.state.correctAnswers += 1
            })
            if(this.state.totalCorrectAnswers === this.state.correctAnswers){
                this.setState({clickDisabled : true});
                setTimeout(this.nextPhase, 2500)
            }
        } else {
            this.setState({
                clickDisabled : true,
                failed: true
            });
            this.showAllAnswers();
            setTimeout(this.nextPhase, 2500);
        }
    }

    render() {
        let currentView;
        console.log(this.state.phase)
        if(this.state.phase && this.state.currentCard >= 0){
            switch(this.state.phase){
                case "meaning":
                    currentView = <View style={styles.optionContainer}>{this.showAnswers(this.state.meaningAnswers, this.state.studyData[this.state.currentCard].englishWords)}</View>
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
            {this.state.studyData.length > 0 && !this.state.quizFinished &&
                <View 
                style={styles.card}
                >
                        <Text>{this.state.studyData[this.state.currentCard].kanji}</Text>
                        {currentView}
                </View>
            }
            {this.state.quizFinished &&
            <Text>Quiz Finished</Text>
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
