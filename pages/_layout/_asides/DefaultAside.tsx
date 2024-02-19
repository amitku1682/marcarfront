import React, { useContext } from 'react';
import Brand from '../../../layout/Brand/Brand';
import Navigation from '../../../layout/Navigation/Navigation';
import User from '../../../layout/User/User';
import {
	dashboardPagesMenu,
} from '../../../menu';
import ThemeContext from '../../../context/themeContext';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import withOutAsideRoutes from '../../../routes/asideRoutes';
import { pathToRoute } from '../../../helpers/helpers';
import Aside, { AsideBody, AsideFoot, AsideHead } from '../../../layout/Aside/Aside';

const DefaultAside = () => {
	const { asideStatus, setAsideStatus } = useContext(ThemeContext);

	const router = useRouter();

	if (withOutAsideRoutes.find((key) => key.path === pathToRoute(router.pathname))) return null;
	return (
		<Aside>
			<AsideHead>
				<Brand asideStatus={asideStatus} setAsideStatus={setAsideStatus} />
			</AsideHead>
			<AsideBody>
				<Navigation menu={dashboardPagesMenu} id='aside-dashboard' />
			</AsideBody>
			<AsideFoot>
				<nav aria-label='aside-bottom-menu'>
					<div className='navigation'>
						
					</div>
				</nav>
				<User />
			</AsideFoot>
		</Aside>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
});

export default DefaultAside;
