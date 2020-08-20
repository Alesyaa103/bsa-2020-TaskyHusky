import React, { useState } from 'react';
import styles from './styles.module.scss';
import { Button, Header, Modal, Form, Checkbox, Popup } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from 'containers/Board/Scrum/logic/actions';
import { useTranslation } from 'react-i18next';
import { RootState } from 'typings/rootState';
import { ScrumBoardState } from 'containers/Board/Scrum/logic/state';

type Props = { clickAction: any; isOpen: boolean };

const CreateSprintModal = (props: Props) => {
	const scrumBoardState: ScrumBoardState = useSelector((rootState: RootState) => rootState.scrumBoard);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [isActive, setIsActive] = useState<boolean>(false);
	const [isCompleted, setIsCompleted] = useState<boolean>(false);
	const [name, setName] = useState<string>('');
	const [isNameValid, setIsNameValid] = useState<boolean>(true);

	const resetLocalState = () => {
		setIsActive(false);
		setIsCompleted(false);
		setName('');
	};

	const handleNoButtonClick = () => {
		resetLocalState();
		props.clickAction();
	};

	const handleYesButtonClick = () => {
		if (name.length === 0) {
			setIsNameValid(false);
			return;
		}

		const {
			board: { id: boardId },
			project: { id: projectId },
		} = scrumBoardState;
		const sprint = {
			sprintName: name.trim(),
			isActive,
			isCompleted,
			board: boardId,
			project: projectId,
		};
		dispatch(actions.createSprintTrigger({ sprint: sprint }));
		resetLocalState();
		props.clickAction();
	};

	return (
		<Modal onClose={props.clickAction} open={props.isOpen} size="small">
			<Header>Create sprint</Header>
			<Modal.Content>
				<Form>
					<Form.Field>
						<Popup
							className={styles.errorPopup}
							open={!isNameValid}
							content={t('invalid_email')}
							on={[]}
							trigger={
								<Form.Input
									label={t('sprint_name')}
									placeholder={t('enter_sprint_name')}
									value={name}
									error={!isNameValid}
									onFocus={() => {
										setIsNameValid(true);
									}}
									onBlur={() => {
										setIsNameValid(name.trim().length !== 0);
									}}
									onChange={(event) => {
										setName(event.target.value);
									}}
								/>
							}
						/>
					</Form.Field>
					<Form.Field>
						<Checkbox
							toggle
							label={isActive ? t('mark_sprint_as_active') : t('mark_sprint_as_inactive')}
							checked={isActive}
							onChange={() => {
								setIsActive(!isActive);
							}}
						/>
					</Form.Field>
					<Form.Field>
						<Checkbox
							toggle
							disabled
							label={isCompleted ? t('mark_sprint_as_completed') : t('mark_sprint_as_not_completed')}
							checked={isCompleted}
							onChange={() => {
								setIsCompleted(!isCompleted);
							}}
						/>
					</Form.Field>
				</Form>
			</Modal.Content>
			<Modal.Actions>
				<Button color="grey" onClick={handleNoButtonClick} content={t('cancel')} />
				<Button
					color="green"
					onClick={handleYesButtonClick}
					content={t('submit')}
					labelPosition="right"
					icon="checkmark"
					primary
				/>
			</Modal.Actions>
		</Modal>
	);
};

export default CreateSprintModal;
