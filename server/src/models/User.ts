export interface UserModel {
	id?: string;
	email: string;
	password?: string;
	fullName?: string;
	username?: string;
	avatar?: string;
	location?: string;
	department?: string;
	organization?: string;
	jobTitle?: string;
	userSettingsId?: string;
	filtres?: string[];
}
