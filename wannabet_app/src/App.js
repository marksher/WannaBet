import React, { Component } from 'react';
import abi from './abi.json';
import './App.css';

class App extends Component {
  constructor (props) {
    super (props);

    const MyContract = window.web3.eth.contract(abi);

    this.state = {
      ContractInstance : MyContract.at('0x873c2d5ac6b3373bd4a1a82cf1acdb45adb06360'),
      _betName : '',
      _timeLimitSeconds : '',
      _player2Address : '',
      _player1Address : '',
      _vote : '',
      _playerAddress : '',
      _value: '',
      createBetMsg: '',
      joinBetMsg: '',
      castVoteMsg: '',
      getBetMsg : '',
      cancelBetMsg: '',
      numberOfPlayerBetsMsg : '',
      getOpenBets: ''
    }

    this.handleCreateBet = this.handleCreateBet.bind (this);
    this.handleJoinBet = this.handleJoinBet.bind (this);
    this.handleCastVote = this.handleCastVote.bind (this);
    this.handleGetBet = this.handleGetBet.bind (this);
    this.handleCancelBet = this.handleCancelBet.bind (this);
    this.handleNumberOfPlayerBets = this.handleNumberOfPlayerBets.bind (this);
    this.handleGetOpenBets = this.handleGetOpenBets.bind (this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }


  handleCreateBet() {
    const { createBet } = this.state.ContractInstance;

    createBet (
      this.state._betName, 
      this.state._timeLimitSeconds, 
      this.state._player2Address,
      {
        gas : 3000000,
        from: window.web3.eth.accounts[0],
        value: window.web3.toWei(this.state._value, 'finney')
      }, ( err, result ) => {
        if (err) console.error ('error::::', err);
        this.setState({createBetMsg: result});
      });
    }

  handleJoinBet() {
    const { joinBet } = this.state.ContractInstance;

    joinBet (
      this.state._betName, 
      this.state._player1Address,
      {
        gas : 300000,
        from: window.web3.eth.accounts[0],
        value: window.web3.toWei(this.state._value, 'finney')
      }, ( err, result ) => {
        if (err) console.error ('error::::', err);
        this.setState({joinBetMsg: result});
      });
    }

    handleCastVote() {
      const { castVote } = this.state.ContractInstance;

      castVote(
        this.state._betName,
        this.state._vote,
        ( err, result ) => {
          if (err) console.error ('error::::', err);
          this.setState({castVoteMsg: result});
      });
    }

    handleGetBet() {
      const { getBet } = this.state.ContractInstance;

      getBet (
        this.state._betName,
        (err, result) => {
        if (err) console.error ('error::::', err);
        console.log ('bet infos::::', result);
        this.setState({getBetMsg: result});
      });
    }

    handleCancelBet() {
      const { cancelBet } = this.state.ContractInstance;

      cancelBet (
        this.state._betName, 
        this.state._player2Address,
        ( err, result ) => {
          if (err) console.error ('error::::', err);
          this.setState({cancelBetMsg: 'result' + result});
        });
      }

    handleNumberOfPlayerBets() {
      const { getNumberOfPlayerBets } = this.state.ContractInstance;

      getNumberOfPlayerBets (
        this.state._playerAddress,
        (err, result) => {
        if (err) console.error ('error::::', err);
        this.setState({numberOfPlayerBetsMsg: result});
      })
    }

    handleGetOpenBets() {
      const { getOpenBets } = this.state.ContractInstance;

      getOpenBets (
        this.state._playerAddress,
        (err, result) => {
          if (err) console.error ('error::::', err);
          this.setState({getOpenBets: result});
        });
    }


  render () {
      return (
        <div className="App">
        <img src="wannabet.png" height="200px" title="meme" alt="meme"/>
        <hr/>
          <h1> create bet </h1>
          <p>function createBet(string _betName, uint256 _timeLimitSeconds, address _player2Address) public payable </p>
          <input  type="text"  name="_betName"  placeholder="name of your bet..."  value={ this.state._betName } onChange={ this.handleChange } /><br />
          <input  type="text"  name="_value"  placeholder="value to bet in finney..."  value={ this.state._value } onChange={ this.handleChange } /><br />
          <input type="text" name="_timeLimitSeconds"  placeholder="expiry time > 1800..."  value={ this.state._timeLimitSeconds } onChange={ this.handleChange } /><br />
          <input type="text" name="_player2Address" placeholder="player 2 address..." value={ this.state._player2Address } onChange={ this.handleChange } /><br />
          <button value="Send" onClick={ this.handleCreateBet }> create bet </button>
          <div><a target={'_blank'} href={'https://rinkeby.etherscan.io/tx/' + this.state.createBetMsg}>{this.state.createBetMsg}</a></div>
          <hr />

          <h1> join bet </h1>
          <p>function joinBet(string _betName, address _player1Address) public payable</p>
          <input  type="text"  name="_betName"  placeholder="name of the bet player1 created..."  value={ this.state._betName } onChange={ this.handleChange } /><br />
          <input  type="text"  name="_value"  placeholder="value in finney..."  value={ this.state._value } onChange={ this.handleChange } /><br />
          <input type="text" name="_player1Address" placeholder="player1..." value={ this.state._player1Address } onChange={ this.handleChange } /><br />
          <button value="Send" onClick={ this.handleJoinBet }> join bet </button>
          <div><a target={'_blank'} href={'https://rinkeby.etherscan.io/tx/' + this.state.joinBetMsg}>{this.state.joinBetMsg}</a></div>
          <hr />

          <h1> cast vote </h1>
          <p>function castVote(string _betName, uint _vote) public payable</p>
          <input  type="text"  name="_betName"  placeholder="betname..."  value={ this.state._betName } onChange={ this.handleChange } /><br />
          <input type="text" name="_vote" placeholder="vote (1 for player1 and 2 for player2)" value={ this.state._vote } onChange={ this.handleChange } /><br />
          <button value="Send" onClick={ this.handleCastVote }> vote </button>
          <div><a target={'_blank'} href={'https://rinkeby.etherscan.io/tx/' + this.state.castVoteMsg}>{this.state.castVoteMsg}</a></div>
          <hr />

          <h1> get bet </h1>
          <p>function getBet(bytes32 _betId) public view returns (string betName, uint256 betAmount, BetStatus betStatus, uint256 betEndTime, BetWinner betWinner, address p1Address, address p2Address, uint256 p1Vote, uint256 p2Vote) </p>
          <input  type="text"  name="_betName"  placeholder="betname..."  value={ this.state._betName } onChange={ this.handleChange } /> <br />
          <button value="Send" onClick={ this.handleGetBet }> get bet </button>
          <table>
            <tbody>
              <tr><td>betName</td><td>{ this.state.getBetMsg[0] }</td></tr>
              <tr><td>betAmount</td><td>{ JSON.stringify(this.state.getBetMsg[1]) }</td></tr>
              <tr><td>betStatus</td><td>{ JSON.stringify(this.state.getBetMsg[2]) }</td></tr>
              <tr><td>betEndTime</td><td>{ JSON.stringify(this.state.getBetMsg[3]) }</td></tr>
              <tr><td>betWinner</td><td>{ JSON.stringify(this.state.getBetMsg[4]) }</td></tr>
              <tr><td>player1Address</td><td>{ this.state.getBetMsg[5] }</td></tr>
              <tr><td>player2Address</td><td>{ this.state.getBetMsg[6] }</td></tr>
              <tr><td>p1Vote</td><td>{ JSON.stringify(this.state.getBetMsg[7]) }</td></tr>
              <tr><td>p2Vote</td><td>{ JSON.stringify(this.state.getBetMsg[8]) }</td></tr>
            </tbody>
          </table>
          <hr/>

          <h1> cancel bet </h1>
          <p>function cancelBet(string _betName, address _player2Address) public </p>
          <input  type="text"  name="_betName"  placeholder="betname..."  value={ this.state._betName } onChange={ this.handleChange } /><br />
          <input type="text" name="_player2Address" placeholder="player2..." value={ this.state._player2Address } onChange={ this.handleChange } /><br />
          <button value="Send" onClick={ this.handleCancelBet }> cancel bet </button>
          <div><a target={'_blank'} href={'https://rinkeby.etherscan.io/tx/' + this.state.cancelBetMsg}>{this.state.cancelBetMsg}</a></div>
          <hr/>

          <h1> get number of player bets </h1>
          <p>function getNumberOfPlayerBets(address _playerAddress) public view returns (uint num_createdBets, uint num_openBets, uint num_ongoingBets, uint num_pastBets) </p>
          <input type="text" name="_playerAddress" placeholder="player address..." value={ this.state._playerAddress } onChange={ this.handleChange } /><br />
          <button value="Send" onClick={ this.handleNumberOfPlayerBets }> get number of player bets </button>
          <table>
            <tbody>
              <tr><td>num_createdBets</td><td>{ JSON.stringify(this.state.numberOfPlayerBetsMsg[0]) }</td></tr>
              <tr><td>num_openBets</td><td>{ JSON.stringify(this.state.numberOfPlayerBetsMsg[1]) }</td></tr>
              <tr><td>num_ongoingBets</td><td>{ JSON.stringify(this.state.numberOfPlayerBetsMsg[2]) }</td></tr>
              <tr><td>num_pastBets</td><td>{ JSON.stringify(this.state.numberOfPlayerBetsMsg[3]) }</td></tr>
            </tbody>
          </table>
          <hr/>

          <h1>get my open bets</h1>
          <p>function getOpenBets(address _playerAddress) public view returns (bytes32[])</p>
          <input type="text" name="_playerAddress" placeholder="player address..." value={ this.state._playerAddress } onChange={ this.handleChange } /><br />
          <button value="Send" onClick={ this.handleGetOpenBets }> get open bets </button>
          <div>{ this.state.getOpenBets }</div>
          <hr/>

        </div>
    )};
}







export default App;
