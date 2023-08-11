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
  TableListToolbarNew,
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

export default function MovieListPage() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [movieList, setMovieList] = useState([]);
  const [idRow, setIdRow] = useState('');

  useEffect(() => {
    const fetchGenreList = async () => {
      try {
        const response = await movieApi.getAll();
        setMovieList(response);
        console.log('Fetch genre list successfully: ', response);
      } catch (error) {
        console.log('Failed to fetch genre list: ', error);
      }
    };
    fetchGenreList();
  }, []);

  const handleEditRow = () => {
    navigate(`/dashboard/movie/edit/${idRow}`);
  };

  const handleDeleteRow = async () => {
    setOpenModalDelete(false);
    setOpen(null);

    try {
      await toast.promise(movieApi.delete(idRow), {
        pending: 'Đang xóa phim...',
        success: 'Xóa phim thành công!',
        error: 'Xóa phim thất bại!',
      });
      setMovieList(movieList.filter((genre) => genre._id !== idRow));
      console.log('Delete genre successfully: ', idRow);
    } catch (error) {
      console.log('Failed to delete genre: ', error);
    }
  };

  const handleDeleteAllRows = async () => {};

  // Default: sort by name, ascending
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
    setIdRow(event.currentTarget.value);
  };

  const handleCloseMenu = () => {
    setOpen(null);
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
        <title> Danh Sách Phim | ZingMp3 </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách phim
          </Typography>
          <Link to="/dashboard/movie/add">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Thêm phim mới
            </Button>
          </Link>
        </Stack>

        <Card>
          <TableListToolbarNew
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
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu} value={_id}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
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
      <PopoverMenu
        open={open}
        onClosePopover={() => setOpen(null)}
        onClickBtnDelete={() => setOpenModalDelete(true)}
        onClickBtnEdit={handleEditRow}
      />

      <ModalTable
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onConfirm={handleDeleteRow}
        title="Xóa phim"
        content="Bạn có chắc chắn muốn xóa phim này?"
      />
    </>
  );
}
