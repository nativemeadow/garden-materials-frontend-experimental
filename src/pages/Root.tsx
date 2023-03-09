import React from 'react';
import { Outlet } from 'react-router-dom';

import { persist } from 'zustand/middleware';

import BeardCrumb from '../components/BeardCrumb';
import TopBar from '../components/PageElements/TopBar';
import HeaderNav from '../components/PageElements/HeaderNav';
import Footer from '../components/PageElements/Footer';
import Connect from '../components/PageElements/Connect';

type Props = {
	children?: React.ReactNode;
};

const RootLayout = ({ children }: Props) => {
	return (
		<>
			<TopBar />
			<HeaderNav />
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
