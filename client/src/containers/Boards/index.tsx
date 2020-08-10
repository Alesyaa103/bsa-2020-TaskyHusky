import React, { useState, ChangeEvent, useEffect, SyntheticEvent } from 'react';
import { Button, Input, Table, Dropdown, DropdownProps, Menu } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'typings/rootState';
import * as actions from './logic/actions';

import CreateBoardModal from '../../components/CreateBoardModal';
import styles from './styles.module.scss';

const Boards: React.FC = () => {
	const boardTypes = ['Kanban', 'Scrum'];
	const [searchName, setSearchName] = useState('');
	const [selectedTypes, setSelectedType] = useState<WebApi.Board.BoardType[]>([]);
	const [isModalShown, setIsModalShown] = useState(false);
	const dispatch = useDispatch();
	const boards = useSelector((rootState: RootState) => rootState.boards.boards);

	useEffect(() => {
		dispatch(actions.startLoading());
	}, []);

	const onCreateBoard = () => {};

	const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
		const searchValue = event.target.value;
		setSearchName(searchValue);
	};

	const searchString = new RegExp(searchName, 'i');
	const filteredData = (boards || [])
		.filter(({ name }) => searchString.test(name))
		.filter((board) => {
			if (!selectedTypes.length) {
				return true;
			}
			return selectedTypes.indexOf(board.boardType) !== -1;
		});
	const selectOptions = boardTypes.map((type, index) => ({
		key: index,
		value: type,
		text: type,
	}));

	const handleSelectChange = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		setSelectedType([...(data.value as WebApi.Board.BoardType[])]);
	};

	const handleDelete = (id: string) => {
		dispatch(actions.deleteBoard({ id }));
	};
	return (
		<div className={styles.wrapper}>
			{isModalShown ? <CreateBoardModal setIsModalShown={setIsModalShown} onCreateProject={onCreateBoard} /> : ''}
			<div className={styles.wrapper__title}>
				<h1 className={styles.title}>Boards</h1>
				<Button primary onClick={() => setIsModalShown(true)}>
					Create board
				</Button>
			</div>
			<div className={[styles.wrapper__filters, styles.filters].join(' ')}>
				<Input icon="search" placeholder="Search..." onChange={onSearch} value={searchName} />
				<Dropdown
					placeholder="All boards"
					options={selectOptions}
					multiple
					selection
					value={selectedTypes}
					onChange={handleSelectChange}
				/>
			</div>
			<div className={styles.wrapper__table}>
				<Table celled fixed>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell width={5}>Name</Table.HeaderCell>
							<Table.HeaderCell width={5}>Type</Table.HeaderCell>
							<Table.HeaderCell width={5}>Admin</Table.HeaderCell>
							<Table.HeaderCell width={5}>Location</Table.HeaderCell>
							<Table.HeaderCell width={2} />
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{filteredData.map(({ location, name, id, boardType, createdBy: user }) => {
							return (
								<Table.Row key={id}>
									<Table.Cell>{name}</Table.Cell>
									<Table.Cell>{boardType}</Table.Cell>
									<Table.Cell>{`${user.firstName} ${user.lastName}`}</Table.Cell>
									<Table.Cell>{location}</Table.Cell>
									<Table.Cell>
										<Menu borderless compact secondary>
											<Dropdown
												item
												icon={
													<svg
														width="24"
														height="24"
														viewBox="0 0 24 24"
														focusable="false"
														role="presentation"
													>
														<g fill="currentColor" fillRule="evenodd">
															<circle cx="5" cy="12" r="2" />
															<circle cx="12" cy="12" r="2" />
															<circle cx="19" cy="12" r="2" />
														</g>
													</svg>
												}
												direction="left"
											>
												<Dropdown.Menu>
													<Dropdown.Item>Edit settings</Dropdown.Item>
													<Dropdown.Item>Copy</Dropdown.Item>
													<Dropdown.Item>Move</Dropdown.Item>
													<Dropdown.Item onClick={() => handleDelete(id)}>
														Delete
													</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										</Menu>
									</Table.Cell>
								</Table.Row>
							);
						})}
					</Table.Body>
				</Table>
			</div>
		</div>
	);
};

export default Boards;