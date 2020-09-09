import React from 'react';
import { Text, View, FlatList,StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import db from '../config'
import { ScrollView } from 'react-native-gesture-handlers'
import BookTransactionScreen from './BookTransactionScreen';


export default class Searchscreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      allTransactions: [],
      lastVisibleTransaction: null,
      search: ''
    }
  }
  fetchMoreTransactions = async ()=>{
    var text = this.state.search.toUpperCase()
    var enteredText = text.split("")


    if (enteredText[0].toUpperCase() === 'B') {
      const query = await db.collection("transactions").where('bookId','==',text).startAfter(this.state.lastVisibleTransaction).limit(10)
      query.docs.map((doc)=>{
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc
        })
      })
    }
    else if (enteredText[0].toUpperCase() === 'S') {
      const query = await db.collection("transactions").where('bookId','==',text).startAfter(this.state.lastVisibleTransaction).limit(10)
      query.docs.map((doc)=>{
        this.setState({
          allTransactions: [...this.statee.allTransactions, doc.data()],
          lastVisibleTransaction: doc
        })
      })
    }
  }

  searchTransactions = async(text) =>{
    var enteredText = text.split("")
    if (enteredText[0].toUpperCase() === 'B') {
      const transaction = await db.collection("transactions").where('bookId','==',text).get()
      transaction.docs.map((doc)=>{
        this.setState({
          allTransactions: [...this.state,allTransactions,doc.data()],
          lastVisibleTransaction: doc
        })
      })
    }
    else if (enteredText[0].toUpperCase() === 'S') {
      const transaction = await db.collection('transactions').where('studentId','==',text).get()
      BookTransactionScreen.docs.map((doc)=>{
        this.setState({
          allTransactions: [...this.state.allTransactions,doc.data()],
          lasVisibleTransaction: doc
        })
      })
    }
  }

  componentDidMount = async ()=>{
    const query = await db.collection("transactions").limit(10).get()
    query.docs.map((doc)=>{
      this.setState({
        allTransactions: [],
        lastVisibleTransaction: doc
      })
    })
  }

    render() {
      return (
        <View>
          <View>
            <TextInput
            style = {StyleSheet.bar}
            placeholder = "Enter Book Id or Student Id"
            onChangeText = {(text)=>{this.setState({search:text})}}/>
            <TouchableOpacity
            style={StyleSheet.searchButton}
            onPress={()=>{this.searchTransactions(this.state.search)}}
            >
              <Text>Search</Text>
            </TouchableOpacity>
          </View>
          <FlatList
          data={this.state.allTransactions}
          renderItem={({item})=>(
            <View style={{borderBottomWidth: 2}}>
              <Text>{"Book Id: " + item.bookId}</Text>
              <Text>{"Student Id: " + item.studentId}</Text>
              <Text>{"Transaction Type: " + item.transactionType}</Text>
              <Text>{"Date: " + item.date.toDate()}</Text>
            </View>         
            )}
            keyExtractor = {(item, index)=> index.toString()}
            onEndReached = {this.fetchMoreTransactions}
            onReachedThreshold = {0.7}
          />
        </View>
      );
    }
  }