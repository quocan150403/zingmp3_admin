import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import { GenreAddPage, GenreListPage, GenreEditPage } from './pages/GenrePage';
import { GalleryAddPage, GalleryListPage, GalleryEditPage } from './pages/GalleryPage';
import { ArtistAddPage, ArtistListPage, ArtistEditPage } from './pages/ArtistPage';
import { UserAddPage, UserListPage, UserEditPage } from './pages/UserPage';
import { SongAddPage, SongListPage, SongEditPage } from './pages/SongPage';
import { AlbumAddPage, AlbumListPage, AlbumEditPage } from './pages/AlbumPage';

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
        { path: 'user', element: <UserListPage /> },
        { path: 'user/add', element: <UserAddPage /> },
        { path: 'user/edit/:id', element: <UserEditPage /> },
        { path: 'song', element: <SongListPage /> },
        { path: 'song/add', element: <SongAddPage /> },
        { path: 'song/edit/:id', element: <SongEditPage /> },
        { path: 'Album', element: <AlbumListPage /> },
        { path: 'Album/add', element: <AlbumAddPage /> },
        { path: 'Album/edit/:id', element: <AlbumEditPage /> },
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
