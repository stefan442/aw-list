import React from 'react';

export default class AddTeam extends React.Component {

    handleSubmit(e){
        let teamName = e.target.teamName.value;

        e.preventDefault();
        Meteor.call('teamAdd', teamName);
        e.target.teamName.value = '';
    }

  render(){
    return(
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          	<input type="text" name="teamName" placeholder="Mannschaftsname" />
            <button>Team hinzufügen</button>
        </form>
      </div>
    );
  }
};
