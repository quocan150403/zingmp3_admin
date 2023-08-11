import { Helmet } from 'react-helmet-async';
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
  Avatar,
  Tooltip,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
// Hooks
import useTableManagement from '../../hooks/useTableManagement';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { TableListHead, TableListToolbar, ModalTable, NoData, NoSearchData, PopoverMenu } from '../../components/table';

import { artistApi } from '../../api';
import { renderArray } from '../../utils/formatOther';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'stageName', label: 'Tên', alignRight: false },
  { id: 'genres', label: 'Thể loại', alignRight: false },
  { id: 'followers', label: 'Số lượng người theo dõi', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: false },
  { id: '' },
];

const TABS = [
  { label: 'All', value: 1, number: 0, color: 'default', iconPosition: 'end' },
  { label: 'Active', value: 2, number: 0, color: 'success', iconPosition: 'end' },
  { label: 'Inactive', value: 3, number: 0, color: 'warning', iconPosition: 'end' },
  { label: 'Thùng rác', value: 4, number: 0, color: 'error', iconPosition: 'end' },
];

// ----------------------------------------------------------------------

export default function ArtistListPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(1);
  const [tabs, setTabs] = useState(TABS);
  const [originalData, setOriginalData] = useState([]);
  const [artistList, setArtistList] = useState([]);

  const [idRow, setIdRow] = useState('');
  const [open, setOpen] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalDeleteMany, setOpenModalDeleteMany] = useState(false);
  const [openModalForceDelete, setOpenModalForceDelete] = useState(false);

  const {
    page,
    order,
    orderBy,
    selected,
    filterName,
    rowsPerPage,
    setSelected,
    handleRequestSort,
    handleSelectAllClick,
    handleClick,
    handleChangePage,
    handleChangeRowsPerPage,
    handleFilterByName,
    applySortFilter,
    getComparator,
  } = useTableManagement(artistList);

  // Call Api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await artistApi.getAll();
        const items = response.filter((item) => !item.deleted);

        setOriginalData(response);
        setArtistList(items);
        updateTabNumbers(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Reset Api
  const resetData = async () => {
    try {
      const response = await artistApi.getAll();
      setOriginalData(response);
      updateTabNumbers(response);
    } catch (error) {
      console.log(error);
    }
  };

  // Update tab numbers
  const updateTabNumbers = (data) => {
    const items = data.filter((item) => !item.deleted);
    const activeItems = data.filter((item) => item.status && !item.deleted);
    const inactiveItems = data.filter((item) => !item.status && !item.deleted);
    const trashItems = data.filter((item) => item.deleted);

    setTabs((prevTabs) => [
      { ...prevTabs[0], number: items.length },
      { ...prevTabs[1], number: activeItems.length },
      { ...prevTabs[2], number: inactiveItems.length },
      { ...prevTabs[3], number: trashItems.length },
    ]);
  };

  // Change tab
  const handleChangeStatus = (event, newValue) => {
    setTab(newValue);
    handleFilterStatus(newValue);
  };

  // Change value by tab
  const handleFilterStatus = (newStatus) => {
    if (newStatus === 1) {
      setArtistList(originalData.filter((item) => !item.deleted));
    } else if (newStatus === 2) {
      setArtistList(originalData.filter((item) => item.status && !item.deleted));
    } else if (newStatus === 3) {
      setArtistList(originalData.filter((item) => !item.status && !item.deleted));
    } else if (newStatus === 4) {
      setArtistList(originalData.filter((item) => item.deleted));
    }
  };

  // Handle navigate edit page
  const handleEditRow = () => {
    navigate(`/dashboard/artist/edit/${idRow}`);
  };

  // Handle delete
  const handleDeleteRow = async () => {
    setOpenModalDelete(false);
    setOpen(null);

    try {
      await toast.promise(artistApi.delete(idRow), {
        pending: 'Đang xóa nghệ sĩ...',
        success: 'Xóa nghệ sĩ thành công!',
        error: 'Xóa nghệ sĩ thất bại!',
      });
      setArtistList(artistList.filter((genre) => genre._id !== idRow));
    } catch (error) {
      console.log('Failed to delete genre: ', error);
    }
    resetData();
  };

  // Handle delete many
  const handleDeleteManyRows = async () => {
    setOpenModalDeleteMany(false);
    try {
      await toast.promise(artistApi.delete(selected), {
        pending: 'Đang xóa nghệ sĩ...',
        success: 'Xóa nghệ sĩ thành công!',
        error: 'Xóa nghệ sĩ thất bại!',
      });
      setArtistList(artistList.filter((genre) => !selected.includes(genre._id)));
      setSelected([]);
    } catch (error) {
      console.log('Failed to delete genre: ', error);
    }
    resetData();
  };

  // Handle restore
  const handleRestore = async (id) => {
    try {
      await toast.promise(artistApi.restore(id), {
        pending: 'Đang khôi phục nghệ sĩ...',
        success: 'Khôi phục nghệ sĩ thành công!',
        error: 'Khôi phục nghệ sĩ thất bại!',
      });
      setArtistList(artistList.filter((genre) => genre._id !== id));
    } catch (error) {
      console.log('Failed to restore: ', error);
    }
    resetData();
  };

  // Handle force delete
  const handleForceDelete = async () => {
    setOpenModalForceDelete(false);
    try {
      await toast.promise(artistApi.forceDelete(idRow), {
        pending: 'Đang xóa nghệ sĩ...',
        success: 'Xóa nghệ sĩ thành công!',
        error: 'Xóa nghệ sĩ thất bại!',
      });
      setArtistList(artistList.filter((genre) => genre._id !== idRow));
    } catch (error) {
      console.log('Failed to delete genre: ', error);
    }
    resetData();
  };

  // Show option (edit, delete)
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
    setIdRow(event.currentTarget.value);
  };

  // Show Modal force delete
  const handleOpenModalForceDelete = (id) => {
    setIdRow(id);
    setOpenModalForceDelete(true);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - artistList.length) : 0;

  const filteredList = applySortFilter(artistList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredList.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Danh Sách Nghệ Sĩ | ZingMp3 </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách nghệ sĩ
          </Typography>
          <Link to="/dashboard/artist/add">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Thêm nghệ sĩ
            </Button>
          </Link>
        </Stack>

        <Card>
          <TableListToolbar
            tabs={tabs}
            status={tab}
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeholder="Tìm kiếm ..."
            onDeleteAll={() => setOpenModalDeleteMany(true)}
            onChangeStatus={handleChangeStatus}
            // onFilterStatus={handleFilterStatus}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={artistList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, name, roles, avatarUrl, genres, followers, status } = row;
                    const selectedList = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedList}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedList} onChange={(event) => handleClick(event, _id)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Stack direction="column" spacing={0}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                {renderArray(roles)}
                              </Typography>
                            </Stack>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{renderArray(genres)}</TableCell>
                        <TableCell align="left">{followers}</TableCell>

                        <TableCell align="left">
                          <Label color={(status && 'success') || 'error'}>{(status && 'active') || 'inactive'}</Label>
                        </TableCell>

                        <TableCell align="right">
                          {tab === 4 ? (
                            <Stack direction="row" alignItems="center" justifyContent="flex-end">
                              <Tooltip title="Khôi phục" placement="top">
                                <IconButton onClick={() => handleRestore(_id)} size="large" color="default">
                                  <Iconify icon={'eva:refresh-fill'} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xoá vĩnh viễn" placement="top">
                                <IconButton onClick={() => handleOpenModalForceDelete(_id)} color="error">
                                  <Iconify icon={'eva:trash-2-fill'} />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          ) : (
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu} value={_id}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          )}
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

                {artistList.length <= 0 && <NoData nameTable="nghệ sĩ" />}
                {isNotFound && <NoSearchData nameSearch={filterName} />}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={artistList.length}
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
        title="Xóa nghệ sĩ"
        content="Bạn có chắc chắn muốn xoá nghệ sĩ này?"
      />

      <ModalTable
        open={openModalDeleteMany}
        onClose={() => setOpenModalDeleteMany(false)}
        onConfirm={handleDeleteManyRows}
        title="Xóa nghệ sĩ đã chọn"
        content="Bạn có chắc chắn muốn xoá các nghệ sĩ đã chọn?"
      />

      <ModalTable
        open={openModalForceDelete}
        onClose={() => setOpenModalForceDelete(false)}
        onConfirm={handleForceDelete}
        title="Xóa nghệ sĩ"
        content="Hành động này sẽ xóa vĩnh viễn nghệ sĩ này khỏi hệ thống và không thể khôi phục lại. Bạn có chắc chắn muốn xóa?"
      />
    </>
  );
}
