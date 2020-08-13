import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { requestUpdateAvatar } from 'containers/ProfilePage/logiс/actions';
import { useTranslation } from 'react-i18next';
import { Header, Button, Icon } from 'semantic-ui-react';
import styles from './styles.module.scss';

interface Props {
	firstName: string;
	lastName: string;
	username: string;
	avatar: string;
	editMode: string;
	isCurrentUser: boolean;
	showManager: (modeToShow: string) => void;
}

const ProfilePicture: React.FC<Props> = (props: Props) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { firstName, lastName, username, avatar, editMode, isCurrentUser, showManager } = props;
	const [uploadUrl, setUploadUrl] = useState<ArrayBuffer | string | null>('');
	const [formData, setFormData] = useState<File | null>(null);
	const uploadPhoto = async (e: any) => {
		const reader = new FileReader();
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0]);
			reader.onloadend = () => {
				const { result } = reader;
				setUploadUrl(result);
			};
		}
		setFormData(e.target.files[0]);
	};

	const getInitials = () => firstName[0] + lastName[0];

	if (formData) {
		dispatch(requestUpdateAvatar({ image: formData }));
		setFormData(null);
	}

	return (
		<>
			<div className={styles.container}>
				<div className={styles.mainInfo}>
					<div className={styles.mainInfo__avatarContainer}>
						<div className={styles.mainInfo__borderHelper}>
							{uploadUrl ? (
								<img src={uploadUrl as string} className={styles.mainInfo__avatar} alt="Avatar" />
							) : avatar ? (
								<img src={avatar} className={styles.mainInfo__avatar} alt="Avatar" />
							) : (
								<h1 className={styles.mainInfo__initials}>{getInitials()}</h1>
							)}
							<Icon name="photo" size="big" className={styles.mainInfo__editBtn} />
							<input
								accept="image/*"
								id="contained-button-file"
								multiple
								type="file"
								onChange={uploadPhoto}
								className={styles.hidden}
							/>
						</div>
					</div>
					<Header as="h2" className={styles.mainInfo__fullName}>
						{firstName} {lastName}
					</Header>
					{username && <p className={styles.mainInfo__username}>{username}</p>}
				</div>
				{isCurrentUser && showManager && (
					<Button
						className={styles.managerButton}
						onClick={() => showManager('profile')}
						disabled={!editMode ? false : true}
					>
						{t('manage_account')}
					</Button>
				)}
			</div>
		</>
	);
};

export default ProfilePicture;
