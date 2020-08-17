import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { validateProject } from '../../validators/validateProjects.validator';
import { projectsErrorMessages } from '../constants/projects.constants';
import { UserProfile } from '../entity/UserProfile';
import { Projects } from '../entity/Projects';
import { ProjectsRepository } from '../repositories/projects.repository';
import { ErrorResponse } from '../helpers/errorHandler.helper';
import HttpStatusCode from '../constants/httpStattusCode.constants';

class ProjectsController {
	getAllProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const projectsRepository = getCustomRepository(ProjectsRepository);
		const { id: userId } = req.user;

		try {
			const allProjects = await projectsRepository.findAllProjectsWithCreatorsId(userId);
			res.send(allProjects);
		} catch (err) {
			next(new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, err.message));
		}
	};

	getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const projectsRepository = getCustomRepository(ProjectsRepository);

		try {
			const { id } = req.params;
			const project = await projectsRepository.getOne(id);
			res.send(project);
		} catch (err) {
			next(new ErrorResponse(HttpStatusCode.NOT_FOUND, projectsErrorMessages.PROJECT_NOT_FOUND));
		}
	};

	createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const projectsRepository = getCustomRepository(ProjectsRepository);

		try {
			const projectData = req.body.project as Projects;

			const { id: creatorId } = req.user;
			const user = new UserProfile();

			user.id = creatorId;

			const project = {
				...new Projects(),
				...projectData,
				creator: user,
				lead: user,
				users: [user],
			};

			const validationErrors = await validateProject(project);
			console.log('validationErrors', validationErrors);

			if (validationErrors.length > 0) {
				next(new ErrorResponse(HttpStatusCode.UNPROCESSABLE_ENTITY, projectsErrorMessages.INVALID_DATA));
				return;
			}

			const { key } = project;
			const isKeyExists = await projectsRepository.getOneByKey(key);

			if (isKeyExists) {
				next(new ErrorResponse(HttpStatusCode.UNPROCESSABLE_ENTITY, projectsErrorMessages.PROJECT_EXISTS));
				return;
			}

			const createdProject = await projectsRepository.createOne(project);
			res.status(201).send(createdProject);
		} catch (err) {
			next(new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, err.message));
		}
	};

	updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const projectsRepository = getCustomRepository(ProjectsRepository);

		try {
			const { project } = req.body;
			const { id: projectId } = project;
			const prevProject = await projectsRepository.getOneByIdWithLead(projectId);
			const projectToUpdate = { ...prevProject, ...project };
			const validationErrors = await validateProject(projectToUpdate);
			console.log('validationErrors', validationErrors);
			if (validationErrors.length > 0) {
				next(new ErrorResponse(HttpStatusCode.UNPROCESSABLE_ENTITY, projectsErrorMessages.INVALID_DATA));
				return;
			}

			if (!prevProject) {
				next(new ErrorResponse(HttpStatusCode.NOT_FOUND, projectsErrorMessages.PROJECT_NOT_FOUND));
				return;
			}

			const { id: userId } = req.user;
			const { id: prevProjectLeadId } = prevProject.lead;

			const isForbiddenResult = this.isForbidden(userId, prevProjectLeadId, next);

			if (isForbiddenResult) {
				return;
			}

			const updatedProject = await projectsRepository.updateOne(projectToUpdate);
			res.send(updatedProject);
		} catch (err) {
			next(new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, err.message));
		}
	};

	deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const projectsRepository = getCustomRepository(ProjectsRepository);

		try {
			const { id } = req.body;
			const project = await projectsRepository.getOneByIdWithLead(id);

			if (!project) {
				next(new ErrorResponse(HttpStatusCode.NOT_FOUND, projectsErrorMessages.PROJECT_NOT_FOUND));
				return;
			}

			const { id: userId } = req.user;
			const { id: projectLeadId } = project.lead;

			const isForbiddenResult = this.isForbidden(userId, projectLeadId, next);

			if (isForbiddenResult) {
				return;
			}

			const deletedProject = await projectsRepository.deleteOneById(id);
			res.send(deletedProject);
		} catch (err) {
			next(new ErrorResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, err.message));
		}
	};

	protected isForbidden = (userId: string, leadId: string, next: NextFunction): boolean => {
		let result = false;
		if (userId !== leadId) {
			next(new ErrorResponse(HttpStatusCode.FORBIDDEN, projectsErrorMessages.FORBIDDEN));
			result = true;
		}
		return result;
	};
}

export default ProjectsController;
