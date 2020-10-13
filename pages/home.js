import React, { Component } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import styles from '../styles/styles';

class home extends Component {
  constructor(props) {
      super(props);
      this.state = {
        currentView: "home",
        kanjiCategories: [{name: "JLPT Level 5", value: 5},
        {name: "JLPT Level 4", value: 4},
        {name: "JLPT Level 3", value: 3},
        {name: "JLPT Level 2", value: 2},
        {name: "JLPT Level 1", value: 1}],
        currentView: "home"
      };
    }
  
  componentWillMount = () =>{

  }

  componentDidMount= () =>{

  }

  kanji = (filter) =>{
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
      this.props.navigation.navigate('Kanji', {kanji: row})
    
    }}
     >
        {row.map((kanji, kanjiIndex)=>{
          return (
            <Text key={kanjiIndex}>{kanji.kanji}</Text>
          )
        })}
      </TouchableOpacity>
      )
    });
    return(
    <View>{categories}</View>
    )
  }
  render() {

    const home =         
    <View style={styles.container}>
      <Text style={styles.genericText}>Study:</Text>
      <Text style={styles.genericText}>Kanji:</Text>
      {this.state.kanjiCategories && 
      this.state.kanjiCategories.map((category, index)=>{
        return(
          <TouchableOpacity key={index} onPress={()=>this.props.navigation.navigate("KanjiList", {filter : category.value})}>
            <Text style={styles.genericText}>{category.name}</Text>
          </TouchableOpacity>
        )
      })
      }
      <TouchableOpacity
          onPress={() =>
            this.setState({
              currentView : "vocab"
            })
            // this.props.navigation.navigate('Vocabulary')
          }
      ><Text style={styles.genericText}>Vocabulary</Text>
      </TouchableOpacity>
      <TouchableOpacity
          onPress={() =>
            this.setState({
              currentView : "grammar"
            })
            // this.propsnavigation.navigate('Grammar')
          }
      ><Text style={styles.genericText}>Grammar</Text>
      </TouchableOpacity>
    </View>

    const vocab =
    <View>

    </View>

    const grammar =
    <View>

    </View>;

    return (
      <View>
        {this.state.currentView === "home" &&
          home
        }
        {this.state.currentView === "kanji" &&
          <View>
            {this.kanji(this.state.kanjiList)}

          </View>
        }
        {this.state.currentView === "vocab" &&
          vocab
        }
        {this.state.currentView === "grammar" &&
          grammar
        }
      </View>
    );
  }
}

export default home;
// {this.state.currentView === "home" && this.state.categories.map((category, index) =>{
//   return <TouchableOpacity
//    key={index}
//    onPress={()=> this.setState({currentView: "kanjiList", currentList: category.value})}>
//        <Text>{category.name}</Text>
//    </TouchableOpacity>
//  })}