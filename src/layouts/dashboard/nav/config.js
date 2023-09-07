// component
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';
// ----------------------------------------------------------------------

// const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Bảng điều khiển',
    path: '/dashboard/app',
    icon: <Iconify icon={'eva:home-outline'} width={24} height={24} />,
  },
  {
    title: 'Banner',
    path: '/dashboard/gallery',
    icon: <Iconify icon={'eva:monitor-outline'} width={24} height={24} />,
  },
  {
    title: 'Thể loại',
    path: '/dashboard/genre',
    icon: <Iconify icon={'eva:grid-outline'} width={24} height={24} />,
  },
  {
    title: 'Album',
    path: '/dashboard/album',
    icon: <Iconify icon={'eva:browser-outline'} width={24} height={24} />,
  },
  {
    title: 'Bài hát',
    path: '/dashboard/song',
    icon: <Iconify icon={'eva:music-outline'} width={24} height={24} />,
  },
  {
    title: 'Nghệ sĩ',
    path: '/dashboard/artist',
    icon: <Iconify icon={'eva:people-outline'} width={24} height={24} />,
  },
  {
    title: 'Nguời dùng',
    path: '/dashboard/user',
    icon: <Iconify icon={'eva:person-outline'} width={24} height={24} />,
  },
  // {
  //   title: 'Bảng điều khiển',
  //   path: '/dashboard/app',
  //   icon: icon('ic_analytics'),
  // },
  // {
  //   title: 'user',
  //   path: '/dashboard/user',
  //   icon: icon('ic_user'),
  // },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
