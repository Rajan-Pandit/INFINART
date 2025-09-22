// EnhancedTable.js
import * as React from "react";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, TableSortLabel, Toolbar, Typography, Paper,
  IconButton, Tooltip, Rating, Avatar, TextField, MenuItem, Switch,
  FormControlLabel, CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { visuallyHidden } from "@mui/utils";

import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProducts } from "../../Redux/dashboardSlice";

const headCells = [
  { id: "serial", label: "#", numeric: false },
  { id: "image", label: "Image", numeric: false },
  { id: "name", label: "Product", numeric: false },
  { id: "category", label: "Category", numeric: false },
  { id: "subCategory", label: "Sub Category", numeric: false },
  { id: "price", label: "Price", numeric: false },
  { id: "sales", label: "Sales", numeric: true },
  { id: "stock", label: "Stock", numeric: true },
  { id: "rating", label: "Rating", numeric: true },
  { id: "actions", label: "Actions", numeric: false },
];

// comparator helpers
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id !== "serial" && headCell.id !== "actions" ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id && (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                )}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar({ filters, setFilters, rows }) {
  const handleFilterChange = (field) => (event) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const uniqueCategories = [...new Set(rows.map((row) => row.category))];
  const uniqueSubCategories = [...new Set(rows.map((row) => row.subCategory))];

  return (
    <Toolbar sx={{ pl: 2, pr: 1, flexWrap: "wrap", gap: 2 }}>
      <Typography variant="h6" sx={{ flex: "1 1 100%" }}>
        Products
      </Typography>

      <TextField
        size="small"
        select
        label="Category"
        value={filters.category}
        onChange={handleFilterChange("category")}
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="">All</MenuItem>
        {uniqueCategories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        size="small"
        select
        label="Sub Category"
        value={filters.subCategory}
        onChange={handleFilterChange("subCategory")}
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="">All</MenuItem>
        {uniqueSubCategories.map((sub) => (
          <MenuItem key={sub} value={sub}>
            {sub}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        size="small"
        label="Search"
        value={filters.search}
        onChange={handleFilterChange("search")}
      />
    </Toolbar>
  );
}

export default function EnhancedTable() {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.dashboard);
  const authState = useSelector((state) => state.auth);

  // unifying seller + token just like Dashboard
  const seller = authState?.seller ||
    (localStorage.getItem("sellerData") &&
      JSON.parse(localStorage.getItem("sellerData")));
  const token =
    authState?.token || localStorage.getItem("sellerToken");

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filters, setFilters] = React.useState({
    category: "",
    subCategory: "",
    search: "",
  });

  // fetch products once token is available
  React.useEffect(() => {
    if (token) {
      console.log("🔎 Dispatching fetchSellerProducts with token:", token);
      dispatch(fetchSellerProducts(token));
    } else {
      console.warn("⚠️ No token found, not fetching products");
    }
  }, [dispatch, token]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeDense = (event) => setDense(event.target.checked);

  const filteredRows = products.filter((row) => {
    return (
      (filters.category === "" || row.category === filters.category) &&
      (filters.subCategory === "" || row.subCategory === filters.subCategory) &&
      (filters.search === "" ||
        row.name.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const visibleRows = React.useMemo(
    () =>
      [...filteredRows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, filteredRows]
  );

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          filters={filters}
          setFilters={setFilters}
          rows={products}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} size={dense ? "small" : "medium"}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row, index) => (
                <TableRow hover key={row._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Avatar src={row.image} variant="square" />
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.subCategory}</TableCell>
                  <TableCell>
                    <span
                      style={{ textDecoration: "line-through", marginRight: 8 }}
                    >
                      ₹{row.originalPrice}
                    </span>
                    <span style={{ color: "blue" }}>
                      ₹{row.discountedPrice}
                    </span>
                  </TableCell>
                  <TableCell align="right">{row.sales} sale</TableCell>
                  <TableCell align="right">{row.stock}</TableCell>
                  <TableCell align="right">
                    <Rating value={row.rating} readOnly size="small" />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View">
                      <IconButton>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {visibleRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No products found
                  </TableCell>
                </TableRow>
              )}
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
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
