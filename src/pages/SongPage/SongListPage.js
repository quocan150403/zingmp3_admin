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

import { songApi } from '../../api';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Thông tin bài hát' },
  { id: 'create', label: 'Ngày tạo' },
  { id: 'artists', label: 'Ca sĩ trình bày' },
  { id: 'composer', label: 'Sáng tác' },
  { id: 'playCount', label: 'Lượt nghe' },
  { id: 'favorites', label: 'Lượt yêu thích' },
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

export default function SongListPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(1);
  const [tabs, setTabs] = useState(TABS);
  const [originalData, setOriginalData] = useState([]);
  const [songList, setSongList] = useState([]);
  const [oldImage, setOldImage] = useState('');
  const [oldAudio, setOldAudio] = useState(null);

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
  } = useTableManagement(songList);

  // Call Api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await songApi.getAll();
        const items = response.filter((item) => !item.deleted);
        setOriginalData(response);
        setSongList(items);
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
      const response = await songApi.getAll();
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
      setSongList(originalData.filter((item) => !item.deleted));
    } else if (newStatus === 2) {
      setSongList(originalData.filter((item) => item.status && !item.deleted));
    } else if (newStatus === 3) {
      setSongList(originalData.filter((item) => !item.status && !item.deleted));
    } else if (newStatus === 4) {
      setSongList(originalData.filter((item) => item.deleted));
    }
  };

  // Handle navigate edit page
  const handleEditRow = () => {
    navigate(`/dashboard/song/edit/${idRow}`);
  };

  // Handle delete
  const handleDeleteRow = async () => {
    setOpenModalDelete(false);
    setOpen(null);

    try {
      await toast.promise(songApi.delete(idRow), {
        pending: 'Đang xóa bài hát...',
        success: 'Xóa bài hát thành công!',
        error: 'Xóa bài hát thất bại!',
      });
      setSongList(songList.filter((genre) => genre._id !== idRow));
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
      await toast.promise(songApi.deleteMany(selected), {
        pending: 'Đang xóa bài hát...',
        success: 'Xóa bài hát thành công!',
        error: 'Xóa bài hát thất bại!',
      });
      setSongList(songList.filter((genre) => !selected.includes(genre._id)));
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
      await toast.promise(songApi.restore(id), {
        pending: 'Đang khôi phục bài hát...',
        success: 'Khôi phục bài hát thành công!',
        error: 'Khôi phục bài hát thất bại!',
      });
      setSongList(songList.filter((genre) => genre._id !== id));
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
      await toast.promise(songApi.forceDelete(idRow, oldImage, oldAudio), {
        pending: 'Đang xóa bài hát...',
        success: 'Xóa bài hát thành công!',
        error: 'Xóa bài hát thất bại!',
      });
      setSongList(songList.filter((genre) => genre._id !== idRow));
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
    const audioList = originalData.filter((item) => selected.includes(item._id)).map((item) => item.audioUrl);
    try {
      await toast.promise(songApi.forceDeleteMany(selected, imageList, audioList), {
        pending: 'Đang xóa banner...',
        success: 'Xóa banner thành công!',
        error: 'Xóa banner thất bại!',
      });
      setSongList(songList.filter((item) => !selected.includes(item._id)));
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
  const handleOpenModalForceDelete = (id, oldThumbnail, oldAudio) => {
    setIdRow(id);
    setOldImage(oldThumbnail);
    setOldAudio(oldAudio);
    setOpenModalForceDelete(true);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - songList.length) : 0;

  const filteredList = applySortFilter(songList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredList.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Danh Sách bài hát | ZingMp3 </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách bài hát
          </Typography>
          <Link to="/dashboard/song/add">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Thêm bài hát
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
                  rowCount={songList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      _id,
                      imageUrl,
                      name,
                      albumId,
                      artists,
                      composers,
                      playCount,
                      favorites,
                      audioUrl,
                      status,
                      createdAt,
                    } = row;
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
                              <Typography variant="caption" noWrap>
                                {albumId.name}
                              </Typography>
                            </Stack>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">
                          <Stack direction="column" spacing={0}>
                            <Typography variant="body2" noWrap>
                              {fDate(createdAt)}
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }} variant="caption" noWrap>
                              {fHour(createdAt)}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{artists.map((item) => item.name).join(', ')}</TableCell>
                        <TableCell align="left">{composers.map((item) => item.name).join(', ')}</TableCell>

                        <TableCell align="left">{playCount}</TableCell>
                        <TableCell align="left">{favorites}</TableCell>

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
                                <IconButton
                                  onClick={() => handleOpenModalForceDelete(_id, imageUrl, audioUrl)}
                                  color="error"
                                >
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

                {songList.length <= 0 && <NoData nameTable="bài hát" />}
                {isNotFound && <NoSearchData nameSearch={filterName} />}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={songList.length}
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
        title="Xóa bài hát"
        content="Bạn có chắc chắn muốn xoá bài hát này?"
      />

      <ModalTable
        open={openModalDeleteMany}
        onClose={() => setOpenModalDeleteMany(false)}
        onConfirm={handleDeleteManyRows}
        title="Xóa bài hát đã chọn"
        content="Bạn có chắc chắn muốn xoá các bài hát đã chọn?"
      />

      <ModalTable
        open={openModalForceDelete}
        onClose={() => setOpenModalForceDelete(false)}
        onConfirm={handleForceDelete}
        title="Xóa vĩnh viễn bài hát"
        content="Hành động này sẽ xóa vĩnh viễn bài hát này khỏi hệ thống và không thể khôi phục lại. Bạn có chắc chắn muốn xóa?"
      />

      <ModalTable
        open={openModalForceDeleteMany}
        onClose={() => setOpenModalForceDeleteMany(false)}
        onConfirm={handleForceDeleteMany}
        title="Xóa vĩnh viễn bài hát đã chọn"
        content="Hành động này sẽ xóa vĩnh viễn bài hát này khỏi hệ thống và không thể khôi phục lại. Bạn có chắc chắn muốn xóa?"
      />
    </>
  );
}
