import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Header, Icon, Divider, InputOnChangeData, Label } from 'semantic-ui-react';
import { connect, useDispatch } from 'react-redux';
import { RootState } from 'typings/rootState';
import TagsInput from 'components/common/TagsInput';
import { useCreateIssueModalContext } from 'containers/CreateIssueModal/logic/context';
import { updateIssue } from 'pages/IssuePage/logic/actions';
import { useTranslation } from 'react-i18next';
import { getUsername } from 'helpers/getUsername.helper';
import { isNumber } from 'util';
import { IssueConstants } from 'constants/Issue';
import IssueFileInput from 'components/IssueFileInput';
import { initialState } from 'containers/CreateIssueModal/logic/initalState';
import { getProjectById } from 'services/projects.service';
import { getBoardById } from 'services/board.service';

interface Props {
	current: WebApi.Issue.PartialIssue;
	issueTypes: WebApi.Entities.IssueType[];
	priorities: WebApi.Entities.Priority[];
	statuses: WebApi.Entities.IssueStatus[];
	users: WebApi.Entities.UserProfile[];
	isOpened?: boolean;
	onSubmit?: (data: WebApi.Issue.PartialIssue) => void;
	setOpened: (isOpened: boolean) => void;
}

interface SelectOption {
	key: string | number;
	text: string | JSX.Element;
	value: any;
	style?: any;
}

const UpdateIssueModal: React.FC<Props> = ({
	current,
	issueTypes,
	priorities,
	users,
	onSubmit,
	statuses,
	isOpened,
	setOpened,
}) => {
	const context = useCreateIssueModalContext();
	const [attachments, setAttachments] = useState<File[]>([]);
	const [isStoryPointValid, setIsStoryPointValid] = useState(true);
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const [labels, setLabels] = useState<WebApi.Entities.ProjectLabel[]>([]);
	const [mustFetchLabels, setMustFetchLabels] = useState<boolean>(true);
	const [columns, setColumns] = useState<WebApi.Result.BoardColumnResult[]>([]);
	const [mustFetchColumns, setMustFetchColumns] = useState<boolean>(true);

	useEffect(() => {
		if (mustFetchLabels) {
			getProjectById(current.project as string).then(({ labels }) => setLabels(labels));
			setMustFetchLabels(false);
		}
	}, [mustFetchLabels, labels, current.project]);

	useEffect(() => {
		if (mustFetchColumns && current.board) {
			getBoardById(current.board).then((board) => setColumns(board.columns));
			setMustFetchColumns(false);
		}
	}, [mustFetchColumns, columns, current.board]);

	const typeOpts: SelectOption[] = issueTypes.map((type) => ({
		key: type.id,
		value: type.id,
		text: (
			<>
				{type.icon ? <Icon name={type.icon as any} color={type.color as any} /> : ''}
				<span style={{ color: type.color }}>{type.title ?? 'untitled'}</span>
			</>
		),
		style: {
			color: type.color ?? 'white',
		},
	}));

	const priorityOpts: SelectOption[] = priorities.map((priority) => ({
		key: priority.id,
		value: priority.id,
		text: (
			<>
				{priority.icon ? <Icon name={priority.icon as any} color={priority.color as any} /> : ''}
				<span style={{ color: priority.color }}>{priority.title ?? 'untitled'}</span>
			</>
		),
		style: {
			color: priority.color ?? 'white',
		},
	}));

	const labelOpts: SelectOption[] = labels.map((label, i) => ({
		key: i,
		value: label.id,
		text: <Label style={{ backgroundColor: label.backgroundColor, color: label.textColor }}>{label.text}</Label>,
	}));

	const usersOpts: SelectOption[] = users.map((user) => ({
		key: user.id,
		value: user.id,
		text: getUsername(user),
	}));

	const statusesOpts: SelectOption[] = statuses.map(({ id, title, color }) => ({
		key: id,
		value: id,
		text: <span style={{ color, fontWeight: 'bold' }}>{title}</span>,
	}));

	const columnsOpts: SelectOption[] = columns.map(({ columnName, id }) => ({
		key: id,
		value: id,
		text: columnName,
	}));

	const submit = async (event: React.FormEvent) => {
		event.preventDefault();
		const allFields = context.data.type && context.data.priority && context.data.summary;

		if (!allFields || !isStoryPointValid) {
			return;
		}

		dispatch(
			updateIssue({
				// This field exists always
				id: current.id as string,
				data: context.data,
				files: attachments,
			}),
		);

		setOpened(false);

		if (onSubmit) {
			onSubmit(context.data);
		}
	};

	const handleStoryPointChange = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
		const { value } = data;
		const number = parseInt(value, 10);
		if (value.length === 0) {
			context.set('storyPoint', value);
			setIsStoryPointValid(true);
			return;
		}
		if (isNumber(number) && number <= IssueConstants.maxStoryPoint && number >= IssueConstants.minStoryPoint) {
			context.set('storyPoint', value);
			setIsStoryPointValid(true);
		} else {
			setIsStoryPointValid(false);
		}
	};
	const clearContext = () => {
		// Can't do it without any
		Object.keys(context.data).forEach((key) => context.set(key as any, (initialState as any)[key]));
	};

	return (
		<Modal
			as="form"
			onSubmit={submit}
			open={isOpened}
			closeOnDimmerClick
			closeOnEscape
			onOpen={clearContext}
			onClose={() => setOpened(false)}
		>
			<Modal.Header>
				<Header as="h1" className="standartHeader">
					{t('edit_issue')}
				</Header>
			</Modal.Header>
			<Modal.Content scrolling>
				<Form
					as="div"
					onKeyDown={(event: React.KeyboardEvent) => event.key === 'Enter' && event.preventDefault()}
				>
					<Form.Field>
						<label className="required standartLabel">{t('Status')}</label>
						<Form.Dropdown
							className="formSelect"
							selection
							style={{ maxWidth: 200 }}
							options={statusesOpts}
							defaultValue={current.status}
							placeholder={t('Status')}
							onChange={(event, data) => context.set('status', data.value as string)}
						/>
					</Form.Field>
					<Form.Field>
						<label className="required">{t('type')}</label>
						<Form.Dropdown
							className="formSelect"
							selection
							style={{ maxWidth: 200 }}
							options={typeOpts}
							defaultValue={current.type}
							placeholder={t('type')}
							onChange={(event, data) => context.set('type', data.value as string)}
						/>
					</Form.Field>
					<Form.Field>
						<label className="required standartLabel">{t('priority')}</label>
						<Form.Dropdown
							className="formSelect"
							selection
							style={{ maxWidth: 200 }}
							options={priorityOpts}
							defaultValue={current.priority}
							placeholder={t('priority')}
							onChange={(event, data) => context.set('priority', data.value as string)}
						/>
					</Form.Field>
					<Form.Field>
						<label className="required stanadrtLabel">{t('summary')}</label>
						<Form.Input
							placeholder={t('summary')}
							fluid
							className="standartInput"
							defaultValue={current.summary}
							onChange={(event, data) => context.set('summary', data.value as string)}
						/>
					</Form.Field>
					<Form.Field>
						<label className="stanadrtLabel">{t('labels')}</label>
						<Form.Dropdown
							clearable
							selection
							multiple
							search
							noResultsMessage={t('no_more_labels')}
							placeholder={t('labels')}
							options={labelOpts}
							value={context.data.labels}
							onChange={(event, data) => context.set('labels', data.value as string)}
						/>
					</Form.Field>
					<Divider />
					<Form.Field>
						<label className="stanadrtLabel">{t('assigned')}</label>
						<Form.Dropdown
							className="formSelect"
							clearable
							selection
							defaultValue={current.assigned}
							placeholder={t('assigned')}
							options={usersOpts}
							onChange={(event, data) => context.set('assigned', data.value as string)}
						/>
					</Form.Field>
					{current.boardColumn && current.board ? (
						<Form.Field>
							<label className="stanadrtLabel">{t('column')}</label>
							<Form.Dropdown
								className="formSelect"
								clearable
								selection
								defaultValue={current.boardColumn}
								placeholder={t('column')}
								options={columnsOpts}
								onChange={(event, data) => context.set('boardColumn', data.value as string)}
							/>
						</Form.Field>
					) : (
						''
					)}
					<Form.Field>
						<label className="stanadrtLabel">{t('story_point')}</label>
						<Form.Input
							className="standartInput"
							type="number"
							error={!isStoryPointValid}
							placeholder={t('story_point')}
							fluid
							defaultValue={current.storyPoint}
							onChange={handleStoryPointChange}
						/>
					</Form.Field>
					<Form.Field>
						<label className="stanadrtLabel">{t('links')}</label>
						<TagsInput
							placeholder={t('add_link')}
							tags={context.data.links ?? []}
							onChange={(tags) => context.set('links', [...tags])}
						/>
					</Form.Field>
					<Form.Field>
						<label className="stanadrtLabel">{t('attachments')}</label>
						<IssueFileInput
							currentFiles={attachments}
							onChange={(newFiles) => setAttachments(newFiles)}
							onDeleteAlreadyAttached={(newLinks) => context.set('attachments', newLinks)}
							alreadyAttached={context.data.attachments ?? []}
						/>
					</Form.Field>
					<Form.Field>
						<label className="stanadrtLabel">{t('description')}</label>
						<Form.TextArea
							className="standartInput"
							placeholder={t('description')}
							defaultValue={current.description}
							style={{ resize: 'none' }}
							rows={4}
							onChange={(event, data) =>
								data ? context.set('description', data.value as string) : context.set('description', '')
							}
						/>
					</Form.Field>
				</Form>
			</Modal.Content>
			<Modal.Actions style={{ backgroundColor: '#efefef' }}>
				<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
					<Button className="primaryBtn" type="submit">
						{t('submit')}
					</Button>
					<Button onClick={() => setOpened(false)} className="cancelBtn">
						{t('cancel')}
					</Button>
				</div>
			</Modal.Actions>
		</Modal>
	);
};

const mapStateToProps = (state: RootState) => ({
	issueTypes: state.issues.types,
	priorities: state.issues.priorities,
	statuses: state.issues.statuses,
	users: state.users.users,
});

export default connect(mapStateToProps)(UpdateIssueModal);
