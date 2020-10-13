import React, { Component } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import styles from '../styles/styles';
import allKanji from '../data/allkanji.json';

class home extends Component {
  constructor(props) {
      super(props);
      this.state = {
        kanji: allKanji,
        kanjiSet: [],
        currentList: this.props.route.params.filter,
        currentView: "kanjiList"
      };
    }

  loadKanjiProgress = async (kanjiList) => {
    let values;
    let kanjiIds = kanjiList.map(kanji => '@kanji_'+kanji.id);
    try {
      values = await AsyncStorage.multiGet(kanjiIds);
      let updatedList = kanjiList.map((kanji, i) => Object.assign(kanji, JSON.parse(values[i][1])));
      console.log(updatedList);
      this.setState({kanjiSet: updatedList})
    } catch(e) {
      // read error
    }
  }

  testSaveKanji = async (kanjiId, data) => {
    let kanjiString = '@kanji_'+kanjiId;
    let parsedData = JSON.stringify(data);
    try {
      await AsyncStorage.setItem(kanjiString, parsedData)
    } catch (e) {
      // saving error
    }
  }


  kanjiList = (filter) =>{
    let filteredKanji = [];
    filteredKanji = this.state.kanji.filter(kanji => 
      kanji.jlptLevel ===  filter);
    let rows = [];
    for(let i = 0; i <= filteredKanji.length; i+=10){
      let row = [];
      row.push(filteredKanji.slice(i, i+10));
      rows.push(row[0]);
    }
    let categories = rows.map((row, index)=>{
     return (
     <TouchableOpacity style={styles.kanjiList} key={index}
     onClick={() => {
       this.loadKanjiProgress(row);
       this.setState({currentView: "detailedList", kanjiSet : row})
    }}
     >
        {row.map((kanji, kanjiIndex)=>{
          return (
            <Text style={styles.kanjiListItem} key={kanjiIndex}>{kanji.kanji}</Text>
          )
        })}
      </TouchableOpacity>
      )
    });
    return(
    <View>{categories}</View>
    )
  }

  detailedList = (kanjiList) =>{
    return <View>
      {kanjiList.map((kanji, index)=>{
      return(
        <TouchableOpacity 
        style={styles.detailedKanjiList}
        key={index}>
            <Text style={styles.detailedKanjiListKanji}>{kanji.kanji}</Text>
            {kanji.progress && <Text>Progress: {kanji.progress}</Text> }
            {kanji.englishWords && <Text style={styles.detailedKanjiListItem}>{kanji.englishWords}{"\n"}</Text>}
            {kanji.kunyomi.length > 0 && 
            <Text>Kunyomi: </Text> &&
            kanji.kunyomi.map((yomi, index)=>{
              return <Text style={styles.detailedKanjiListItem} key={index}>{yomi}</Text>
              })}
            {kanji.onyomi.length > 0 && 
            kanji.onyomi.map((yomi, index)=>{
              return <Text style={styles.detailedKanjiListItem} key={index}>{yomi}</Text>
              })}
        </TouchableOpacity>
      )}
      )}
      <TouchableOpacity
      style={styles.mainButton}
      onPress={()=> this.props.navigation.navigate('Kanji', {kanji: this.state.kanjiSet})}>
        <Text style={styles.mainButtonText}>Test these kanji</Text>
      </TouchableOpacity>
    </View>
  }

  render() {
    return (
      <View style={styles.container}>
          {this.state.currentView === "kanjiList" &&
          this.kanjiList(this.state.currentList)}
          {this.state.currentView === "detailedList" &&
          this.detailedList(this.state.kanjiSet)}
      </View>
    );
  }
}

export default home;