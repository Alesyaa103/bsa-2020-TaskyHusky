import React, { useState, useEffect } from 'react';
import { Form, Button, Divider, Icon } from 'semantic-ui-react';
import PasswordInput from 'components/common/PasswordInput';
import validator from 'validator';
import { registerUser } from 'services/auth.service';
import { setToken } from 'helpers/setToken.helper';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from 'containers/LoginPage/logic/actions';
import { RootState } from 'typings/rootState';

const SignUpForm: React.FC = () => {
	const dispatch = useDispatch();
	const authStore = useSelector((rootStore: RootState) => rootStore.auth);

	const [email, setEmail] = useState<string>('');
	const [emailValid, setEmailValid] = useState<boolean>(true);
	const [password, setPassword] = useState<string>('');
	const [passwordValid, setPasswordValid] = useState<boolean>(true);
	const [firstName, setFirstName] = useState<string>('');
	const [firstNameValid, setFirstNameValid] = useState<boolean>(true);
	const [lastName, setLastName] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [redirecting, setRedirecting] = useState<boolean>(false);

	const buttonDisabled = !(password && passwordValid && email && emailValid && firstName && firstNameValid);

	useEffect(() => {
		if (!!authStore.jwtToken) {
			setToken(authStore.jwtToken);
			setLoading(false);
			setRedirecting(true);
		}
	}, [authStore.isAuthorized, redirecting]);

	const submit = async () => {
		if (buttonDisabled) {
			return;
		}

		setLoading(true);
		dispatch(actions.registerUserTrigger({ email, password, firstName, lastName }));
	};

	return (
		<Form onSubmit={submit}>
			{redirecting ? <Redirect to="/" /> : ''}
			<Form.Input
				placeholder="First name"
				onChange={(event, data) => {
					setFirstName(data.value);
					setFirstNameValid(true);
				}}
				onBlur={() => setFirstNameValid(Boolean(firstName))}
				error={!firstNameValid}
			/>
			<Form.Input placeholder="Last name" onChange={(event, data) => setLastName(data.value)} />
			<Form.Input
				type="email"
				iconPosition="left"
				icon="at"
				placeholder="Email"
				onChange={(event, data: { value: string }) => {
					setEmail(data.value);
					setEmailValid(true);
				}}
				onBlur={() => setEmailValid(validator.isEmail(email))}
				error={!emailValid}
			/>
			<PasswordInput onChange={setPassword} onChangeValid={setPasswordValid} />
			<Button disabled={buttonDisabled} fluid positive loading={loading} type="submit">
				Sign up
			</Button>
			<Divider horizontal>Or</Divider>
			<Button type="button">
				<Icon name="google" />
				Sign up with Google
			</Button>
		</Form>
	);
};

export default SignUpForm;
