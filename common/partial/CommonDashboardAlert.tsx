import React from 'react';
import Alert, { AlertHeading } from '../../components/bootstrap/Alert';
import dayjs from 'dayjs';

const CommonDashboardAlert = () => {
	return (
		<Alert
			icon='Cake'
			isLight
			color='primary'
			borderWidth={0}
			className='shadow-3d-primary'
			isDismissible
		>
			<AlertHeading tag='h2' className='h4'>
				Congratulations! 🎉
			</AlertHeading>
			<span>83 birthdays in {dayjs().format("MMMM YYYY")}</span>
		</Alert>
	);
};

export default CommonDashboardAlert;
