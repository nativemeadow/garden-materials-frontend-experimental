import React, { useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/auth-hook';
import { AuthContext } from '../shared/context/auth-context';

import TopBar from '../components/PageElements/TopBar';
import HeaderNav from '../components/PageElements/HeaderNav';
import Footer from '../components/PageElements/Footer';
import Connect from '../components/PageElements/Connect';

type Props = {
	children?: React.ReactNode;
};

const RootLayout = ({ children }: Props) => {
	const auth = useContext(AuthContext);
	const navigate = useNavigate();
	useEffect(() => {
		console.log('in useEffect', auth);
		if (auth.isLoggedIn) {
			return;
		}
		console.log('navigating to /login');
		navigate('/login');
	}, [auth.isLoggedIn]);

	return (
		<div className='flex flex-col'>
			<TopBar />
			<HeaderNav />
			<div className='container min-h-screen'>
				<main>
					<Outlet />
				</main>
			</div>
			<Footer />
		</div>
	);
};

export default RootLayout;
