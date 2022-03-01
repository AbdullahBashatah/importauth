import logo from './logo.svg';
import './App.css';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { Hub, Logger } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Home from './Home';
import {
  BrowserRouter as Router,
  Routes,
  Switch,
  Route,
  Link
} from "react-router-dom";

const logger = new Logger('My-Logger');

const listener = (data) => {
  console.log(data);
    switch (data.payload.event) {
        case 'signIn':
            logger.info('user signed in');
            break;
        case 'signUp':
            logger.info('user signed up');
            break;
        case 'signOut':
            logger.info('user signed out');
            break;
        case 'signIn_failure':
            logger.error('user sign in failed');
            break;
        case 'tokenRefresh':
            logger.info('token refresh succeeded');
            break;
        case 'tokenRefresh_failure':
            logger.error('token refresh failed');
            break;
        case 'configured':
            logger.info('the Auth module is configured');
    }
}

Hub.listen('auth', listener);

Amplify.configure(awsconfig);


function auth(){
  try {
    Auth.federatedSignIn().then(res=>{
      console.log('entering resolve')
      console.log(res);
      //console.log(dis);
    }).then(mm => console.log(mm)).then(nn =>console.log(nn)).catch(e=>{
      console.log('entering error')
      console.log(e)
    });
  } catch (error) {
    console.log(error);
  }


}

export const handleGoogleLogin = async () => {
  try {
    await Auth.federatedSignIn({
      provider: 'Google',
    });
  } catch (e) {
    console.log(`Google login error --->`, e);
  }
};


export const printAuth = async () => {
  try {
    let t = await Auth.currentAuthenticatedUser();
    console.log(t);
    console.log("cred", await Auth.currentCredentials());
    console.log("sessiong", await Auth.currentSession());

  } catch (e) {
    console.log(`Google login error --->`, e);
  }
};

function reconfig (){
  Amplify.configure({
    Auth: {
      identityPoolId: 'us-east-1:2472e0a8-3733-47df-b62f-b167c60e000b',
      region: 'us-east-1'
    },
  })
}

export const clearcache = async () => {
  try {
console.log(await Auth.currentAuthenticatedUser({ bypassCache: true}));
console.log("cred", await Auth.currentCredentials());
  }catch (e){
    console.log(e);
  }
}

export const forgotpassword = async () => {
  try {
console.log(await Auth.forgotPassword("bashatah1o3"));
  }catch (e){
    console.log(e);
  }
}

export const forgotpasswordConfirm = async () => {
  try {
console.log(await Auth.forgotPasswordSubmit("bashatah1o3", "177046", "gamer@867235M"));
  }catch (e){
    console.log(e);
  }
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then(userData => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    getUser().then(userData => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }
  async function getUserInfo() {
    let info = await Auth.currentAuthenticatedUser()
      .then(userData => userData.attributes)
      .catch(() => console.log('Not signed in'));
      console.log(info.email);
  }
  return (
    <div className="App">
    <button onClick={getUserInfo} >getUser</button>
   <button onClick={auth} >federatedSignIn</button>
   <button onClick={clearcache} >clearcache</button>
   <button onClick={printAuth} >printAuth</button>
   <button onClick={reconfig} >reconfig</button>

   <button onClick={forgotpassword} >forgotpassword</button>
   <button onClick={forgotpasswordConfirm} >forgotpasswordConfirm</button>



   
   <Link to="/home">Home </Link>
   <Routes>
                <Route path="/home" component={Home} />
            </Routes>

    </div>
    /*<div>
    <AmplifySignOut />
    My App
  </div>*/
  );
}

export default App;
//export default withAuthenticator(App);
