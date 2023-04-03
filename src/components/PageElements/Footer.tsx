import React from 'react';
import classes from './Footer.module.css';

const Footer: React.FC = () => {
	return (
		<footer className={`${classes['layout']} my-auto`}>
			<div className={classes['wrapper']}>
				<div className={classes['content']}>
					<ul className={classes['items']}>
						<li>
							<a className={classes['link']} href='#'>
								Terms &amp; Conditions
							</a>
						</li>
						<li>|</li>
						<li>
							<a className={classes['link']} href='#'>
								Privacy Policy
							</a>
						</li>
						<li>|</li>
						<li>
							<a className={classes['link']} href='#'>
								Site Map
							</a>
						</li>
					</ul>
					<div>
						Copyright © 2023 Garden Materials, Inc. All Rights
						Reserved.
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
