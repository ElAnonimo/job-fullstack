import React from 'react';
import { Route, Redirect } from 'react-router';
import { connect } from 'react-redux';

const PrivateRoute = ({
	component: Component,
	auth: { isAutenticated, loading },
	...rest
}) => {
	console.log('isAutenticated from PrivateRoute:', isAutenticated);

	return (
		<Route {...rest} render={props => !isAutenticated && !loading
			? <Redirect to='/login' />
			: <Component {...props} /> 
		} />
	);
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
