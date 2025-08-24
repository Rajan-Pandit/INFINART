import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Typography,
  Box,
  IconButton,
  Collapse,
  Chip,
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { styled } from "@mui/material/styles";

const CYAN = "#E0FFFF";
const MINT = "#20BFA5";

const StyledTableContainer = styled(TableContainer)(() => ({
  width: "100%",        // <= important!
  height: 440,          // fixed height for scroll
  overflow: "auto",
  borderRadius: "12px",
  backgroundColor: CYAN,
}));

const StyledTableCell = styled(TableCell)(() => ({
  color: "#222",
  fontWeight: 500,
  whiteSpace: "nowrap",
  borderBottom: `1px solid ${MINT}`,
  maxWidth: 120,       // <= you can tweak this for less horizontal overflow!
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const LabelCell = styled("span")(() => ({
  fontWeight: 600,
  color: MINT,
}));

const columns = [
  "Order Id",
  "Paymant Id",
  "Name",
  "Phone Number",
  "Address",
  "Pincode",
  "Total Amount",
  "Email",
  "User Id",
  "Order Status",
  "Date",
];

const OrderTable = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [openRow, setOpenRow] = React.useState(null);
  const [sortField, setSortField] = React.useState("date");
  const [sortOrder, setSortOrder] = React.useState("desc");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const orders = [
    {
      orderId: "6894cd...bba140c",
      paymentId: "CASH ON DELIVERY",
      name: "CSN",
      phone: "91123123",
      address: "asdsad asdada Việt Nam",
      pincode: "110011",
      totalAmount: 1299,
      email: "csn@gmail.com",
      userId: "user123",
      status: "Delivered",
      date: "2025-08-08",
      products: ["T-shirt", "Shoes", "Watch"],
    },
    {
      orderId: "6894cffe...bbb9f57c",
      paymentId: "pay_9RzU...aQh",
      name: "Ramesh Singh",
      phone: "918958498544",
      address: "Delhi, India",
      pincode: "110034",
      totalAmount: 2549,
      email: "ramesh.singh@gmail.com",
      userId: "user124",
      status: "Pending",
      date: "2025-08-07",
      products: ["Bag", "Belt"],
    },
    {
      orderId: "6894bfe5...bbb9dd01",
      paymentId: "CASH ON DELIVERY",
      name: "Kalpesh Hire",
      phone: "919767777200",
      address: "Aurangabad, Maharashtra",
      pincode: "431001",
      totalAmount: 3899,
      email: "kalpesh.hire@gmail.com",
      userId: "user125",
      status: "Shipped",
      date: "2025-08-06",
      products: ["Sunglasses", "Shoes"],
    },
  ];

  const filteredOrders = orders
    .filter((order) =>
      [order.name, order.email, order.orderId].some((val) =>
        val.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      else return aVal < bVal ? 1 : -1;
    });

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderStatus = (status) => {
    const color =
      status === "Delivered"
        ? "success"
        : status === "Pending"
        ? "error"
        : "warning";
    return (
      <Chip
        label={status}
        color={color}
        size="small"
        sx={{
          fontWeight: "bold",
          border: `1px solid ${MINT}`,
          backgroundColor: "transparent",
          color: "#000",
        }}
      />
    );
  };

  return (
    <Box
      className="OrderTable-root"
      sx={{ padding: "24px", backgroundColor: "transparent", width: "100%", minWidth: 0 }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: "#222" }}>
        Recent Orders
      </Typography>

      <TextField
        variant="outlined"
        placeholder="Search by Name, Email or Order ID"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Paper elevation={2}>
        <StyledTableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell />
                {columns.map((col, i) => (
                  <StyledTableCell key={i}>
                    <TableSortLabel
                      active={
                        sortField === col.toLowerCase().replace(/ /g, "")
                      }
                      direction={sortOrder}
                      onClick={() =>
                        handleSort(col.toLowerCase().replace(/ /g, ""))
                      }
                      sx={{ color: MINT, fontWeight: "bold" }}
                    >
                      {col}
                    </TableSortLabel>
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((order, index) => (
                <React.Fragment key={index}>
                  <TableRow hover>
                    <StyledTableCell>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setOpenRow(openRow === index ? null : index)
                        }
                      >
                        {openRow === index ? (
                          <ExpandLessIcon sx={{ color: MINT }} />
                        ) : (
                          <ExpandMoreIcon sx={{ color: MINT }} />
                        )}
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell>
                      <LabelCell>{order.orderId}</LabelCell>
                    </StyledTableCell>
                    <StyledTableCell>
                      <LabelCell>{order.paymentId}</LabelCell>
                    </StyledTableCell>
                    <StyledTableCell>{order.name}</StyledTableCell>
                    <StyledTableCell>{order.phone}</StyledTableCell>
                    <StyledTableCell>{order.address}</StyledTableCell>
                    <StyledTableCell>{order.pincode}</StyledTableCell>
                    <StyledTableCell>₹{order.totalAmount}</StyledTableCell>
                    <StyledTableCell>{order.email}</StyledTableCell>
                    <StyledTableCell>
                      <LabelCell>{order.userId}</LabelCell>
                    </StyledTableCell>
                    <StyledTableCell>
                      {renderStatus(order.status)}
                    </StyledTableCell>
                    <StyledTableCell>{order.date}</StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={12} sx={{ p: 0 }}>
                      <Collapse
                        in={openRow === index}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <Typography variant="subtitle2">
                            Products:
                          </Typography>
                          <ul>
                            {order.products.map((product, i) => (
                              <li key={i}>{product}</li>
                            ))}
                          </ul>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <TablePagination
          component="div"
          count={filteredOrders.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </Box>
  );
};

export default OrderTable;
