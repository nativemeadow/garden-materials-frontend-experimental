import React from 'react';
import { Outlet } from 'react-router-dom';
import BeardCrumb from '../components/BeardCrumb';

type Props = {
	children?: React.ReactNode;
};

const RootLayout = ({ children }: Props) => {
	return (
		<>
			<div className='container'>
				<main>
					<Outlet />
				</main>
			</div>
		</>
	);
};
``;

export default RootLayout;
