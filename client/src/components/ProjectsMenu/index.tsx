import React from 'react';
import { Dropdown, Icon } from 'semantic-ui-react';
import styles from 'styles/headerDropDown.module.scss';
import { useTranslation } from 'react-i18next';

export const ProjectsMenu = () => {
	const { t } = useTranslation();

	return (
		<Dropdown text={t('projects')} className="link item">
			<Dropdown.Menu className={styles.dropDownMenu}>
				<Dropdown.Header>{t('recent')}</Dropdown.Header>
				<Dropdown.Item>
					<Icon name="folder open" />
					Project #1
				</Dropdown.Item>
				<Dropdown.Item>
					<Icon name="folder open" />
					Project #1
				</Dropdown.Item>
				<Dropdown.Divider />
				<Dropdown.Item>{t('view_all_projects')}</Dropdown.Item>
				<Dropdown.Item>{t('create_project')}</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default ProjectsMenu;