import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Records from './Records';
import Stats from './Stats';
import Login from './Login';
import PrivateRoute from './PrivateRoute';

const Routes = () => (
	<div className='app-container'>
		<Switch>
			<Route path='/login' component={Login} />
			<PrivateRoute path='/stats' component={Stats} />
			<PrivateRoute exact path='/' component={Records} />
		</Switch>
	</div>
);

export default Routes;
