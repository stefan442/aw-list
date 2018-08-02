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
        <form className="teamListCenteredForm" onSubmit={this.handleSubmit.bind(this)}>
          	<input type="text" name="teamName" placeholder="Teamname" className="teamListCenteredFormInput"/>
            <button className="buttonColor">Team hinzufügen</button>
        </form>
        <div className="buttonLogout">
        <button onClick={this.onLogout.bind(this)} className="buttonColor">Logout</button>
        </div>
      </div>
    );
  }
};
