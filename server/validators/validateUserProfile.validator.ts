import { validate } from 'class-validator';
import { IVerifyOptions } from 'passport-local';
import { authErrorMessages, EMAIL, PASSWORD, FIRST_NAME, LAST_NAME } from '../src/constants/auth.constants';
import { UserProfile } from '../src/entity/UserProfile';
import { ErrorResponse } from '../src/helpers/errorHandler.helper';
import HttpStatusCode from '../src/constants/httpStattusCode.constants';

interface ValidateUserProfile {
	(data: Partial<UserProfile>, next: (error: any, user?: any, options?: IVerifyOptions | undefined) => void): Promise<
		boolean
	>;
}

// eslint-disable-next-line consistent-return
export const validateUserProfile: ValidateUserProfile = async (data, next) => {
	const userInstance = new UserProfile(data);

	const errorsArray = await validate(userInstance);
	const errors = errorsArray.length > 0;
	if (errors) {
		errorsArray.forEach((error) => {
			switch (error.property) {
				case EMAIL:
					return next(
						new ErrorResponse(HttpStatusCode.UNPROCESSABLE_ENTITY, authErrorMessages.INVALID_EMAIL),
						null,
					);
				case PASSWORD:
					return next(
						new ErrorResponse(HttpStatusCode.UNPROCESSABLE_ENTITY, authErrorMessages.INVALID_PASSWORD),
						null,
					);
				case FIRST_NAME:
					return next(
						new ErrorResponse(HttpStatusCode.UNPROCESSABLE_ENTITY, authErrorMessages.INVALID_FIRST_NAME),
						null,
					);
				case LAST_NAME:
					return next(
						new ErrorResponse(HttpStatusCode.UNPROCESSABLE_ENTITY, authErrorMessages.INVALID_LAST_NAME),
						null,
					);
				default:
					return next(
						new ErrorResponse(HttpStatusCode.UNPROCESSABLE_ENTITY, authErrorMessages.UPROCESSABLE_DATA),
						null,
					);
			}
		});
	}

	return !errors;
};
