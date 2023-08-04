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
import { ToastContainer, toast } from 'react-toastify';

// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import {
  TableListHead,
  TableListToolbar,
  NoData,
  NoSearchData,
  PopoverMenu,
  ModalTable,
  applySortFilter,
  getComparator,
} from '../../components/table';
import { ageGroupApi } from '../../api';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Tên nhóm tuổi', alignRight: false, width: 200 },
  { id: 'description', label: 'Mô tả', alignRight: false },
  { id: 'minimum', label: 'Tuổi tối thiểu', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------
export default function AgeGroupListPage() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [ageGroupList, setAgeGroupList] = useState([]);
  const [idRow, setIdRow] = useState('');

  useEffect(() => {
    const fetchAgeGroupList = async () => {
      try {
        const response = await ageGroupApi.getAll();
        setAgeGroupList(response);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAgeGroupList();
  }, []);

  const handleEditRow = () => {
    navigate(`/dashboard/age-group/edit/${idRow}`);
  };

  const handleDeleteRow = async () => {
    setOpenModalDelete(false);
    setOpen(null);

    try {
      await toast.promise(ageGroupApi.delete(idRow), {
        pending: 'Đang xóa nhóm tuổi...',
        success: 'Xóa nhóm tuổi thành công!',
        error: 'Xóa nhóm tuổi thất bại!',
      });
      setAgeGroupList(ageGroupList.filter((genre) => genre._id !== idRow));
    } catch (error) {
      console.log('Failed to delete genre: ', error);
    }
  };

  const handleDeleteAllRows = async () => {};

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
    setIdRow(event.currentTarget.value);
  };

  // Define function to handle sort
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = ageGroupList.map((n) => n.name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - ageGroupList.length) : 0;

  const filteredList = applySortFilter(ageGroupList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredList.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Danh Sách Nhóm Tuổi | Beecine </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách nhóm tuổi
          </Typography>
          <Link to="/dashboard/age-group/add">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Thêm nhóm tuổi
            </Button>
          </Link>
        </Stack>

        <Card>
          <TableListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeholder="Tìm kiếm nhóm tuổi..."
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={ageGroupList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, name, description, minimum, status } = row;
                    const selectedList = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedList}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedList} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{description}</TableCell>
                        <TableCell align="left">{minimum}</TableCell>

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
                      <TableCell colSpan={4} />
                    </TableRow>
                  )}
                </TableBody>

                {ageGroupList.length <= 0 && <NoData nameTable="nhóm tuổi" />}
                {isNotFound && <NoSearchData nameSearch={filterName} />}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={ageGroupList.length}
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
        title="Xoá nhóm tuổi"
        content="Bạn có chắc chắn muốn xoá nhóm tuổi này?"
      />
    </>
  );
}
