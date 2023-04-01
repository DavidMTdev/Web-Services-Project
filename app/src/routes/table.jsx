import React, { useEffect, useState, useCallback } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';

import EnhancedTableHead from '../components/EnhancedTableHead'


import { getData, getColumns } from '../api/root'

const dataQuery = (database, table) => ({
  queryKey: [database, table, "list", "all"],
  queryFn: () => getData(database, table),
})

const columnsQuery = (database, table) => ({
  queryKey: [database, table, "columns", "list", "all"],
  queryFn: () => getColumns(database, table),
})

export const loader = (queryClient) => async ({ request, params}) => {
  const dataQ = dataQuery(params.database, params.table)
  const columnsQ = columnsQuery(params.database, params.table)

  const data  = queryClient.getQueryData(dataQ.queryKey)
  const columns = queryClient.getQueryData(columnsQ.queryKey)
  if (!data) {
    console.log('loader fetch')
    return { params, data: await queryClient.fetchQuery(dataQ), columns: await queryClient.fetchQuery(columnsQ) }
  }

  return { params, data, columns }
}



function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}


function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const DEFAULT_ORDER = 'asc'
const DEFAULT_ORDER_BY = '_id'
const DEFAULT_ROWS_PER_PAGE = 5

const createColumns = (columns) => {
  let cols = [{
    id: '_id',
    label: 'Object ID',
    numeric : false,
    disablePadding: false,
  }]
  columns.map((column) => {
    cols = [...cols, {
      id: column,
      label: column,
      numeric : column.type === 'number' ? true : false,
      disablePadding: false,
    }]
  })
  return cols
}

const createData = (object) => {
  let rows = []
  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      const element = object[key]
      rows = [...rows, { ...element, '_id': key}]
    }
  }
  return rows
}

const MyTable = () => {
  const params = useParams()
  const dataLoader = useLoaderData()
  const [rows, setRows] = useState(createData(dataLoader.data?.data))
  const [columns, setColumns] = useState(createColumns(dataLoader.columns?.columns))

  const [order, setOrder] = useState(DEFAULT_ORDER)
  const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY)
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [visibleRows, setVisibleRows] = useState(null)
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE)
  const [paddingHeight, setPaddingHeight] = useState(0)



  // useEffect(() => {
  //   console.log('Table useEffect', dataLoader)
  // }, [dataLoader])

  useEffect(() => {
    console.log('Table useEffect rows', rows)
  }, [rows])

  useEffect(() => {
    console.log('Table useEffect columns', columns)
  }, [columns])

  useEffect(() => {
    console.log('Table useEffect visibleRows', visibleRows)
  }, [visibleRows])


  useEffect(() => {
    let rowsOnMount = stableSort(
      rows,
      getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY),
    );

    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
    );

    setVisibleRows(rowsOnMount)
  }, []);

  const handleRequestSort = useCallback(
    (event, newOrderBy) => {
      const isAsc = orderBy === newOrderBy && order === 'asc';
      const toggledOrder = isAsc ? 'desc' : 'asc';
      setOrder(toggledOrder);
      setOrderBy(newOrderBy);

      const sortedRows = stableSort(rows, getComparator(toggledOrder, newOrderBy));
      const updatedRows = sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );

      setVisibleRows(updatedRows);
    },
    [order, orderBy, page, rowsPerPage],
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
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
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = useCallback(
    (event, newPage) => {
      setPage(newPage);

      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage,
      );

      setVisibleRows(updatedRows);

      // Avoid a layout jump when reaching the last page with empty rows.
      const numEmptyRows =
        newPage > 0 ? Math.max(0, (1 + newPage) * rowsPerPage - rows.length) : 0;

      const newPaddingHeight = (dense ? 33 : 53) * numEmptyRows;
      setPaddingHeight(newPaddingHeight);
    },
    [order, orderBy, dense, rowsPerPage],
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);

      setPage(0);

      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        0 * updatedRowsPerPage,
        0 * updatedRowsPerPage + updatedRowsPerPage,
      );

      setVisibleRows(updatedRows);

      // There is no layout jump to handle on the first page.
      setPaddingHeight(0);
    },
    [order, orderBy],
  );

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const showRow = (object) => {
    console.log('showRow', object)
    const { _id, ...rest } = object

    console.log('showRow rest', rest);
    let row = []
    for (const key in rest) {
      if (Object.hasOwnProperty.call(rest, key)) {
        const element = rest[key]
        row = [...row, element]
      }
    }
    console.log('showRow row', row);
    return row
  }



  return (
  <Box>
    <Stack
      direction="row"
      divider={<Typography variant="h4" gutterBottom>.</Typography>}
      spacing={0}
    >
      <Typography variant="h4" gutterBottom sx={{
          textTransform: 'capitalize',
      }}>
          {params.database}
      </Typography>
      <Typography variant="h4" gutterBottom>
          {params.table}
      </Typography>
    </Stack>

    <Paper sx={{ width: '100%', mb: 2 }}>
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              headCells={columns}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows
                ? visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row._id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row._id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row._id}
                        </TableCell>
                        {showRow(row).map((item, index) => {
                            return (
                              <TableCell  key={index} align="right">
                                {item}
                              </TableCell>
                            )
                          })
                        }

                    
                      </TableRow>
                    );
                  })
                : null}
              {paddingHeight > 0 && (
                <TableRow
                  style={{
                    height: paddingHeight,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Paper>
  </Box>
  )
}

export default MyTable