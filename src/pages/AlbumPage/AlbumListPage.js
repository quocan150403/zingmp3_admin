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
import { fDate, fHour } from '../../utils/formatTime';
import { albumApi } from '../../api';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'name' },
  { id: 'create', label: 'Ngày tạo' },
  { id: 'genres', label: 'Thể loại' },
  { id: 'status', label: 'Trạng thái' },
  { id: '' },
];

const TABS = [
  { label: 'All', value: 1, number: 0, color: 'default', iconPosition: 'end' },
  { label: 'Active', value: 2, number: 0, color: 'success', iconPosition: 'end' },
  { label: 'Inactive', value: 3, number: 0, color: 'warning', iconPosition: 'end' },
  { label: 'Thùng rác', value: 4, number: 0, color: 'error', iconPosition: 'end' },
];

// ----------------------------------------------------------------------

export default function AlbumListPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(1);
  const [tabs, setTabs] = useState(TABS);
  const [originalData, setOriginalData] = useState([]);
  const [albumList, setAlbumList] = useState([]);
  const [oldImage, setOldImage] = useState('');

  const [idRow, setIdRow] = useState('');
  const [open, setOpen] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalDeleteMany, setOpenModalDeleteMany] = useState(false);
  const [openModalForceDelete, setOpenModalForceDelete] = useState(false);
  const [openModalForceDeleteMany, setOpenModalForceDeleteMany] = useState(false);

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
  } = useTableManagement(albumList);

  // Call Api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await albumApi.getAll();
        const items = response.filter((item) => !item.deleted);

        setOriginalData(response);
        setAlbumList(items);
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
      const response = await albumApi.getAll();
      setOriginalData(response);
      updateTabNumbers(response);
      setSelected([]);
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
      setAlbumList(originalData.filter((item) => !item.deleted));
    } else if (newStatus === 2) {
      setAlbumList(originalData.filter((item) => item.status && !item.deleted));
    } else if (newStatus === 3) {
      setAlbumList(originalData.filter((item) => !item.status && !item.deleted));
    } else if (newStatus === 4) {
      setAlbumList(originalData.filter((item) => item.deleted));
    }
  };

  // Handle navigate edit page
  const handleEditRow = () => {
    navigate(`/dashboard/album/edit/${idRow}`);
  };

  // Handle delete
  const handleDeleteRow = async () => {
    setOpenModalDelete(false);
    setOpen(null);

    try {
      await toast.promise(albumApi.delete(idRow), {
        pending: 'Đang xóa album...',
        success: 'Xóa album thành công!',
        error: 'Xóa album thất bại!',
      });
      setAlbumList(albumList.filter((genre) => genre._id !== idRow));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Đã xảy ra lỗi');
      }
    }
    resetData();
  };

  // Handle delete many
  const handleDeleteManyRows = async () => {
    setOpenModalDeleteMany(false);
    try {
      await toast.promise(albumApi.deleteMany(selected), {
        pending: 'Đang xóa album...',
        success: 'Xóa album thành công!',
        error: 'Xóa album thất bại!',
      });
      setAlbumList(albumList.filter((genre) => !selected.includes(genre._id)));
      setSelected([]);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Đã xảy ra lỗi');
      }
    }
    resetData();
  };

  // Handle restore
  const handleRestore = async (id) => {
    try {
      await toast.promise(albumApi.restore(id), {
        pending: 'Đang khôi phục album...',
        success: 'Khôi phục album thành công!',
        error: 'Khôi phục album thất bại!',
      });
      setAlbumList(albumList.filter((genre) => genre._id !== id));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Đã xảy ra lỗi');
      }
    }
    resetData();
  };

  // Handle force delete
  const handleForceDelete = async () => {
    setOpenModalForceDelete(false);
    try {
      await toast.promise(albumApi.forceDelete(idRow, oldImage), {
        pending: 'Đang xóa album...',
        success: 'Xóa album thành công!',
        error: 'Xóa album thất bại!',
      });
      setAlbumList(albumList.filter((genre) => genre._id !== idRow));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Đã xảy ra lỗi');
      }
    }
    resetData();
  };

  // Handle force delete many
  const handleForceDeleteMany = async () => {
    setOpenModalForceDeleteMany(false);
    const imageList = originalData.filter((item) => selected.includes(item._id)).map((item) => item.imageUrl);
    try {
      await toast.promise(albumApi.forceDeleteMany(selected, imageList), {
        pending: 'Đang xóa banner...',
        success: 'Xóa banner thành công!',
        error: 'Xóa banner thất bại!',
      });
      setAlbumList(albumList.filter((item) => !selected.includes(item._id)));
      setSelected([]);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Đã xảy ra lỗi');
      }
    }
    resetData();
  };

  // Show option (edit, delete)
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
    setIdRow(event.currentTarget.value);
  };

  // Show Modal force delete
  const handleOpenModalForceDelete = (id, oldImage) => {
    setIdRow(id);
    setOldImage(oldImage);
    setOpenModalForceDelete(true);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - albumList.length) : 0;

  const filteredList = applySortFilter(albumList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredList.length && !!filterName;
  return (
    <>
      <Helmet>
        <title> Danh Sách album | ZingMp3 </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách album
          </Typography>
          <Link to="/dashboard/album/add">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Thêm album
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
            onForceDeleteAll={() => setOpenModalForceDeleteMany(true)}
            onChangeStatus={handleChangeStatus}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={albumList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, imageUrl, name, genres, artistId, status, createdAt } = row;
                    const selectedList = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedList}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedList} onChange={(event) => handleClick(event, _id)} />
                        </TableCell>

                        <TableCell component="th" scope="row">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <img
                              src={imageUrl}
                              alt="hình ảnh"
                              height={40}
                              style={{
                                borderRadius: '4px',
                              }}
                            />
                            <Stack direction="column" spacing={0}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                              <Typography color="slategrey" variant="caption" noWrap>
                                {/* {artistId.name} */}
                              </Typography>
                            </Stack>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">
                          <Stack direction="column" spacing={0}>
                            <Typography variant="body2" noWrap>
                              {fDate(createdAt)}
                            </Typography>
                            <Typography color="slategrey" variant="caption" noWrap>
                              {fHour(createdAt)}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{genres.map((item) => item.name).join(', ')}</TableCell>

                        <TableCell align="left">
                          <Label color={(status && 'success') || 'error'}>{(status && 'active') || 'inactive'}</Label>
                        </TableCell>

                        <TableCell align="right">
                          {tab === 4 ? (
                            <Stack direction="row" alignItems="center" justifyContent="center">
                              <Tooltip title="Khôi phục" placement="top">
                                <IconButton onClick={() => handleRestore(_id)} size="large" color="default">
                                  <Iconify icon={'eva:refresh-fill'} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xoá vĩnh viễn" placement="top">
                                <IconButton onClick={() => handleOpenModalForceDelete(_id, imageUrl)} color="error">
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

                {albumList.length <= 0 && <NoData nameTable="album" />}
                {isNotFound && <NoSearchData nameSearch={filterName} />}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={albumList.length}
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
        title="Xóa album"
        content="Bạn có chắc chắn muốn xoá album này?"
      />

      <ModalTable
        open={openModalDeleteMany}
        onClose={() => setOpenModalDeleteMany(false)}
        onConfirm={handleDeleteManyRows}
        title="Xóa album đã chọn"
        content="Bạn có chắc chắn muốn xoá các album đã chọn?"
      />

      <ModalTable
        open={openModalForceDelete}
        onClose={() => setOpenModalForceDelete(false)}
        onConfirm={handleForceDelete}
        title="Xóa vĩnh viễn album"
        content="Hành động này sẽ xóa vĩnh viễn album này khỏi hệ thống và không thể khôi phục lại. Bạn có chắc chắn muốn xóa?"
      />

      <ModalTable
        open={openModalForceDeleteMany}
        onClose={() => setOpenModalForceDeleteMany(false)}
        onConfirm={handleForceDeleteMany}
        title="Xóa vĩnh viễn album đã chọn"
        content="Hành động này sẽ xóa vĩnh viễn album này khỏi hệ thống và không thể khôi phục lại. Bạn có chắc chắn muốn xóa?"
      />
    </>
  );
}
