namespace WebApi.Board {
	export enum BoardType {
		Scrum = 'Scrum',
		NextGen = 'Next-gen',
		Kanban = 'Kanban',
	}

	export interface IBoardModel {
		id: string;
		boardType: BoardType;
		name: string;
		location: string;
		createdBy: {
			id: string;
			firstName: string;
			lastName: string;
			avatar: string;
		};
	}
}

namespace WebApi.Issue {
	interface PartialIssue {
		id?: string;
		type?: string;
		summary?: string;
		boardColumnID?: string;
		labels?: string[];
		attachments?: string[];
		links?: string[];
		priority?: string;
		description?: string;
		sprintID?: string;
		projectID?: string;
		issueKey?: string;
		assignedID?: string;
		creatorID?: string;
	}
}

namespace WebApi.Result {
	interface UserAuthResult {
		user: {
			id: string;
			email: string;
		};
		jwtToken: string;
	}
}

namespace WebApi.User {
	export interface UserModel {
		id?: string;
		email: string;
		password?: string;
		firstName?: string;
		lastName?: string;
		avatar?: string;
		department?: string;
		timezone?: string;
		organization?: string;
		jobTitle?: string;
		userSettingsId?: string;
	}
}

namespace WebApi.Entities {
	interface Board {
		id: string;
		boardType: BoardType;
		columns?: BoardColumn[];
		createdBy: User;
	}

	interface BoardColumn {
		id: string;
		columnName?: string;
		status?: string;
		isResolutionSet?: boolean;
		board: Board;
	}

	interface Filter {
		id: string;
		ownerId?: string;
		name?: string;
	}

	interface FilterDefinition {
		id: string;
		filterType?: string;
		dataType?: string;
		title?: string;
	}

	interface FilterPart {
		id: string;
		filter?: Filter;
		filterDef?: FilterDefinition;
		// members?: User[];
		searchText?: string;
	}

	interface Issue {
		id: string;
		type?: IssueType;
		summary?: string;
		boardColumnID?: string;
		labels?: string;
		attachments?: string;
		links?: string;
		priority?: Priority;
		description?: string;
		sprintID?: string;
		projectID?: string;
		issueKey?: string;
		assignedID?: string;
		creatorID?: string;
	}

	interface IssueType {
		id: string;
		icon?: string;
		color?: string;
		title?: string;
		issues?: Issue[];
	}

	interface Priority {
		id: string;
		icon?: string;
		color?: string;
		title?: string;
		issues?: Issue[];
	}

	interface Projects {
		projectID: string;
		name: string;
		key: string;
		projectType: string;
		category: string;
		defaultAssigneeID?: string;
		leadID?: string;
		creatorID?: string;
	}

	interface User {
		id: string;
		firstName?: string;
		lastName?: string;
		avatar?: string;
		department?: string;
		timezone?: string;
		organization?: string;
		email?: string;
		jobTitle?: string;
		userSettingsId?: string;
		password?: string;
		boards?: Board[];
	}
}
