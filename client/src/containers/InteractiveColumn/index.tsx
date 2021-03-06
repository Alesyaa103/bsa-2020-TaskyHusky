import React, { useState } from 'react';
import { Segment, Icon } from 'semantic-ui-react';
import { Draggable } from 'react-beautiful-dnd';
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';
import EditForm from './EditForm';
import { deleteColumn } from 'containers/BoardColumn/logic/actions';
import { useDispatch } from 'react-redux';
import ConfirmModal from 'components/common/ConfirmModal';
import { ContextProvider } from 'containers/CreateColumnModal/logic/context';

interface Props {
	column: WebApi.Result.BoardColumnResult;
	index: number;
	setColumns: (value: WebApi.Result.BoardColumnResult[]) => void;
	columns: WebApi.Result.BoardColumnResult[];
}

const InteractiveColumn: React.FC<Props> = ({ column, index, setColumns, columns }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [isConfirmOpened, setIsConfirmOpened] = useState<boolean>(false);

	const confirmRemove = () => {
		setIsConfirmOpened(true);
	};

	const remove = () => {
		setIsConfirmOpened(false);
		dispatch(deleteColumn({ id: column.id }));

		const newColumns = [...columns];
		newColumns.splice(index, 1);
		newColumns.slice(index).forEach((__, index) => --newColumns[index].index);
		setColumns(newColumns);
	};

	const update = (data: Partial<WebApi.Board.CreateBoardColumn>) => {
		const newColumns = [...columns];
		newColumns[index] = { ...column, ...data, board: column.board };
		setColumns(newColumns);
	};

	return (
		<Draggable draggableId={column.id} key={column.id} index={index}>
			{(provided, snapshot) => (
				<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
					<Segment className={styles.column}>
						<div className={styles.columnHeader}>
							<h3 className={styles.uppercase}>{column.columnName}</h3>
							<div className={styles.columnControls}>
								<ConfirmModal
									isOpened={isConfirmOpened}
									setIsOpened={setIsConfirmOpened}
									confirmAction={remove}
									header={t('are_you_sure')}
									content={t('are_you_sure_delete_column')}
								/>
								<Icon
									link
									title={t('delete')}
									onClick={confirmRemove}
									name="trash alternate outline"
									className={styles.redOnHover}
								/>
							</div>
						</div>
						<ContextProvider initialState={column}>
							<EditForm columnId={column.id} initialState={column} onSubmit={update} />
						</ContextProvider>
					</Segment>
				</div>
			)}
		</Draggable>
	);
};

export default InteractiveColumn;
