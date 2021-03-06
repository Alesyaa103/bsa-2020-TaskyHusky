import React from 'react';
import { useTranslation } from 'react-i18next';
import { SprintHeader } from './SprintHeader';
import { SprintIssues } from './SprintIssues';
import Spinner from 'components/common/Spinner';

interface Props {
	sprint?: WebApi.Entities.Sprint;
	issues: WebApi.Entities.Issue[];
	boardId: string;
	todoColumnId?: string;
}

interface DragProps {
	listId: string;
	listType?: string;
	internalScroll?: boolean;
	isCombineEnabled?: boolean;
}

export const Sprint: React.FC<Props & DragProps> = (props: Props & DragProps) => {
	const { t } = useTranslation();

	if (props.sprint?.isCompleted) {
		return null;
	}

	if (!props.issues) {
		return <Spinner />;
	}

	return (
		<>
			<SprintHeader
				id={props.sprint?.id ?? 'backlog'}
				isActive={props.sprint?.isActive ?? false}
				todoColumnId={props.todoColumnId}
				name={props.sprint?.sprintName ?? t('backlog')}
				issues={props.issues}
				isCompleted={props.sprint?.isCompleted ?? false}
				startDate={props.sprint?.startDate}
				endDate={props.sprint?.endDate}
			/>

			<SprintIssues
				issues={props.issues}
				sprintId={props.sprint?.id ?? 'backlog'}
				boardId={props.boardId}
				sprintName={props.sprint?.sprintName ?? t('backlog')}
				isCompleted={props.sprint?.isCompleted}
				listId={props.listId}
				listType={props.listType}
			/>
		</>
	);
};

export default Sprint;
