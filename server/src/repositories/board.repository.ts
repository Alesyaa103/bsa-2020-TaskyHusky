import { EntityRepository, getCustomRepository, Repository, getRepository } from 'typeorm';
import { BoardColumnRepository } from './boardColumn.repository';
import { Board } from '../entity/Board';
import { UserRepository } from './user.repository';
import { IBoardModel, IReducedBoard } from '../models/Board';
import { Projects } from '../entity/Projects';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
	findByType(boardType: string) {
		return this.findOneOrFail({ where: { boardType } });
	}

	getAll = async (id: string): Promise<IBoardModel[]> => {
		const extendedBoards = <IBoardModel[]>(
			(<unknown>(
				await this.createQueryBuilder('board')
					.leftJoin('board.createdBy', 'createdBy')
					.addSelect([
						'createdBy.id',
						'createdBy.firstName',
						'createdBy.lastName',
						'createdBy.avatar',
						'createdBy.color',
					])
					.leftJoinAndSelect('board.projects', 'projects')
					.leftJoin('projects.users', 'users')
					.where('users.id = :id', { id })
					.getMany()
			))
		);

		return extendedBoards;
	};

	getRecent = async (id: string): Promise<IReducedBoard[]> => {
		const boards = (
			await this.createQueryBuilder('board')
				.select(['board.id', 'board.name'])
				.orderBy('board.updatedAt', 'DESC')
				.leftJoinAndSelect('board.projects', 'projects')
				.leftJoin('projects.users', 'users')
				.where('users.id = :id', { id })
				.getMany()
		).slice(0, 5);

		return boards;
	};

	async getOne(id: string) {
		const board = <IBoardModel>(
			(<unknown>(
				await this.createQueryBuilder('board')
					.where('board.id = :id', { id })
					.innerJoin('board.createdBy', 'user')
					.leftJoinAndSelect('board.projects', 'projects')
					.addSelect(['user.id', 'user.firstName', 'user.lastName', 'user.avatar', 'user.color'])
					.getOne()
			))
		);

		if (!board) {
			throw new Error('Board with this ID does not exist');
		}

		return board;
	}

	async getProjects(id: string) {
		const board = await this.createQueryBuilder('board')
			.where('board.id = :id', { id })
			.leftJoinAndSelect('board.projects', 'project')
			.getOne();

		if (!board) {
			throw new Error('Board with this ID does not exist');
		}

		return board.projects;
	}

	async getSprints(id: string) {
		const boardExist = await this.findOne(id);

		if (!boardExist) {
			throw new Error('Board with this ID does not exist');
		}

		const boardWithSprints = await this.createQueryBuilder('board')
			.where('board.id = :id', { id })
			.innerJoin('board.sprints', 'sprint')
			.addSelect([
				'sprint.id',
				'sprint.sprintName',
				'sprint.isCompleted',
				'sprint.isActive',
				'sprint.startDate',
				'sprint.endDate',
			])
			.getOne();

		if (!boardWithSprints) {
			return [];
		}

		return boardWithSprints.sprints;
	}

	async put(id: string, data: any) {
		const userRepository = getCustomRepository(UserRepository);

		let board = <Board>(<unknown>await this.getOne(id));
		const { createdBy: user, projects, ...dataToCreate } = data;

		if (user) {
			const userToAdd = await userRepository.getById(user.id);
			if (!userToAdd) throw new Error('User with current ID not found');

			board = { ...board, createdBy: userToAdd };
		}

		if (projects) {
			const projectPromises: Array<Promise<Projects>> = projects.map(
				(projectId: string): Promise<Projects> => {
					return <Promise<Projects>>getRepository('Projects').findOne({
						where: {
							id: projectId,
						},
					});
				},
			);

			const projectsToAdd = await Promise.all(projectPromises);

			board = { ...board, projects: projectsToAdd };
		}

		board = { ...board, ...dataToCreate };

		return this.save([board]);
	}

	async post(data: any) {
		const userRepository = getCustomRepository(UserRepository);
		const { createdBy: user, projects, columns, ...dataToCreate } = data;

		const userToAdd = await userRepository.getById(user.id);
		if (!userToAdd) throw new Error('User with current ID not found');

		const projectPromises: Array<Promise<Projects>> = projects.map(
			(projectId: string): Promise<Projects> => {
				return <Promise<Projects>>getRepository('Projects').findOne({
					where: {
						id: projectId,
					},
				});
			},
		);

		const projectsToAdd = await Promise.all(projectPromises);

		let board = new Board();
		let columnsToAdd = [];

		if (columns && columns.length > 0) {
			columnsToAdd = await getCustomRepository(BoardColumnRepository).save(
				columns.map((column: any) => ({ ...column })),
			);
		}

		board = { ...board, ...dataToCreate, createdBy: userToAdd, projects: projectsToAdd, columns: columnsToAdd };
		return this.save([board]);
	}

	async deleteBoard(id: string) {
		const board: Board = <Board>(<unknown>await this.getOne(id));

		return this.remove([board]);
	}
}
