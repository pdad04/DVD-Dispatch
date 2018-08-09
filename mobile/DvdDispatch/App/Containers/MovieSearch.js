import React, { Component } from 'react'
import { View, AsyncStorage, FlatList, TouchableOpacity, TouchableHighlight, Alert } from 'react-native'
import { Container, Content, Header, Text, Item, Icon, Input, Button, List, ListItem, Left, Right } from 'native-base'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MovieSearchStyle'

class MovieSearch extends Component {
  constructor (props) {
    super(props)
    this.state = { searchText: '', movies: [], searchedPerformed: false }
  }

  static navigationOptions = ({ navigation }) => {
    return {
       header: 'none'
    }
 }

  componentDidMount(){
    AsyncStorage.getItem('inputKey').then((value) => {
      if(value !== null){
        this.setState({ searchText: value });
      }
    }).done();
  }

  performSearch() {
    return fetch(`http://localhost:3000/api/movies/${this.state.searchText}`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({movies: responseJson, searchedPerformed: true})
      })
      .catch((error) => {
        console.error(error)
      });
  }

  addToWatchList(entry){
    // this.setState(prevState => ({ watchList: [...prevState.watchList, entry]}))
    window.watchList.push(entry);
  }

  render () {
    if(this.state.searchedPerformed){
      return (
        <Container>
          <Header searchBar rounded>
            <Item>
              <Icon name='ios-search' />
              <Input
                clearButtonMode={'while-editing'}
                placeholder='Search Movie'
                returnKeyType={'search'}
                onSubmitEditing={() => {
                  if(this.state.searchText){
                    this.performSearch()
                  }
                }}
                onChangeText = { (text) => {
                  this.setState({ searchText: text });
                  AsyncStorage.setItem('inputKey', text);
                }}
                value={this.state.searchText}
              />
            </Item>
          </Header>
          <Content>
          <FlatList
            data={this.state.movies}
            keyExtractor={(item, index) => index.toString() }
            renderItem={({item}) =>(
                <ListItem noIndent
                  onPress={() =>
                    // Alert.alert(`Add "${item.name}" to Watch List?`, `${item.description}`, [{text: 'Add', onPress:() => this.addToWatchList(item), style:'default'}, {text: 'Cancel', style:'cancel'}])}
                    this.props.navigation.navigate('Details', {movie: item})}
                >
                  <Left>
                    <Text>{item.name}</Text>
                  </Left>
                  <Right>
                    <Icon name='arrow-forward' />
                  </Right>
                </ListItem>
            )}
          />
          </Content>
        </Container>
      )
    }else{
      return (
        <Container>
          <Header searchBar rounded>
            <Item>
              <Icon name='ios-search' />
              <Input
                clearButtonMode={'while-editing'}
                placeholder='Search Movie'
                returnKeyType={'search'}
                onSubmitEditing={() => {
                  if(this.state.searchText){
                    this.performSearch()
                  }
                }}
                onChangeText = { (text) => {
                  this.setState({ searchText: text });
                  AsyncStorage.setItem('inputKey', text);
                }}
                value={this.state.searchText}
              />
            </Item>
          </Header>
        </Container>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieSearch)
