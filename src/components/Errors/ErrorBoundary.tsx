import React from 'react';

interface Props {
	children: React.ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			error: undefined,
		};
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		// Log the error to an error reporting service
		console.error(error, info);
	}

	render() {
		const { hasError, error } = this.state;
		const { children } = this.props;

		if (hasError) {
			// You can customize the error message shown to the user here
			return <div>Something went wrong: {error?.message}</div>;
		}

		return children;
	}
}

export default ErrorBoundary;
