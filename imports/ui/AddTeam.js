import React from 'react';

export default class AddTeam extends React.Component {
  onLogout() {
    Accounts.logout();
  }

  handleSubmit(e){
    let teamName = e.target.teamName.value;

    e.preventDefault();
    Meteor.call('teamAdd', teamName);
    e.target.teamName.value = '';
  }

  render(){
    return(
      <div>
        <form className="teamListCentered" onSubmit={this.handleSubmit.bind(this)}>
          	<input type="text" name="teamName" placeholder="Mannschaftsname" />
            <button className="buttonColor">Team hinzufügen</button>
        </form>
        <button onClick={this.onLogout.bind(this)} className="buttonColor">Logout</button>
      </div>
    );
  }
};
