import React, { forwardRef, ReactElement, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ISubHeaderProps } from '../SubHeader/SubHeader';
import { IPageProps } from '../Page/Page';
import AuthContext from '../../context/authContext';
import Mounted from '../../components/Mounted';
import { useRouter } from "next/router";
interface IPageWrapperProps {
	isProtected?: boolean;
	children:
		| ReactElement<ISubHeaderProps>[]
		| ReactElement<IPageProps>
		| ReactElement<IPageProps>[];
	className?: string;
}
const PageWrapper = forwardRef<HTMLDivElement, IPageWrapperProps>(
	({ isProtected, className, children }, ref) => {
		const { user  } = useContext(AuthContext);
	const data  =useContext(AuthContext);// console.log("user"+user)
	const secret= data.userData.token;
		 const navigate = useRouter();
		useEffect(() => {
			if (isProtected && user === '') {
				//  navigate.push("auth/login");
			}
			return () => {};
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return (
			<div ref={ref} className={classNames('page-wrapper', 'container-fluid', className)}>
				<Mounted>{children}</Mounted>
			</div>
		);
	},
);
PageWrapper.displayName = 'PageWrapper';
PageWrapper.propTypes = {
	isProtected: PropTypes.bool,
	// @ts-ignore
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};
PageWrapper.defaultProps = {
	isProtected: true,
	className: undefined,
};

export default PageWrapper;
