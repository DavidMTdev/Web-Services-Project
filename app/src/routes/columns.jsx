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


import { getColumns, getColumn, deleteColumn, postColumn } from '../api/root'



const columnsQuery = (database, table) => ({
  queryKey: [database, table, "columns"],
  queryFn: () => getColumns(database, table),
  initialData: () => {
    return []
  },
  structuralSharing: (oldData, newData) => {
    const data = createColumns(newData.columns)
    return [...data]
  }
})

const columnQuery = (database, table, column) => ({
  queryKey: [database, table, "column", column],
  queryFn: () => getColumn(database, table, column),
  initialData: () => {
    return []
  },
  structuralSharing: (oldData, newData) => {
    return newData
  }
})

const createColumnQuery = (database, table, data) => ({
  queryKey: [database, table, "data", "create"],
  queryFn: () => postColumn(database, table, data),
})

export const loader = (queryClient) => async ({ request, params}) => {
  console.log('loader columns.jsx')

  const columns = await queryClient.fetchQuery(columnsQuery(params.database, params.table))
  columns.columns.map((column) => {
    queryClient.prefetchQuery(columnQuery(params.database, params.table, column))
  })

  return { params }
}

export const action = (queryClient) => async ({ request, params }) => {
  console.log('action table.jsx')
    switch (request.method) {
      case "POST": {
        const formData = await request.formData()
        let data = Object.fromEntries(formData)
        for (const [key, value] of Object.entries(data)) {
          if (data[key]) {
            // console.log(`${key}: ${value}`)
            if (data.default) {
              if (data.type === "int") {
                data.default = parseInt(value)
              } else if (data.type === "float") {
                data.default = parseFloat(value)
              } else if (data.type === "bool") {
                data.default = value.toLowerCase() === "true" ? true : false
              } else {
                data.default = value
              }
            }

            data[key] = data[key].toLowerCase() === "true" ? true : data[key]
          } else {
            delete data[key]
          }
        }

        const column = {
         [data.name]: {
            type: data.type,  
          }
        }

        if (data.default) {
          column[data.name].default = data.default
        }
        if (data.unique) {
          column[data.name].unique = data.unique
        }
        if (data.autoIncrement) {
          column[data.name].autoIncrement = data.autoIncrement
        }
        if (data.nullable) {
          column[data.name].nullable = data.nullable
        }
        if (data.primaryKey) {
          column[data.name].primaryKey = data.primaryKey
        }

        const d = await queryClient.fetchQuery(createColumnQuery(params.database, params.table, column))
        queryClient.invalidateQueries({ queryKey: columnsQuery(params.database, params.table).queryKey })
        queryClient.invalidateQueries({ queryKey: columnQuery(params.database, params.table, data.name).queryKey })
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
const DEFAULT_ROWS_PER_PAGE = 100

const createColumns = (columns) => {
  let cols = []
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

const Columns = () => {
  const navigate = useNavigate()
  const params = useParams()
  // const dataLoader = useLoaderData()
  const queryClient = useQueryClient()
  // const form = useFormControl() || {}
  const [rows, setRows] = useState([])
  // const [columns, setColumns] = useState(createColumns(dataLoader.columns?.columns))
  const { data: columns } = useQuery(columnsQuery(params.database, params.table))

  const [headCells, setHeadCells] = useState([
    {id: 'name', label: 'name', numeric: false, disablePadding: false},
    {id: 'type', label: 'type', numeric: false, disablePadding: false},
    {id: 'default', label: 'default', numeric: false, disablePadding: false},
    {id: 'unique', label: 'unique', numeric: false, disablePadding: false},
    {id: 'autoIncrement', label: 'autoIncrement', numeric: false, disablePadding: false},
    {id: 'nullable', label: 'nullable', numeric: false, disablePadding: false},
    {id: 'primaryKey', label: 'primaryKey', numeric: false, disablePadding: false},
  ])
  const [order, setOrder] = useState(DEFAULT_ORDER)
  const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY)
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(true)
  const [visibleRows, setVisibleRows] = useState(null)
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE)

  useEffect(() => {
    if (columns) {
      let cols = []
      columns.map((column, index) => {
        const col = queryClient.getQueryData(columnQuery(params.database, params.table, column.id).queryKey)

        if (col.column) {
          const c = { 
            autoIncrement: col?.column?.autoIncrement,
            default: col?.column?.default,
            name: col?.column?.name,
            nullable: col?.column?.nullable,
            primaryKey: col?.column?.primaryKey,
            type: col?.column?.type,
            unique: col?.column?.unique,
          }
          // c.numeric = c.type === 'number' ? true : false
          cols = [...cols, c]
        }
       
      })
      setRows(cols)
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
      const newSelected = visibleRows.map((n) => n.name);
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
  }


  const mutationDeleteData = useMutation({
    mutationFn: (data) => deleteColumn(data.database, data.table, data.id),
    onSuccess: (variables) => {
      console.log('mutationDeleteData onSuccess', variables)
      queryClient.invalidateQueries({ queryKey: columnsQuery(params.database, params.table) })
    }
  })

  const handleDeleteData = () => {
    console.log('handleDeleteData', selected)

    selected.map((id) => {
      console.log('handleDeleteData', id)
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
      <Button variant="contained" onClick={() => navigate(`/${params.database}/${params.table}/data`)}>
        Data
      </Button>
    </Stack>
    <Paper sx={{ width: '100%', my: 4 }}>
      <Form method="post" id="contact-form">
        <Stack direction="row" spacing={2} padding={2}>
          {headCells.map((headCell) => (
            <FormControl key={headCell.id} fullWidth variant="standard">
              <InputLabel htmlFor="component-simple">{headCell.label}</InputLabel>
              <Input id="component-simple"
                type='text'
                name={headCell.id}
               />
            </FormControl>
          ))}
        </Stack>
        <Button variant="contained" type='submit' size="small" >
          Add column
        </Button>
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
                    const isItemSelected = isSelected(row.name)
                    const labelId = `enhanced-table-checkbox-${index}`

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.name)}
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
                          {row.name}
                        </TableCell>
                        <TableCell align="right">
                          {row.type}
                        </TableCell>
                        <TableCell align="right">
                          {row.default}
                        </TableCell>
                        <TableCell align="right">
                          {`${row.unique}`}
                        </TableCell>
                        <TableCell align="right">
                          {`${row.autoIncrement}`}
                        </TableCell>
                        <TableCell align="right">
                          {`${row.nullable}`}
                        </TableCell>
                        <TableCell align="right">
                          {`${row.primaryKey}`}
                        </TableCell>
                      </TableRow>
                    )
                  })
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
  </Box>
  )
}

export default Columns