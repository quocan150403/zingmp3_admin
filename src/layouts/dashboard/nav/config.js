import MovieFilterTwoToneIcon from '@mui/icons-material/MovieFilterTwoTone';
import Diversity1TwoToneIcon from '@mui/icons-material/Diversity1TwoTone';
import WidgetsTwoToneIcon from '@mui/icons-material/WidgetsTwoTone';
import CommentTwoToneIcon from '@mui/icons-material/CommentTwoTone';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
import DesktopWindowsTwoToneIcon from '@mui/icons-material/DesktopWindowsTwoTone';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import LockPersonTwoToneIcon from '@mui/icons-material/LockPersonTwoTone';

// component
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';
// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Bảng điều khiển',
    path: '/dashboard/app',
    icon: <Iconify icon={'eva:home-outline'} width={24} height={24} />,
  },
  {
    title: 'Banner',
    path: '/dashboard/banner',
    icon: <Iconify icon={'eva:monitor-outline'} width={24} height={24} />,
  },
  {
    title: 'Thể loại',
    path: '/dashboard/genre',
    icon: <Iconify icon={'eva:grid-outline'} width={24} height={24} />,
  },
  {
    title: 'Phim',
    path: '/dashboard/movie',
    icon: <Iconify icon={'eva:film-outline'} width={24} height={24} />,
  },
  {
    title: 'Diễn viên và đạo diễn',
    path: '/dashboard/artist',
    icon: <Iconify icon={'eva:people-outline'} width={24} height={24} />,
  },
  {
    title: 'Gói đăng ký',
    path: '/dashboard/subscription',
    icon: <Iconify icon={'eva:credit-card-outline'} width={24} height={24} />,
  },
  {
    title: 'Hóa đơn',
    path: '/dashboard/bill',
    icon: <Iconify icon={'eva:file-text-outline'} width={24} height={24} />,
  },
  {
    title: 'Nhóm tuổi',
    path: '/dashboard/age-groups',
    icon: <Iconify icon={'eva:award-outline'} width={24} height={24} />,
  },
  {
    title: 'Bình luận',
    path: '/dashboard/comment',
    icon: <Iconify icon={'eva:message-square-outline'} width={24} height={24} />,
  },
  {
    title: 'user',
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
