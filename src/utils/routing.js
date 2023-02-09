import { Route, Navigate, useNavigate } from 'react-router-dom';

import { PRIVATE_ROUTE, PUBLIC_ROUTE } from 'configs';
import { useAuthContext } from 'context/AuthContext';

export default function routing(props) {
  const {
    Component,
    name,
    path,
    type,
    routes,
    hasChildren,
  } = props;
  const location = window.location;

  function RenderComponent() {
    const { isAuth } = useAuthContext();

    switch(type) {
      case PUBLIC_ROUTE: {
        if(!isAuth) {
          return <Component />
        } else {
          return <Navigate replace to="/dashboard" />
        }
      }
      case PRIVATE_ROUTE: {
        if(isAuth) {
          return <Component />
        } else {
          return <Navigate replace to="/" />
        }
      }
      default: {
        return <Component />
      }
    }
  }

  function RenderRoute() {
    if(hasChildren) {
      return(
        <Route
          key={name}
          path={path}
          element={<RenderComponent />}
        >
          {
            routes.map((route) => (
              routing(route)
            ))
          }
        </Route>
      )
    } else {
      return(
        <Route
          key={name}
          path={path}
          element={<RenderComponent />}
        />
      )
    }
  }

  return(
    RenderRoute()
  );
}