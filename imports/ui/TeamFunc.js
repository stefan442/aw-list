import React from 'react';
import PropTypes from 'prop-types';

export default class TeamFunc extends React.Component {


      render(){
        return(
          <div>
            <h3>{this.props.team.name}</h3>
          <div>
            <button onClick={() => {
              this.props.history.replace('/datelist/' + this.props.team._id)
            }} className="buttonColor">{this.props.team.name}</button>
            <button onClick={() => Meteor.call('teamFullRemove', this.props.team._id)} className="buttonColor">
              X
            </button>
          </div>
          </div>
        );
      }
};

TeamFunc.propTypes = {
  team: PropTypes.object.isRequired
};
