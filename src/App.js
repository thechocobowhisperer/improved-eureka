import React, {Component} from 'react';
import MatchHistory from '../src/components/MatchHistory/MatchHistory'
import axios from 'axios'
import {Button, Input} from 'reactstrap'
 
class App extends Component{
    state ={isLoading: true, name:'', summoner:{profileIcon:200}, matches:[]}
    
    key = 'RGAPI-1b82bbdd-e2c9-4cb9-aeed-82e5bbb89969'
    champDataUrl = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json'
    // champImgUrl = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/' + <championName> + '.png'

    setName = (event)  => {
      console.log(event.target.value)
      const newName = event.target.value 
      this.setState({ name: newName })
    }
    
    getSummoner() {
      const leagueBaseUrl = 'https://na1.api.riotgames.com'
      const bySummonerName = '/lol/summoner/v4/summoners/by-name/'
      const summonerName = this.state.name
      const apiKey = '?api_key='
      axios.get(
        'https://cors-anywhere.herokuapp.com/' + leagueBaseUrl + bySummonerName + summonerName + apiKey + this.key
      )
      .then(response => {
        console.log(response.data)
        const sumData = response.data
        this.setState({summoner: sumData})
      })
      this.getMatches()
    }

    getMatches() {
      const leagueBaseUrl = 'https://na1.api.riotgames.com'
      const matchListUrl = '/lol/match/v4/matchlists/by-account/' + String(this.state.summoner.accountId)
      axios.get(
        'https://cors-anywhere.herokuapp.com/' + leagueBaseUrl + matchListUrl + '?api_key=' + this.key
      )
      .then(response => {
        console.log(response.data)
        let matchData = response.data.matches
        this.setState({matches: matchData})
      }) 
    }

    getSpecificMatch = (event) => {
      const leagueBaseUrl = 'https://na1.api.riotgames.com'
      const matchGrabber = '/lol/match/v4/matches/' + this.state.matches.map((match)=> {
        axios.get(
          'https://cors-anywhere.herokuapp.com/' + leagueBaseUrl + matchGrabber + '?api_key=' + this.key
        )
        .then(response => {
          console.log(response.data)
          let matchData = response.data.matches
          this.setState({matches: matchData})
        }) 
      })
    }

    render() {
      const iconBaseUrl = 'http://avatar.leagueoflegends.com/'
      const playerRegion = 'na/'
      const iconPng = '.png'
      const fullIconUrl = iconBaseUrl+playerRegion+this.state.summoner.name+iconPng
      return(
        <div className='container'>
          <div className='row'>
            <Input className='col-md-9' onChange={(name) => this.setName(name)}/>
            <Button className='col-md-3' onClick={() => this.getSummoner()}>Summoner Info</Button>
          </div>
          <div className='row'>
              <div className='col'>
                <div className='row'><img src = {fullIconUrl} height='150px'></img></div>
                <p>{this.state.summoner.name}</p>
                <p>{this.state.summoner.summonerLevel}</p>
              </div>
              <div className='col'>
                <MatchHistory>
                  <Button onClick={() => this.getMatches()}>Show Match History</Button>
                  {this.state.matches.map((match, key) => {
                    return( <div className='container'>
                              <div className='row'>
                                <p className='col'>Champion: {match.champion}</p>
                                <p className='col'>Lane: {match.lane}</p>
                                <p className='col'>Role: {match.role}</p>
                                <p className='col'>Game ID: {match.gameId}</p>
                              </div>
                              
                            </div>)
                          
                  })}
                </MatchHistory>
              </div>
          </div>
        </div>
      )
    };
}
export default App;