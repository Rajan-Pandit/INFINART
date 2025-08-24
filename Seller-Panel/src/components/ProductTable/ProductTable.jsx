// EnhancedTable.js
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, TableSortLabel,
  Toolbar, Typography, Paper, Checkbox, IconButton,
  Tooltip, FormControlLabel, Switch, Rating, Avatar, TextField, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';

function createProduct(id, image, name, category, subCategory, originalPrice, discountedPrice, sales, stock, rating) {
  return { id, image, name, category, subCategory, originalPrice, discountedPrice, sales, stock, rating };
}

const rows = [
  createProduct(1, 'https://source.unsplash.com/50x50/?calligraphy', 'Elegant Calligraphy Set', 'Art', 'Calligraphy', 1299, 899, 18, 340, 5),
  createProduct(2, 'https://source.unsplash.com/50x50/?pottery', 'Handmade Clay Pot', 'Decor', 'Pottery', 799, 499, 22, 124, 4),
  createProduct(3, 'https://source.unsplash.com/50x50/?wall-art', 'Wall Hanging Art', 'Art', 'Wall Decor', 1499, 1199, 5, 90, 5),
  createProduct(4, 'https://source.unsplash.com/50x50/?lamp', 'Vintage Lamp', 'Lighting', 'Lamp', 1599, 1299, 9, 45, 4),
  createProduct(5, 'https://source.unsplash.com/50x50/?painting', 'Abstract Painting Canvas', 'Art', 'Painting', 2599, 2099, 12, 60, 5),
];

const headCells = [
  { id: 'image', label: 'Image', numeric: false },
  { id: 'name', label: 'Product', numeric: false },
  { id: 'category', label: 'Category', numeric: false },
  { id: 'subCategory', label: 'Sub Category', numeric: false },
  { id: 'price', label: 'Price', numeric: false },
  { id: 'sales', label: 'Sales', numeric: true },
  { id: 'stock', label: 'Stock', numeric: true },
  { id: 'rating', label: 'Rating', numeric: true },
  { id: 'actions', label: 'Actions', numeric: false },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id && (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar({ numSelected, filters, setFilters }) {
  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({ ...prev, [field]: event.target.value }));
  };

  const uniqueCategories = [...new Set(rows.map(row => row.category))];
  const uniqueSubCategories = [...new Set(rows.map(row => row.subCategory))];

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          flexWrap: 'wrap',
          gap: 2,
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      <Typography variant="h6" sx={{ flex: '1 1 100%' }}>
        {numSelected > 0 ? `${numSelected} selected` : 'Products'}
      </Typography>

      <TextField
        size="small"
        select
        label="Category"
        value={filters.category}
        onChange={handleFilterChange('category')}
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="">All</MenuItem>
        {uniqueCategories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
      </TextField>

      <TextField
        size="small"
        select
        label="Sub Category"
        value={filters.subCategory}
        onChange={handleFilterChange('subCategory')}
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="">All</MenuItem>
        {uniqueSubCategories.map(sub => <MenuItem key={sub} value={sub}>{sub}</MenuItem>)}
      </TextField>

      <TextField
        size="small"
        label="Search"
        value={filters.search}
        onChange={handleFilterChange('search')}
      />
    </Toolbar>
  );
}

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filters, setFilters] = React.useState({ category: '', subCategory: '', search: '' });

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredRows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) newSelected = [...selected, id];
    else newSelected = selected.filter(item => item !== id);

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeDense = (event) => setDense(event.target.checked);
  const isSelected = (id) => selected.indexOf(id) !== -1;

  const filteredRows = rows.filter((row) => {
    return (
      (filters.category === '' || row.category === filters.category) &&
      (filters.subCategory === '' || row.subCategory === filters.subCategory) &&
      (filters.search === '' || row.name.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const visibleRows = React.useMemo(
    () =>
      [...filteredRows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, filteredRows],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} filters={filters} setFilters={setFilters} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredRows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" checked={isItemSelected} />
                    </TableCell>
                    <TableCell><Avatar src={row.image} variant="square" /></TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.subCategory}</TableCell>
                    <TableCell>
                      <span style={{ textDecoration: 'line-through', marginRight: 8 }}>₹{row.originalPrice}</span>
                      <span style={{ color: 'blue' }}>₹{row.discountedPrice}</span>
                    </TableCell>
                    <TableCell align="right">{row.sales} sale</TableCell>
                    <TableCell align="right">{row.stock}</TableCell>
                    <TableCell align="right">
                      <Rating value={row.rating} readOnly size="small" />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View"><IconButton><VisibilityIcon /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton><DeleteIcon /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
    </Box>
  );
}
