import React, { useEffect, useState, useCallback } from 'react'
import { useLoaderData, useParams, useNavigate, Form } from 'react-router-dom'
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import FormControl, { useFormControl } from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'

import EnhancedTableHead from '../components/EnhancedTableHead'
import EnhancedTableToolbar from '../components/EnhancedTableToolbar'

import { getData, getColumns, getColumn, postData, deleteData } from '../api/root'


const dataQuery = (database, table) => ({
  queryKey: [database, table, "data"],
  queryFn: () => getData(database, table),
  initialData: () => {
    // console.log('initialData')
    return []
  },
  placeholderData: () => {
    // console.log('placeholderData')
    return []
  },
  structuralSharing: (oldData, newData) => {
    // console.log('structuralSharing')
    const data = createData(newData.data)
    // console.log(data)
    return [...data]
  }
})

const columnsQuery = (database, table) => ({
  queryKey: [database, table, "columns"],
  queryFn: () => getColumns(database, table),
  initialData: () => {
    // console.log('initialData columns')
    return []
  },
  structuralSharing: (oldData, newData) => {
    // console.log('structuralSharing columns')
    console.log(newData)
    // let cols = []
    // newData.columns.map(async (column) => {
    //   console.log(column)
    //   const col = await getColumn(database, table, column)
    //   console.log(col)
    //   cols = [...cols, col.column]
    //   // const col = queryClient.ensureQueryData(columnQuery(database, table, column))
      
    // })
    // console.log(cols)

    const data = createColumns(newData.columns)

    return [...data]
  }
})

const columnQuery = (database, table, column) => ({
  queryKey: [database, table, "column", column],
  queryFn: () => getColumn(database, table, column),
  initialData: () => {
    // console.log('initialData column')
    return []
  },
  structuralSharing: (oldData, newData) => {
    // console.log('structuralSharing column')
    // console.log(oldData)
    // console.log(newData)

    return newData
  }
})

const createDataQuery = (database, table, data) => ({
  queryKey: [database, table, "data", "create"],
  queryFn: () => postData(database, table, data),
})


export const loader = (queryClient) => async ({ request, params}) => {
  console.log('loader table.jsx')
  // const dataQ = dataQuery(params.database, params.table)
  // const columnsQ = columnsQuery(params.database, params.table)
  const data = await queryClient.fetchQuery(dataQuery(params.database, params.table))
  // console.log('data', data)	
  const columns = await queryClient.fetchQuery(columnsQuery(params.database, params.table))
  columns.columns.map((column) => {
    queryClient.prefetchQuery(columnQuery(params.database, params.table, column))
  })

  return { params }
}

export const action = (queryClient) => async ({ request, params }) => {
  console.log('action table.jsx')
  // console.log(request)
  // console.log(params)
    switch (request.method) {
      case "POST": {
        const formData = await request.formData()
        let data = Object.fromEntries(formData)

        for (const [key, value] of Object.entries(data)) {
          console.log(`${key}: ${value}`)
          data[key] = parseInt(value) || value
        }

        const d = await queryClient.fetchQuery(createDataQuery(params.database, params.table, data))
        console.log(d)
        queryClient.invalidateQueries({ queryKey: dataQuery(params.database, params.table).queryKey })
      }
      default: {
        console.log('default')
        // throw new Response("", { status: 405 })
      }
    }
  return { params }
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
  const navigate = useNavigate()
  const params = useParams()
  // const dataLoader = useLoaderData()
  const queryClient = useQueryClient()
  // const form = useFormControl() || {}
  // const [rows, setRows] = useState(createData(dataLoader.data?.data))
  // const [columns, setColumns] = useState(createColumns(dataLoader.columns?.columns))
  const { data: rows } = useQuery(dataQuery(params.database, params.table))
  const { data: columns } = useQuery(columnsQuery(params.database, params.table))

  const [headCells, setHeadCells] = useState([])
  const [order, setOrder] = useState(DEFAULT_ORDER)
  const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY)
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(true)
  const [visibleRows, setVisibleRows] = useState(null)
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE)
  const [paddingHeight, setPaddingHeight] = useState(0)

  // useEffect(() => {
  //   console.log('Table useEffect', dataLoader)
  // }, [dataLoader.params])

  // useEffect(() => {
  //   console.log('Table useEffect rows', rows)
  // }, [rows])

  useEffect(() => {
    // console.log('Table useEffect columns', columns)

    if (columns) {
      let cols = []
      columns.map((column, index) => {
        const col = queryClient.getQueryData(columnQuery(params.database, params.table, column.id).queryKey)
        const c = { ...col?.column, ...column }
        c.numeric = c.type === 'number' ? true : false
        cols = [...cols, c]
      })
      setHeadCells(cols)
    }

  }, [columns])

  useEffect(() => {
    let rowsOnMount = stableSort(
      rows,
      getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY),
    )

    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
    )

    setVisibleRows(rowsOnMount)
  }, [rows, columns])

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
      const newSelected = visibleRows.map((n) => n._id);
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

  // const handleChangeDense = (event) => {
  //   setDense(event.target.checked);
  // };

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('handleSubmit', e)
  }

  const mutationDeleteData = useMutation({
    mutationFn: (data) => deleteData(data.database, data.table, data.id),
    onSuccess: (variables) => {
      console.log('mutationDeleteData onSuccess', variables)
      queryClient.invalidateQueries({ queryKey: dataQuery(params.database, params.table) })
    }
  })

  const handleDeleteData = () => {
    console.log('handleDeleteData', selected)

    selected.map((id) => {
      mutationDeleteData.mutate({ database: params.database, table: params.table, id })
    })
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

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
    <Stack direction="row" spacing={2}>
      <Button variant="contained" onClick={() => navigate(`/${params.database}/${params.table}/columns`)}>
        Colmuns
      </Button>
      <Button variant="contained">
        Data
      </Button>
    </Stack>
    <Paper sx={{ width: '100%', my: 4 }}>
      <Form method="post" id="contact-form">
      {/* <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={(e) => handleSubmit(e)}
      > */}
        <Stack direction="row" spacing={2} padding={2}>
          {headCells.slice(1).map((headCell) => (
            <FormControl key={headCell.id} fullWidth variant="standard">
              <InputLabel htmlFor="component-simple">{headCell.label}</InputLabel>
              <Input id="component-simple"
                type={headCell.numeric ? 'number' : 'text'}
                name={headCell.id}
                required={headCell.nullable}
               />
            </FormControl>
          ))}
        </Stack>
        <Button variant="contained" type='submit' size="small" >
          Insert Row
        </Button>
      {/* </Box> */}
      </Form>
    </Paper>

    <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} click={() => handleDeleteData()} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={selected.length}
            />
            <TableBody>
              {visibleRows
                ? visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row._id)
                    const labelId = `enhanced-table-checkbox-${index}`

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
                        {row && columns.slice(1).map((column, index) => (
                          <TableCell key={index} align="right">
                            {row[column.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
  </Box>
  )
}

export default MyTable