import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Container from '../App/component/Container'
import routes from './Routes'

function ProtectedRoute({ component: Component, ...rest }) {
  const jwtToken = localStorage.getItem("jwtToken")
  if(jwtToken === null) {
    return <Redirect to="/login" />
  }
  return(
    <Route {...rest} render={(routeProps) => (
      <Container>
        <Component {...routeProps}/>
      </Container>
    )}/>
  )
}

export default function AllRoutes() {
	return (
		<Switch>
			{routes.map((prop) => 
        prop.redirect ? <Redirect exact from={prop.path} to={prop.to} /> :
          prop.loginRequired ? <ProtectedRoute path={prop.path} component={prop.component} /> :
            <Route path={prop.path} component={prop.component} />
			)}
		</Switch>
	)
}
