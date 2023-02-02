import React from 'react';
import { Outlet } from 'react-router-dom';

type Props = {
	children?: React.ReactNode;
};

const RootLayout = ({ children }: Props) => {
	return (
		<>
			<main>
				<Outlet />
			</main>
		</>
	);
};
``;

export default RootLayout;
