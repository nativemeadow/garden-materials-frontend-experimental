import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import RootLayout from './pages/Root';
import HomePage, { loader as categoriesLoader } from './pages/Home';
import CategoryPage, { loader as categoryDetailLoader } from './pages/Category';
import ProductDetailPage, {
	loader as productDetailLoader,
} from './pages/ProductDetail';
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
					path: 'category/:urlKey',
					loader: categoryDetailLoader(queryClient),
					element: <CategoryPage />,
				},
				{
					path: 'category/:categoryUrlKey/product/:urlKey',
					loader: productDetailLoader(queryClient),
					element: <ProductDetailPage />,
				},
				{
					path: 'category/:categoryUrlKey/product/:urlKey/sku/:sku',
					loader: productDetailLoader(queryClient),
					element: <ProductDetailPage />,
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
