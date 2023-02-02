import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import RootLayout from './pages/Root';
import HomePage, { loader as categoriesLoader } from './pages/Home';
import CategoryPage from './pages/Category';
import DetailPage from './pages/Detail';
import ProductsPage from './pages/Products';
import ErrorPAge from './pages/Error';

import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
	const [count, setCount] = useState(0);

	const router = createBrowserRouter([
		{
			path: '/',
			element: <RootLayout />,
			errorElement: <ErrorPAge />,
			children: [
				{
					index: true,
					element: <HomePage />,
					loader: categoriesLoader(queryClient),
				},
				{
					path: 'category/:categoryId',
					element: <CategoryPage />,
					// children: [
					// 	{
					// 		path: 'product/:productId',
					// 		element: <ProductsPage />,
					// 	},
					// ],
				},
			],
		},
	]);

	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<ReactQueryDevtools position='bottom-right' />
		</QueryClientProvider>
	);
}

export default App;
