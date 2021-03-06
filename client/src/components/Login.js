import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import { login } from '../actions/auth';

const Login = ({ auth: { isAutenticated }, message, login }) => {
	const [formData, setFormData] = useState({
		username: '',
		password: ''
	});
	const [visible, setVisible] = useState(true);

	const { username, password } = formData;

	const onDismiss = () => setVisible(false);

	const onChange = evt => setFormData({
		...formData,
		[evt.target.name]: evt.target.value
	});

	const onSubmit = evt => {
		evt.preventDefault();
		login(username, password);

		if (message) {
			setVisible(true);
		}
	};

	// redirect if user is logged in
	if (isAutenticated) {
		return <Redirect to='/' />;
	}

	return (
		<div className='login-container'>
			<h1 className='login-container__heading'>Войти</h1>
			<form className='form' onSubmit={onSubmit}>
				<div className='form-group'>
					<input
						type='text'
						placeholder='имя пользователя'
						name='username'
						value={username}
						onChange={onChange}
					/>
				</div>
				<div className='form-group'>
					<input
						type='password'
						placeholder='пароль'
						name='password'
						value={password}
						onChange={onChange}
					/>
				</div>
				<input type='submit' className='login-button' value='Войти' />
				{message && message.length > 0 &&
					<Alert className='login-alert' color='danger' isOpen={visible} toggle={onDismiss}>
						<span>{message}</span>
					</Alert>
				}
			</form>
		</div>
	);
};

const mapStateToProps = state => ({
	auth: state.auth,
	message: state.auth.message
});

Login.propTypes = {
	auth: PropTypes.object.isRequired,
	message: PropTypes.string,
	login: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { login })(Login);
