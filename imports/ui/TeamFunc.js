import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import MissingTrainer from './MissingTrainer.js';
import Trainer from './Trainer.js';

export default class TeamFunc extends React.Component {
  constructor() {
    super();
    this.state = {
      showModalTeam: false,
      showModalTrainer: false,
    }
    this.handleOpenModalTeam = this.handleOpenModalTeam.bind(this);
    this.handleCloseModalTeam = this.handleCloseModalTeam.bind(this);
    this.handleOpenModalTrainer = this.handleOpenModalTrainer.bind(this);
    this.handleCloseModalTrainer = this.handleCloseModalTrainer.bind(this);
  }
  componentWillMount() {
    Modal.setAppElement('body');
  }
  handleOpenModalTeam () {
    this.setState({ showModalTeam: true });
  }
  //schliesst popup für Termin hinzufuegen
  handleCloseModalTeam () {
    this.setState({ showModalTeam: false });
  }
  handleOpenModalTrainer () {
    this.setState({ showModalTrainer: true });
  }
  handleCloseModalTrainer () {
    this.setState({ showModalTrainer: false });
  }
  teamDelete(){
    Meteor.call('teamFullRemove', this.props.team._id);
    this.handleCloseModalTeam();
  }
  renderDeleteTeamButton(){
    if(this.props.team.created == Meteor.userId()){
      return(
        <div className="teamListCenteredFunc">
          <button type="button" onClick={() =>{
            this.handleOpenModalTeam()}} className="buttonColor buttonTeamDel"> X
          </button>

          <Modal
            appElement = {document.getElementById('body')}
            isOpen={this.state.showModalTeam}
            contentLabel="onRequestClose Example"
            onRequestClose={this.handleCloseModalTeam}
            shouldCloseOnOverlayClick={false}
            className="boxed-view__box confirmMessage"
            overlayClassName="boxed-view boxed-view--modal"
          >
            <p>Möchten Sie wirklich dieses Team löschen?</p>
            <form className="borderButton">
              <button type="button" onClick={this.handleCloseModalTeam} className="buttonColor confirmButtons">Abbrechen</button>
              <button type="button" onClick={this.teamDelete.bind(this)} className="buttonColor confirmButtons">Löschen</button>
            </form>
          </Modal>
        </div>
      )
    }
  }

  render(){
    return(
      <div className="teamListCenteredFunc">
        <button className="buttonColor buttonTeamName" onClick={() => {this.props.history.replace('/datelist/' + this.props.team._id)}}>
          {this.props.team.name}
        </button>
        <button className="buttonColor buttonTeamTrainer" onClick={this.handleOpenModalTrainer}> Trainer </button>
        {this.renderDeleteTeamButton()}

        <Modal
          appElement = {document.getElementById('body')}
          isOpen={this.state.showModalTrainer}
          contentLabel="onRequestClose Example"
          onRequestClose={this.handleCloseModalTrainer}
          shouldCloseOnOverlayClick={false}
          className="boxed-view__box confirmMessage"
          overlayClassName="boxed-view boxed-view--modal"
        >
          <p>Trainer: </p>
          <div className="missingPlayers">
            <Trainer {...this.props}/>
          </div>
          <p>Trainer hinzugügen:</p>
          <div className="missingPlayers">
            <MissingTrainer {...this.props}/>
          </div>
          <form className="borderButtonClose">
            <button type="button" onClick={this.handleCloseModalTrainer} className="buttonColor confirmButtons">Schließen</button>
          </form>
        </Modal>
      </div>
    );
  }
};

TeamFunc.propTypes = {
  team: PropTypes.object.isRequired
};
