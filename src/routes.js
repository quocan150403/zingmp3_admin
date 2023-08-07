import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import { GenreAddPage, GenreListPage, GenreEditPage } from './pages/GenrePage';
import { AgeGroupAddPage, AgeGroupListPage, AgeGroupEditPage } from './pages/AgeGroupPage';
import { MovieAddPage, MovieListPage, MovieEditPage, MovieTrashPage } from './pages/MoviePage';
import { ArtistAddPage, ArtistListPage } from './pages/ArtistPage';
import { UserAddPage, UserListPage } from './pages/UserPage';
import { SubscriptionAddPage, SubscriptionListPage } from './pages/SubscriptionPage';
import { BillListPage, BillAddPage } from './pages/BillPage';
import { CountryListPage, CountryAddPage, CountryEditPage } from './pages/CountryPage';
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserListPage /> },
        { path: 'user/add', element: <UserAddPage /> },
        { path: 'genre', element: <GenreListPage /> },
        { path: 'movie', element: <MovieListPage /> },
        { path: 'genre/add', element: <GenreAddPage /> },
        { path: 'genre/edit/:id', element: <GenreEditPage /> },
        { path: 'movie/trash', element: <MovieTrashPage /> },
        { path: 'movie/add', element: <MovieAddPage /> },
        { path: 'movie/edit/:id', element: <MovieEditPage /> },
        { path: 'age-group', element: <AgeGroupListPage /> },
        { path: 'age-group/add', element: <AgeGroupAddPage /> },
        { path: 'age-group/edit/:id', element: <AgeGroupEditPage /> },
        { path: 'artist', element: <ArtistListPage /> },
        { path: 'artist/add', element: <ArtistAddPage /> },
        { path: 'subscription', element: <SubscriptionListPage /> },
        { path: 'subscription/add', element: <SubscriptionAddPage /> },
        { path: 'bill', element: <BillListPage /> },
        { path: 'bill/add', element: <BillAddPage /> },
        { path: 'country', element: <CountryListPage /> },
        { path: 'country/add', element: <CountryAddPage /> },
        { path: 'country/edit/:id', element: <CountryEditPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
