import React, { useContext, useEffect } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPagesMenu } from '../../../menu';
import SubHeader, {
	SubHeaderLeft,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import { useTour } from '@reactour/tour';
import ThemeContext from '../../../context/themeContext';
import Page from '../../../layout/Page/Page';
import CommonDashboardAlert from '../../../common/partial/CommonDashboardAlert';
import ZonalAttendanceDetails from '../../../common/partial/ZonalAttendanceDetails';
import dayjs from 'dayjs';
import Stats from '@/components/dashboard/Stats';
import ZoneList from '@/common/partial/ZoneList';
import JoiningPositionList from '@/common/partial/JoinningList';

const JoiningLists: NextPage = () => {
	const { mobileDesign } = useContext(ThemeContext);
	/**
	 * Tour Start
	 */
	const { setIsOpen } = useTour();
	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			localStorage.getItem('tourModalStarted') !== 'shown' &&
			!mobileDesign
		) {
			setTimeout(() => {
				setIsOpen(true);
				localStorage.setItem('tourModalStarted', 'shown');
			}, 3000);
		}
		return () => { };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	return (
		<PageWrapper>
			{/* <Head>
				<title>{demoPagesMenu.sales.subMenu.dashboard.text}</title>
			</Head> */}
			<SubHeader>
				<SubHeaderLeft>
					<span className='h4 mb-0 fw-bold'>All JOINNING List</span>
					<SubheaderSeparator />
					<strong>Admin</strong> &nbsp;(&nbsp;{dayjs().format("DD MMM YYYY")}&nbsp;)
				</SubHeaderLeft>
			</SubHeader>
			<Page container='fluid'>
				<div className='row'>
					
	
					<div className='col-12'>
						<JoiningPositionList />
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
});

export default JoiningLists;
