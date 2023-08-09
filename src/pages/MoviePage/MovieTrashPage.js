import { Helmet } from 'react-helmet-async';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Tooltip,
} from '@mui/material';
// Toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';

import { fDate } from '../../utils/formatTime';

import { movieApi } from '../../api';
import {
  NoData,
  ModalTable,
  NoSearchData,
  PopoverMenu,
  TableListHead,
  applySortFilter,
  getComparator,
  TableListToolbar,
} from '../../components/table';
// mock
// import MOVIELIST from '../../_mock/movie';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Tên phim', alignRight: false },
  { id: 'rating', label: 'Đánh giá', alignRight: false },
  { id: 'genre', label: 'Thể loại', alignRight: false },
  { id: 'releaseDate', label: 'Ngày phát hành', alignRight: false },
  { id: 'isSeries', label: 'Loại phim', alignRight: false },
  { id: 'type', label: 'Trả phí', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function MovieTrashPage() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [movieList, setMovieList] = useState([]);
  const [idRemove, setIdRemove] = useState('');

  useEffect(() => {
    const fetchGenreList = async () => {
      try {
        const response = await movieApi.getTrash();
        setMovieList(response);
      } catch (error) {
        console.log('Failed to fetch genre list: ', error);
      }
    };
    fetchGenreList();
  }, []);

  const handleRestore = async (e) => {
    const id = e.currentTarget.value;
    try {
      await toast.promise(movieApi.restore(id), {
        pending: 'Đang khôi phục phim...',
        success: 'Khôi phục phim thành công!',
        error: 'Khôi phục phim thất bại!',
      });
      setMovieList(movieList.filter((genre) => genre._id !== id));
    } catch (error) {
      console.log('Failed to restore genre: ', error);
    }
  };
  const handleForceDelete = async (e) => {
    const id = idRemove;
    setOpenModalDelete(false);

    try {
      await toast.promise(movieApi.forceDelete(id), {
        pending: 'Đang xoá phim...',
        success: 'Xoá phim thành công!',
        error: 'Xoá phim thất bại!',
      });
      setMovieList(movieList.filter((genre) => genre._id !== id));
    } catch (error) {
      console.log('Failed to delete genre: ', error);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = movieList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - movieList.length) : 0;

  const filteredList = applySortFilter(movieList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredList.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Danh Sách Phim Đã Xóa | BeeCine </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách phim đã xóa
          </Typography>
          <Link to="/dashboard/movie">
            <Button variant="contained" endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}>
              Quay lại
            </Button>
          </Link>
        </Stack>

        <Card>
          <TableListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeholder="Tìm kiếm phim..."
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={movieList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, thumbnailUrl, title, rating, genres, releaseDate, isSeries, type, status } = row;
                    const selectedList = selected.indexOf(title) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedList}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedList} onChange={(event) => handleClick(event, title)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <img style={{ height: 40, borderRadius: '4px' }} alt={title} src={thumbnailUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {title}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{rating}</TableCell>
                        <TableCell align="left">{genres.map((item) => `${item.name} `)}</TableCell>
                        <TableCell align="left">{fDate(releaseDate)}</TableCell>

                        <TableCell align="left">
                          <Label color={(isSeries && 'secondary') || 'warning'}>
                            {(isSeries && 'series') || 'movie'}
                          </Label>
                        </TableCell>

                        <TableCell align="left">
                          <Label color={(type === 'free' && 'secondary') || 'warning'}>{sentenceCase(type)}</Label>
                        </TableCell>

                        <TableCell align="left">
                          <Label color={(status && 'success') || 'error'}>{(status && 'active') || 'inactive'}</Label>
                        </TableCell>

                        <TableCell align="right">
                          <Stack direction="row" alignItems="center" justifyContent="flex-end">
                            <Tooltip title="Khôi phục" placement="top">
                              <IconButton onClick={handleRestore} size="large" color="default" value={_id}>
                                <Iconify icon={'eva:refresh-fill'} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xoá vĩnh viễn" placement="top">
                              <IconButton
                                onClick={(e) => {
                                  setOpenModalDelete(true);
                                  setIdRemove(e.currentTarget.value);
                                }}
                                color="error"
                                value={_id}
                              >
                                <Iconify icon={'eva:trash-2-fill'} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={10} />
                    </TableRow>
                  )}
                </TableBody>

                {movieList.length <= 0 && <NoData nameTable="phim" sx={{ py: 3 }} />}
                {isNotFound && <NoSearchData nameSearch={filterName} />}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={movieList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <ToastContainer />

      <ModalTable
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onConfirm={handleForceDelete}
        title="Xóa phim"
        content="Hành động này sẽ xóa vĩnh viễn phim này khỏi hệ thống. Bạn có chắc chắn muốn xóa?"
      />
    </>
  );
}
