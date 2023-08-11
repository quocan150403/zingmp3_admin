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
import { GalleryAddPage, GalleryListPage, GalleryEditPage } from './pages/GalleryPage';
import { ArtistAddPage, ArtistListPage, ArtistEditPage } from './pages/ArtistPage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'gallery', element: <GalleryListPage /> },
        { path: 'gallery/add', element: <GalleryAddPage /> },
        { path: 'gallery/edit/:id', element: <GalleryEditPage /> },
        { path: 'genre', element: <GenreListPage /> },
        { path: 'genre/add', element: <GenreAddPage /> },
        { path: 'genre/edit/:id', element: <GenreEditPage /> },
        { path: 'artist', element: <ArtistListPage /> },
        { path: 'artist/add', element: <ArtistAddPage /> },
        { path: 'artist/edit/:id', element: <ArtistEditPage /> },
        // { path: 'user', element: <UserListPage /> },
        // { path: 'user/add', element: <UserAddPage /> },
        // { path: 'movie', element: <MovieListPage /> },
        // { path: 'movie/trash', element: <MovieTrashPage /> },
        // { path: 'movie/add', element: <MovieAddPage /> },
        // { path: 'movie/edit/:id', element: <MovieEditPage /> },
        // { path: 'age-group', element: <AgeGroupListPage /> },
        // { path: 'age-group/add', element: <AgeGroupAddPage /> },
        // { path: 'age-group/edit/:id', element: <AgeGroupEditPage /> },
        // { path: 'subscription', element: <SubscriptionListPage /> },
        // { path: 'subscription/add', element: <SubscriptionAddPage /> },
        // { path: 'bill', element: <BillListPage /> },
        // { path: 'bill/add', element: <BillAddPage /> },
        // { path: 'country', element: <CountryListPage /> },
        // { path: 'country/add', element: <CountryAddPage /> },
        // { path: 'country/edit/:id', element: <CountryEditPage /> },
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
