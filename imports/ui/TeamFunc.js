import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

export default class TeamFunc extends React.Component {
  constructor() {
    super();
    this.state = {
      showModalTeam: false,
    }
    this.handleOpenModalTeam = this.handleOpenModalTeam.bind(this);
    this.handleCloseModalTeam = this.handleCloseModalTeam.bind(this);
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
  teamDelete(){
    Meteor.call('teamFullRemove', this.props.team._id);
    this.handleCloseModalTeam();
  }

  render(){
    return(
      <div className="teamListCenteredFunc">
        <button className="buttonColor buttonTeamName" onClick={() => {this.props.history.replace('/datelist/' + this.props.team._id)}}>
          {this.props.team.name}
        </button>
        <button className="buttonColor buttonTeamDel" onClick={this.handleOpenModalTeam}> X </button>

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
            <button onClick={this.handleCloseModalTeam} className="buttonColor confirmButtons">Abbrechen</button>
            <button onClick={this.teamDelete.bind(this)} className="buttonColor confirmButtons">Löschen</button>
          </form>
        </Modal>
      </div>
    );
  }
};

TeamFunc.propTypes = {
  team: PropTypes.object.isRequired
};
