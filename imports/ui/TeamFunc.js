import React from 'react';
import PropTypes from 'prop-types';

export default class TeamFunc extends React.Component {


      render(){
        return(
          <div className="teamListCenteredFunc">
            <button className="buttonColor buttonTeamName" onClick={() => {
              this.props.history.replace('/datelist/' + this.props.team._id)
            }} >{this.props.team.name}</button>
            <button className="buttonColor buttonTeamDel" onClick={() => Meteor.call('teamFullRemove', this.props.team._id)}>
              X
            </button>
          </div>
        );
      }
};

TeamFunc.propTypes = {
  team: PropTypes.object.isRequired
};
