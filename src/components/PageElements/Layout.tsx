import React from 'react';
import { Outlet } from 'react-router-dom';

import TopBar from '../../components/PageElements/TopBar';
import HeaderNav from '../../components/PageElements/HeaderNav';
import Footer from '../../components/PageElements/Footer';
import Connect from '../../components/PageElements/Connect';

const Layout = (props: {}) => {
	return (
		<>
			<TopBar />
			<HeaderNav />
			<main className='container'>
				<Outlet />
			</main>
			<Connect />
			<Footer />
		</>
	);
};

export default Layout;
