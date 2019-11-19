import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';
import { connect } from 'react-redux';

const PrivateRoute = ({
	component: Component,
	auth: { isAutenticated, loading, token },
	...rest
}) => {
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

PrivateRoute.propTypes = {
	auth: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(PrivateRoute);
