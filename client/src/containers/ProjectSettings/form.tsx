import React, { useState } from 'react';
import { Form, TextArea, Button, Icon, Popup } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import * as actions from './logic/actions';

import styles from './styles.module.scss';
import { useDispatch } from 'react-redux';
import mockAvatar from 'assets/images/projectAvatars/viewavatar.svg';
import { Link, Redirect } from 'react-router-dom';
import CustomInput from 'components/common/Input/CustomInput';
import validator from 'validator';

interface Props {
	projectData: WebApi.Entities.Projects;
}

const ProjectForm = ({ projectData }: Props) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const [project, setProject] = useState<WebApi.Entities.Projects>(projectData);

	const [isNameValid, setIsNameValid] = useState<boolean>(true);
	const [isKeyValid, setIsKeyValid] = useState<boolean>(true);
	const [isValidErrorShown, setIsValidErrorShown] = useState<boolean>(false);

	const onProjectChange = (field: string, value: string) => {
		setProject((state) => ({
			...state,
			[field]: value,
		}));
	};

	const onSave = () => {
		if (!isNameValid || !isKeyValid) {
			setIsValidErrorShown(true);
			return;
		}

		dispatch(actions.startUpdatingProject({ project }));
	};

	const options = [
		{ key: 'm', text: t('unassigned'), value: 'unassigned' },
		{ key: 'f', text: t('project_lead'), value: 'projectLead' },
	];

	return (
		<>
			{!projectData.id ? (
				<Redirect to={'/projects'} />
			) : (
				<div className={styles.form__container}>
					<Form>
						<Form.Field className={styles.form__input_key} required>
							<label className={styles.avatar__label}>{t('name')}</label>
							<CustomInput
								isValidErrorShown={isValidErrorShown}
								isDataValid={isNameValid}
								setIsDataValid={setIsNameValid}
								data={project.name}
								setData={(data) => onProjectChange('name', data)}
								placeholder="Enter project name"
								popUpContent="Project name should contain at least 5 symbols long"
								validation={(name) => validator.isLength(name, { min: 5 })}
								popUpPosition="bottom right"
							/>
						</Form.Field>
						<Form.Field className={styles.form__input_key} required>
							<label>{t('key')}</label>
							<div className={styles.form__input_container}>
								<CustomInput
									isValidErrorShown={isValidErrorShown}
									isDataValid={isKeyValid}
									setIsDataValid={setIsKeyValid}
									data={project.key}
									setData={(data) => onProjectChange('key', data)}
									placeholder={t('example') + ': QA'}
									popUpContent="Key should contain at least 2 symbols long"
									validation={(key) => validator.isLength(key, { min: 2 })}
									popUpPosition="bottom left"
								/>
								<Popup
									trigger={
										<Icon name="info circle" className={styles.information__icon} size={'large'} />
									}
									position="bottom center"
									content="Changing the project key will start a background re-index of your project, and may break some external integrations."
								/>
							</div>
						</Form.Field>
						<Form.Input
							className={styles.form__input}
							label="URL"
							type="text"
							placeholder={'https://www...'}
						/>
						<Form.Field className={styles.form__input} required>
							<label>{t('project_category')}</label>
							<div className={styles.form__input_container}>
								<input placeholder={t('category')} />
								<Popup
									trigger={
										<Icon name="info circle" className={styles.information__icon} size={'large'} />
									}
									position="bottom center"
									content="You haven't created any project categories yet."
								/>
							</div>
						</Form.Field>
						<Form.Field required className={styles.form__input}>
							<label className={styles.avatar__label}>{t('avatar')}</label>
							<button type="button" className={styles.form__avatar}>
								<img className={styles.avatar__img} src={mockAvatar} alt="Project avatar" />
								<span className={styles.avatar__text}>{t('select_image')}</span>
							</button>
						</Form.Field>
						<Form.Field className={styles.form__area}>
							<label className={styles.avatar__label}>{t('description')}</label>
							<TextArea placeholder={t('project_desc')} rows={'7'} />
						</Form.Field>
						<Form.Input
							className={styles.form__input}
							label={t('project_lead')}
							placeholder={t('project_lead_name')}
							required
							type="text"
						/>
						<Form.Field className={styles.form__input}>
							<label className={styles.avatar__label}>{t('default_assignee')}</label>
							<div className={styles.form__input_container}>
								<Form.Select
									options={options}
									placeholder={t('unassigned')}
									className={styles.form__input_select}
								/>
								<Popup
									trigger={
										<Icon name="info circle" className={styles.information__icon} size={'large'} />
									}
									position="top center"
									content={t('default_assignee_desc')}
								/>
							</div>
						</Form.Field>
						<div>
							<Button primary onClick={onSave}>
								{t('save_details')}
							</Button>
							<Link to="/projects">{t('cancel')}</Link>
						</div>
					</Form>
				</div>
			)}
		</>
	);
};

export default ProjectForm;
