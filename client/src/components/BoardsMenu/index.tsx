import React, { useEffect, useState } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import styles from 'styles/headerDropDown.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../typings/rootState';
import * as actions from '../../containers/Boards/logic/actions';
import { useTranslation } from 'react-i18next';
import CreateBoardModal from 'components/CreateBoardModal';
import * as actionTypes from 'containers/Boards/logic/actionTypes';

export const BoardsMenu = ({ onCreateBoard }: { onCreateBoard(board: actionTypes.createBoard): void }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const [createBoard, setCreateBoard] = useState(false);
	const { recentBoards, boards } = useSelector((rootState: RootState) => ({
		recentBoards: rootState.boards.recentBoards,
		boards: rootState.boards.boards,
	}));

	useEffect(() => {
		dispatch(actions.getRecentBoards());
	}, [dispatch, boards]);
	return (
		<>
			<Dropdown text={t('boards')} className={`${styles.media_query} link item`}>
				<Dropdown.Menu className={styles.dropDownMenu}>
					<Dropdown.Header>{t('recent')}</Dropdown.Header>
					{recentBoards.length
						? recentBoards.map((board) => (
								<Dropdown.Item key={board.id} as="a" href={`/board/${board.id}`}>
									{board.name}
								</Dropdown.Item>
						  ))
						: t('no')}
					<Dropdown.Divider />
					<Dropdown.Item as={Link} to="/boards" className="bold">
						{t('view_all_boards')}
					</Dropdown.Item>
					<Dropdown.Item onClick={() => setCreateBoard(true)} className="bold">
						{t('create_board')}
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
			{createBoard && <CreateBoardModal setIsModalShown={setCreateBoard} onCreateBoard={onCreateBoard} />}
		</>
	);
};

export default BoardsMenu;
