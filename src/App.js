import logo from './logo.svg';
import React, { useEffect } from "react";
import './App.css';
import { Auth } from 'aws-amplify';
import Amplify, { DataStore, Predicates } from "aws-amplify";
import { Todo } from "./models";

//Use next two lines only if syncing with the cloud
import awsconfig from "./aws-exports";
Amplify.configure(awsconfig);

DataStore.configure({
  authProviders: {
    functionAuthProvider: async () => {
      const authToken = await refreshAuthToken(); // refreshAuthToken 
      
      return {
        token: authToken
      }
    },
  }
});


async function refreshAuthToken(){

  console.log('I got called');
  //console.log(await Auth.currentSession())
  let token = (await Auth.currentSession()).getIdToken().getJwtToken();
  console.log(token);
  return token;

}

function onCreate() {
  DataStore.save(
    new Todo({
      name: `New title ${Date.now()}`,
      description: 'test'
    })
  );
}

function signIn() {
  try {
      const user = Auth.signIn('abdullah', 'ab@160894M');
  } catch (error) {
      console.log('error signing in', error);
  }
}

function onDeleteAll() {
  DataStore.delete(Todo, Predicates.ALL);
}

async function onQuery() {
  const posts = await DataStore.query(Todo, (c) => c.rating("gt", 4));

  console.log(posts);
}

function App() {
  useEffect(() => {
    const subscription = DataStore.observe(Todo).subscribe((msg) => {
      console.log(msg.model, msg.opType, msg.element);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <input type="button" value="NEW" onClick={signIn} />
          <input type="button" value="NEW" onClick={onCreate} />
          <input type="button" value="DELETE ALL" onClick={onDeleteAll} />
          <input type="button" value="QUERY rating > 4" onClick={onQuery} />
        </div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}


export default App;
