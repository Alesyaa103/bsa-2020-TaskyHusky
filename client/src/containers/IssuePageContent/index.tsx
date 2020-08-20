import React, { createRef, useState, useEffect } from 'react';
import { Button, Label, Icon, Ref, Sticky, Comment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { ContextProvider } from 'containers/CreateIssueModal/logic/context';
import UpdateIssueModal from 'containers/UpdateIssueModal';
import { getUsername } from 'helpers/getUsername.helper';
import IssueCommentForm from 'components/IssueCommentForm';
import { getComments } from 'services/issue.service';
import IssueComment from 'components/IssueComment';
import { useSelector } from 'react-redux';
import { RootState } from 'typings/rootState';
import { generateRandomString } from 'helpers/randomString.helper';
import styles from './styles.module.scss';

interface Props {
	issue: WebApi.Result.IssueResult;
	forceCommentsLeft?: boolean;
}

const IssuePageContent: React.FC<Props> = ({ issue, forceCommentsLeft }) => {
	const [comments, setComments] = useState<WebApi.Result.IssueCommentResult[]>([]);
	const [mustFetchComments, setMustFetchComments] = useState<boolean>(true);
	const { t } = useTranslation();
	const authData = useSelector((state: RootState) => state.auth);
	let openEditModal: () => void = () => {};
	const ref = createRef<HTMLElement>();

	const initalIssue = {
		...issue,
		type: issue.type.id,
		priority: issue.priority.id,
	};

	useEffect(() => {
		if (mustFetchComments) {
			getComments(issue.id).then(setComments);
			setMustFetchComments(false);
		}
	}, [mustFetchComments, issue.id]);

	if (mustFetchComments || !authData.user) {
		return null;
	}

	return (
		<Ref innerRef={ref}>
			<div
				className={`fill ${styles.container}`}
				style={{ position: 'relative', ...(forceCommentsLeft ? { justifyContent: 'flex-start' } : {}) }}
			>
				<div className={styles.innerContainer}>
					<h4>
						<span style={{ fontWeight: 400 }}>#{issue.issueKey}</span>
					</h4>
					<h1>{issue.summary}</h1>
					<h4>{t('description')}</h4>
					<p>{issue.description}</p>
					<h3>{t('comments')}</h3>
					<Comment.Group
						style={{
							maxHeight: '50vh',
							overflowY: 'auto',
							width: '100%',
							maxWidth: '100%',
							marginBottom: 20,
						}}
					>
						{comments.map((comment) => (
							<IssueComment comment={comment} key={comment.id} />
						))}
					</Comment.Group>
					<IssueCommentForm
						issueId={issue.id}
						onSubmit={(text) => {
							setComments([
								...comments,
								{
									id: generateRandomString(6),
									creator: authData.user,
									createdAt: new Date(),
									text,
									issue: issue.id,
								},
							]);
						}}
					/>
				</div>
				<div style={{ position: 'absolute', top: 0, right: 10, width: 270 }}>
					<Sticky context={ref}>
						<Button secondary onClick={() => openEditModal()} style={{ marginTop: 10 }} fluid>
							{t('edit_issue')}
						</Button>
						<h4>{t('assigned_by')}</h4>
						{issue.assigned ? (
							<a href={`/profile/${issue.assigned.id}`} target="_blank" rel="noopener noreferrer">
								{getUsername(issue.assigned)}
							</a>
						) : (
							t('no')
						)}
						<h4>{t('reported_by')}</h4>
						<a rel="noopener noreferrer" target="_blank" href={`/profile/${issue.creator.id}`}>
							{getUsername(issue.creator)}
						</a>
						<h4>{t('sprint')}</h4>
						Sprint will be here
						<h4>{t('links')}</h4>
						{(issue.links ?? []).map((l, i) => (
							<a rel="noopener noreferrer" target="_blank" href={l} key={i} style={{ marginRight: 10 }}>
								{l}
							</a>
						))}
						<h4>{t('attachments')}</h4>
						{(issue.attachments ?? []).map((a, i) => (
							<a rel="noopener noreferrer" target="_blank" href={a} key={i} style={{ marginRight: 10 }}>
								{a}
							</a>
						))}
						<h4>{t('labels')}</h4>
						{(issue.labels || []).map((label, index) => (
							<Label key={index}>{label}</Label>
						))}
						<h4>{t('type')}</h4>
						<Label color={issue.type.color as any}>
							<Icon name={issue.type.icon as any} />
							{issue.type.title}
						</Label>
						<h4>{t('priority')}</h4>
						<Label color={issue.priority.color as any}>
							<Icon name={issue.priority.icon as any} />
							{issue.priority.title}
						</Label>
					</Sticky>
				</div>
				<ContextProvider customInitalState={initalIssue}>
					<UpdateIssueModal
						onSubmit={() => window.location.reload()}
						current={issue}
						getOpenFunc={(open) => (openEditModal = open)}
					/>
				</ContextProvider>
			</div>
		</Ref>
	);
};

export default IssuePageContent;
