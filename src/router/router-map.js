
import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

function RouterMap (props) {
  let { routes } = props



  routes.map((item, index) => {
    return <Route key={index} path={item.path} exact render={props =>
      (!item.auth ? (<item.component {...props} />) : (token ? <item.component {...props} /> : <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />)
      )} />
  })


  let token = localStorage.getItem('Authorization')
  return (
    <Switch>
      {
        routes && routes.length ? routes.map(item => {
          return item.path ?
            <Route key={item.path} path={item.path} component={(props) => {
              return item.meta.requireAuth && item.children && item.children.length ?
                <item.component {...props}>
                  <RouterMap routes={item.children} />
                </item.component> : token ? <item.component {...props} /> : <Redirect to={{
                  pathname: '/login',
                  state: { from: props.location }
                }} />
            }} /> : <Redirect from={item.to} to={item.redirect} key={item.to} />
        }) : ''
      }
    </Switch>
  )
}


export default RouterMap
