import React, { Component } from "react";

import AuthContext from '../context/auth-context';
import './Auth.css';

class AuthPage extends Component {
  state = {
    isLoggedIn: true
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailElem = React.createRef();
    this.passwordElem = React.createRef();
  }

  submitHandler = event => {
    event.preventDefault();
    const email = this.emailElem.current.value;
    const password = this.passwordElem.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const requestBody = this.state.isLoggedIn ? {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    } : {
      query: `
        mutation {
          createUser(userInput: {email: "${email}", password: "${password}"}) {
            _id
            email
          }
        }
      `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error(`Failed HTTP Request: ${res.status}`);
      }
      return res.json();
    }).then(responseData => {
      if (responseData.data.login.token) {
        const serverRes = responseData.data.login;
        this.context.login(serverRes.token, serverRes.userId, serverRes.tokenExpiration);
        
      }
    }).catch(error => {
      console.log(`Error sending HTTP request: ${error}`);
    })
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return {isLoggedIn: !prevState.isLoggedIn};
    })
  }

  render() {
    return <form className="auth-form" onSubmit={this.submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input type="email" id="email" ref={this.emailElem}/>
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={this.passwordElem}/>
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={this.switchModeHandler}>Switch to {this.state.isLoggedIn ? 'Signup' : 'Login'}</button>
      </div>
    </form>;
  }
}

export default AuthPage;
