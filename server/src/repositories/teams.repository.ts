import { EntityRepository, Repository, getCustomRepository } from 'typeorm';
import { Team } from '../entity/Team';
import { getRandomColor } from '../services/colorGenerator.service';
import { UserRepository } from './user.repository';

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {
	findAll() {
		return this.createQueryBuilder('teamRepository')
			.innerJoin('teamRepository.createdBy', 'user')
			.addSelect(['user.id', 'user.firstName', 'user.lastName', 'user.email', 'user.avatar', 'user.jobTitle'])
			.getMany();
	}

	async findTeamById(id: string) {
		const team = await this.createQueryBuilder('Team')
			.select(['Team.id', 'Team.name', 'Team.color', 'Team.description', 'Team.links'])
			.where('Team.id = :id', { id })
			.getOne();

		return team;
	}

	async findTeamUsersById(id: string) {
		const team = await this.createQueryBuilder('Team')
			.leftJoinAndSelect('Team.createdBy', 'User')
			.leftJoinAndSelect('Team.users', 'Users')
			.select([
				'Team.id',
				'User.id',
				'User.firstName',
				'User.lastName',
				'User.email',
				'User.jobTitle',
				'User.location',
				'User.avatar',
				'User.department',
				'Users.id',
				'Users.firstName',
				'Users.lastName',
				'Users.email',
				'Users.jobTitle',
				'Users.location',
				'Users.avatar',
				'Users.department',
			])
			.where('Team.id = :id', { id })
			.getOne();

		return team;
	}

	async findTeamProjectsById(id: string) {
		const team = await this.createQueryBuilder('Team')
			.leftJoinAndSelect('Team.projects', 'Projects')
			.select(['Team.id', 'Projects.id', 'Projects.name', 'Projects.category', 'Projects.key'])
			.where('Team.id = :id', { id })
			.getOne();

		return team;
	}

	findByName(name: string) {
		return this.findOne({ where: { name } });
	}

	async createOne(data: Team) {
		const userRepository = getCustomRepository(UserRepository);

		const { color = getRandomColor(), links = [], createdBy: user, ...restData } = data;

		const userToAdd = await userRepository.getById(user.id);
		if (!userToAdd) throw new Error('User with current ID not found');

		return this.save({ ...restData, createdBy: userToAdd, color, links });
	}

	async updateOneById(id: string, data: Team | { [key: string]: string[] }) {
		await this.update(id, data);
		return this.findTeamById(id);
	}

	deleteOneById(id: string) {
		return this.delete(id);
	}
}
