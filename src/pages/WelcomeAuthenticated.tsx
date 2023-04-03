import React, { useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { AuthContext } from '../shared/context/auth-context';

const WelcomePage = () => {
	const auth = useContext(AuthContext);
	const params = useParams();

	if (params.message) {
		return (
			<article className='page_default'>
				<p className='message'>{params.message}</p>{' '}
			</article>
		);
	}

	return (
		<article className='page_default'>
			{auth.isLoggedIn && (
				<>
					<p className='message'>
						Hello {auth.firstName} {auth.lastName}, You have been
						logged in.
					</p>
					<p>
						<strong>Welcome to our on-line store.</strong>
					</p>
				</>
			)}
			{!auth.isLoggedIn && (
				<p className='message'>
					You are no longer logged in. Please&nbsp;
					<NavLink to='/login'>login</NavLink> to continue.
				</p>
			)}
		</article>
	);
};

export default WelcomePage;
