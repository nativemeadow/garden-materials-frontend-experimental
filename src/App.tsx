import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

import RootLayout from './pages/Root';
import Authentication, {
	loginAction,
	createUserAction,
	updateAccountAction,
} from './pages/Authentication';

import WelcomePage from './pages/WelcomeAuthenticated';
import HomePage, { loader as categoriesLoader } from './pages/Home';
import CategoryPage, { loader as categoryDetailLoader } from './pages/Category';
import SearchPage, { loader as searchResultsLoader } from './pages/Search';
import ShoppingCart from './components/ShoppingCart';
import ProductDetailPage, {
	loader as productDetailLoader,
} from './pages/ProductDetail';
import ErrorPAge from './pages/Error';

// Create a client
const queryClient = new QueryClient();

function App() {
	const {
		userId,
		username,
		email,
		firstName,
		lastName,
		phone,
		token,
		login,
		logout,
		updateUserSession,
	} = useAuth();

	const userAuth = {
		isLoggedIn: !!token,
		token,
		userId,
		username,
		email,
		firstName,
		lastName,
		phone,
		login,
		logout,
		updateUserSession,
	};

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
				{
					path: 'shopping-cart/',
					loader: productDetailLoader(queryClient),
					element: <ShoppingCart />,
				},
				{
					path: 'search/:searchTerm',
					loader: searchResultsLoader(queryClient),
					element: <SearchPage />,
				},
				{
					path: '/login',
					element: <Authentication />,
					action: loginAction(userAuth, queryClient),
				},
				{
					path: '/login/:login/:message',
					element: <Authentication />,
					action: loginAction(userAuth, queryClient),
				},
				{
					path: '/create-account',
					element: <Authentication />,
					action: createUserAction,
				},
				{
					path: '/update-account',
					element: <Authentication />,
					// loader: updateUserSession,
					action: updateAccountAction,
				},
				{
					path: '/welcome',
					element: <WelcomePage />,
				},
			],
		},
	]);

	return (
		<QueryClientProvider client={queryClient}>
			<AuthContext.Provider value={userAuth}>
				<RouterProvider router={router} />
			</AuthContext.Provider>
			<ReactQueryDevtools position='bottom-right' />
		</QueryClientProvider>
	);
}

export default App;
