import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';
import { requestChangePassword } from 'containers/ProfilePage/logiс/actions';
import { Button, Form, Popup } from 'semantic-ui-react';
import SubmitedInput from 'components/SubmitedInput';
import PasswordCheck from 'components/PasswordCheck';

const SecurityManager = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [passwords, setPasswords] = useState({
		oldPassword: '',
		newPassword: '',
		repeatedPassword: '',
	});
	const [isRepeatedPassValid, setIsRepeatedPassValid] = useState(true);
	const [isPasswordValid, setIsPasswordValid] = useState(true);
	const handleChange = (event: any) => {
		setPasswords({
			...passwords,
			[(event.target as HTMLInputElement).name]: (event.target as HTMLInputElement).value,
		});
	};

	const onBlurPass = () => {
		setIsPasswordValid(passwords.newPassword.length >= 6);
	};

	const onBlurRepeated = () => {
		setIsRepeatedPassValid(
			!!passwords.newPassword &&
				!!passwords.repeatedPassword &&
				passwords.newPassword === passwords.repeatedPassword,
		);
	};
	const onSubmit = () => {
		if (isPasswordValid && isRepeatedPassValid) {
			const { oldPassword, newPassword } = passwords;
			dispatch(requestChangePassword({ oldPassword, newPassword }));
			setPasswords({ ...passwords, oldPassword: '', newPassword: '', repeatedPassword: '' });
		}
	};
	return (
		<section className={styles.container}>
			<h3 className={styles.header}>{t('security')}</h3>
			<div className={styles.card}>
				<h4 className={styles.card__header}>{t('change_pass')}</h4>
				<Form onSubmit={onSubmit}>
					<SubmitedInput
						text={passwords.oldPassword}
						propKey="oldPassword"
						title={t('current_pass')}
						placeholder={t('enter_old_pass')}
						type="password"
						handleChange={handleChange}
					/>
					<Popup
						className={styles.errorPopup}
						open={!isPasswordValid}
						content={t('pass_error_length')}
						on={[]}
						trigger={
							<SubmitedInput
								text={passwords.newPassword}
								propKey="newPassword"
								title={t('new_pass')}
								placeholder={t('enter_new_pass')}
								type="password"
								handleChange={handleChange}
								isValid={isPasswordValid}
								onBlur={onBlurPass}
							/>
						}
					/>

					<PasswordCheck passLength={passwords.newPassword.length} />
					<Popup
						className={styles.errorPopup}
						open={!isRepeatedPassValid}
						content={t('pass_error_equal')}
						on={[]}
						trigger={
							<SubmitedInput
								text={passwords.repeatedPassword}
								propKey="repeatedPassword"
								title={t('repeat_pass')}
								placeholder={t('placeholder_pass')}
								type="password"
								handleChange={handleChange}
								isValid={isRepeatedPassValid}
								onBlur={onBlurRepeated}
							/>
						}
					/>
					<Button className={styles.submitButton} type="submit">
						{t('save_changes')}
					</Button>
				</Form>
			</div>
		</section>
	);
};

export default SecurityManager;
