import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks'
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { AppHeader, Home, User, NotFound, Login, Group } from './sections'
import { Layout, Spin } from 'antd'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { AppHeaderSkeleton, ErrorBanner } from './lib/components'
import { Viewer } from './lib/types'
import { LOG_IN } from './lib/graphql/mutations'
import { LogIn as logInData } from './lib/graphql/mutations/LogIn/__generated__/LogIn'
import './i18n'

const client = new ApolloClient({
  uri: "/api",
  request: async operation => {
    const token = sessionStorage.getItem('token');
    operation.setContext({
      headers: {
        "X-CSRF-TOKEN": token || ""
      }
    })
  }
})
const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  didRequest: false,
  address: null,
  adminAtt: false
}


const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer)
  const [logIn, { error }] = useMutation<logInData>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn)
        if (data.logIn.token) {
          window.sessionStorage.setItem("token", data.logIn.token)
        } else {
          window.sessionStorage.removeItem('token')
        }
      }
    },
    onError: (error) => console.log(error)
  })
  const logInRef = useRef(logIn)
  useEffect(() => {
    logInRef.current()
  }, [])
  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Lancing the app, pleas wait..." />
        </div>
      </Layout>
    )
  }
  const logInErrorBannerElement = error ? <ErrorBanner description="we weren't able to verify if you were logged in. Pleas try agin later" /> : null;

  return (
    <Router>
      {logInErrorBannerElement}
      <AppHeader viewer={viewer} setViewer={setViewer} />
      <Layout id="app">
        <Switch>
          <Route exact path="/">
            <Home viewer={viewer} />
          </Route>
          <Route exact path="/Login">
            <Login setViewer={setViewer} viewer={viewer} />
          </Route>
          <Route exact path="/user/:id">
            <User viewer={viewer} setViewer={setViewer} />
          </Route>
          <Route exact path="/group/:id">
            <Group viewer={viewer} />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  )
}
ReactDOM.render(
  <ApolloProvider client={client}><App /></ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
