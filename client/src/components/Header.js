import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';

const Header = ({ text = '', goto='#!', logout }) => {
	const onLogoutClick = () => {
		logout();
	};

	return (
		<div className='header-div'>
			<Link className='header__heading' to={`${goto}`}>{text}</Link>
			<div className='header-spacefiller'></div>
			<input className='header__button' type='button' onClick={onLogoutClick} value='Выйти' />
		</div>
	);
};

Header.propTypes = {
	logout: PropTypes.func.isRequired
};

export default connect(null, { logout })(Header);
