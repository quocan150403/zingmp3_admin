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
import { toast } from 'react-toastify';
// Hooks
import useTableManagement from '../../hooks/useTableManagement';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { TableListHead, TableListToolbar, ModalTable, NoData, NoSearchData, PopoverMenu } from '../../components/table';
import { fDate, fHour } from '../../utils/formatTime';

import { galleryApi } from '../../api';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'imageUrl', label: 'Hình' },
  { id: 'create', label: 'Ngày tạo' },
  { id: 'order', label: 'Thứ tự' },
  { id: 'link', label: 'Liên kết' },
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

export default function GalleryListPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(1);
  const [tabs, setTabs] = useState(TABS);
  const [originalData, setOriginalData] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
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
  } = useTableManagement(galleryList);

  // Call Api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await galleryApi.getAll();
        const items = response.filter((item) => !item.deleted);

        setOriginalData(response);
        setGalleryList(items);
        updateTabNumbers(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const currentFilteredData = applyFilterStatus(originalData, tab);
    setGalleryList(currentFilteredData);
  }, [originalData, tab]);

  const applyFilterStatus = (data, newStatus) => {
    if (newStatus === 1) {
      return data.filter((item) => !item.deleted);
    }
    if (newStatus === 2) {
      return data.filter((item) => item.status && !item.deleted);
    }
    if (newStatus === 3) {
      return data.filter((item) => !item.status && !item.deleted);
    }
    if (newStatus === 4) {
      return data.filter((item) => item.deleted);
    }
    return data;
  };

  // Reset Api
  const resetData = async () => {
    try {
      const response = await galleryApi.getAll();
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
  };

  // Handle navigate edit page
  const handleEditRow = () => {
    navigate(`/dashboard/gallery/edit/${idRow}`);
  };

  // Handle delete
  const handleDeleteRow = async () => {
    setOpenModalDelete(false);
    setOpen(null);

    try {
      await toast.promise(galleryApi.delete(idRow), {
        pending: 'Đang xóa banner...',
        success: 'Xóa banner thành công!',
        error: 'Xóa banner thất bại!',
      });
      setGalleryList(galleryList.filter((genre) => genre._id !== idRow));
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
      await toast.promise(galleryApi.deleteMany(selected), {
        pending: 'Đang xóa banner...',
        success: 'Xóa banner thành công!',
        error: 'Xóa banner thất bại!',
      });
      setGalleryList(galleryList.filter((genre) => !selected.includes(genre._id)));
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
      await toast.promise(galleryApi.restore(id), {
        pending: 'Đang khôi phục banner...',
        success: 'Khôi phục banner thành công!',
        error: 'Khôi phục banner thất bại!',
      });
      setGalleryList(galleryList.filter((genre) => genre._id !== id));
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
      await toast.promise(galleryApi.forceDelete(idRow, oldImage), {
        pending: 'Đang xóa banner...',
        success: 'Xóa banner thành công!',
        error: 'Xóa banner thất bại!',
      });
      setGalleryList(galleryList.filter((genre) => genre._id !== idRow));
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
    const oldImages = originalData.filter((item) => selected.includes(item._id)).map((item) => item.imageUrl);
    try {
      await toast.promise(galleryApi.forceDeleteMany(selected, oldImages), {
        pending: 'Đang xóa banner...',
        success: 'Xóa banner thành công!',
        error: 'Xóa banner thất bại!',
      });
      setGalleryList(galleryList.filter((item) => !selected.includes(item._id)));
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - galleryList.length) : 0;

  const filteredList = applySortFilter(galleryList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredList.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Danh Sách banner | ZingMp3 </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách banner
          </Typography>
          <Link to="/dashboard/gallery/add">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Thêm banner
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
                  rowCount={galleryList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, imageUrl, link, order, status, createdAt } = row;
                    const selectedList = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedList}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedList} onChange={(event) => handleClick(event, _id)} />
                        </TableCell>

                        <TableCell align="left">
                          <img
                            src={imageUrl}
                            alt="hình ảnh"
                            height={40}
                            style={{
                              borderRadius: '4px',
                            }}
                          />
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

                        <TableCell align="left">{order}</TableCell>
                        <TableCell align="left">{link}</TableCell>

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

                {galleryList.length <= 0 && <NoData nameTable="banner" />}
                {isNotFound && <NoSearchData nameSearch={filterName} />}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={galleryList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

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
        title="Xóa hình ảnh"
        content="Bạn có chắc chắn muốn xoá hình ảnh này?"
      />

      <ModalTable
        open={openModalDeleteMany}
        onClose={() => setOpenModalDeleteMany(false)}
        onConfirm={handleDeleteManyRows}
        title="Xóa hình ảnh đã chọn"
        content="Bạn có chắc chắn muốn xoá các hình ảnh đã chọn?"
      />

      <ModalTable
        open={openModalForceDelete}
        onClose={() => setOpenModalForceDelete(false)}
        onConfirm={handleForceDelete}
        title="Xóa hình ảnh"
        content="Hành động này sẽ xóa vĩnh viễn hình ảnh này khỏi hệ thống và không thể khôi phục lại. Bạn có chắc chắn muốn xóa?"
      />

      <ModalTable
        open={openModalForceDeleteMany}
        onClose={() => setOpenModalForceDeleteMany(false)}
        onConfirm={handleForceDeleteMany}
        title="Xóa vĩnh viễn những hình ảnh đã chọn ?"
        content="Hành động này sẽ xóa vĩnh viễn hình ảnh này khỏi hệ thống và không thể khôi phục lại. Bạn có chắc chắn muốn xóa?"
      />
    </>
  );
}
