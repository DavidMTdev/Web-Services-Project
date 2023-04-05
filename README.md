# Web-Services-Project
Create web services api RESTfull

## Features

Interface client

- Create database
- Get database
- Delete database

- Create table
- Get table
- Delete table

- Get column

- Create Data
- Get Data
- Delete Data

API RESTfull
- Create database
- Get database
- Delete database

- Create table
- Get table
- Delete table

- Create column
- Update column
- Get column
- Delete column

- Create data
- Update data
- Get data
- Delete data

## Tech Stack

**Client:** React, React Router, React Query, Axios

**Server:** Node

## API Reference

### Endpoints
```http
  Methods: OPTIONS, GET, POST
  Path: /
```

### Get method list
```http
  OPTIONS /
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `methods` | `array` | List of methods |

### Get database list
```http
  GET /
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `databases` | `array` | List of database |

### Create database
```http
  POST /
  Content-Type: application/json
  {
    "database": ${database}
  }
```
#### Request :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `database` | `string` | Database name |
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `database` | `string` | Database created |

====================================================================================================

### Endpoints
```http
  Method: OPTIONS, GET, POST, DELETE
  Path: /${database}
```
| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `database` | `string` | **Required**. databas to path     |

### Get method list of database
```http
  OPTIONS /${database}
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `methods` | `array` | List of methods |

### Get table list of database
```http
  GET /${database}
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `tables` | `array` | List of tables |

### Create table of database
```http
  POST /${database}
  Content-Type: application/json
  {
    "table": ${table}
  }
```
#### Request :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `table` | `string` | **Required** Table name |
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `tables` | `array` | List of tables |

### Delete database
```http
  DELETE /${database}
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `database` | `string` | Database deleted |

====================================================================================================

### Endpoints
```http
  Method: OPTIONS, GET, POST, DELETE
  Path: /${database}/${table}
```
| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `database` | `string` | **Required**. database to path    |
| `table`    | `string` | **Required**. table to path       |

### Get method list of table
```http
  OPTIONS /${database}/${table}
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `methods` | `array` | List of methods |

### Get column list of table
```http
  GET /${database}/${table}
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `path` | `array` | List of table |

### Create column of table
```http
  POST /${database}/${table}
  Content-Type: application/json
  {
    "columns": [
      {
        "name": ${column_name}, 
        "type": ${column_type},
        "primaryKey": ${column_primaryKey},
        "unique": ${column_unique},
        "autoIncrement": ${column_autoIncrement}
      }
    ]
  }
```
#### Request :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `columns` | `array` | **Required** List for create columns |
| `columns.name` | `string` | **Required** Column name |
| `columns.type` | `string` | **Required** Column type |
| `columns.primaryKey` | `boolean` | Column primaryKey |
| `columns.unique` | `boolean` | Column unique |
| `columns.autoIncrement` | `boolean` | Column autoIncrement |
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `columns` | `array` | List of columns created |

### Delete table
```http
  DELETE /${database}/${table}
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `table` | `string` | Table deleted |

====================================================================================================

### Endpoints
```http
  Method: OPTIONS, GET, POST
  Path: /${database}/${table}/columns
```
| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `database` | `string` | **Required**. database to path    |
| `table`    | `string` | **Required**. table to path       |

### Get method list of columns
```http
  OPTIONS /${database}/${table}/columns
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `methods` | `array` | List of methods |

### Get column list of table
```http
  GET /${database}/${table}/columns
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `columns` | `array` | List of columns |

### Create column of table
```http
  POST /${database}/${table}/columns
  Content-Type: application/json
  {
    ${column_name}: {
      "type": ${column_type},
      "primaryKey": ${column_primaryKey},
      "unique": ${column_unique},
      "autoIncrement": ${column_autoIncrement}
    }
  }
```
#### Request :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `column_name` | `string` | **Required** Column name |
| `type` | `string` | **Required** Column type |
| `primaryKey` | `boolean` | Column primaryKey |
| `unique` | `boolean` | Column unique |
| `autoIncrement` | `boolean` | Column autoIncrement |
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `columns` | `array` | List of columns created |

====================================================================================================

### Endpoints
```http
  Method: OPTIONS, GET, PUT, DELETE
  Path: /${database}/${table}/columns/${column}
```
| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `database` | `string` | **Required**. database to path    |
| `table`    | `string` | **Required**. table to path       |
| `column`   | `string` | **Required**. column to path      |

### Get method list of column
```http
  OPTIONS /${database}/${table}/columns/${column}
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `methods` | `array` | List of methods |

### Get column of table
```http
  GET /${database}/${table}/columns/${column}
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `column` | `object` | Column |

### Update column of table
```http
  PUT /${database}/${table}/columns/${column}
  Content-Type: application/json
  {
    "type": ${column_type},
    "primaryKey": ${column_primaryKey},
    "unique": ${column_unique},
    "autoIncrement": ${column_autoIncrement}
  }
```
#### Request :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `type` | `string` | **Required** Column type |
| `primaryKey` | `boolean` | Column primaryKey |
| `unique` | `boolean` | Column unique |
| `autoIncrement` | `boolean` | Column autoIncrement |
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `column` | `object` | Column updated |

### Delete column of table
```http
  DELETE /${database}/${table}/columns/${column}
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `column` | `string` | Column deleted |

====================================================================================================

### Endpoints
```http
  Method: OPTIONS, GET, POST, DELETE
  Path: /${database}/${table}/data
```
| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `database` | `string` | **Required**. database to path    |
| `table`    | `string` | **Required**. table to path       |

### Get method list of data
```http
  OPTIONS /${database}/${table}/data
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `methods` | `array` | List of methods |

### Get data list of table
```http
  GET /${database}/${table}/data
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `data` | `object` | List of data |

### Create data of table
```http
  POST /${database}/${table}/data
  Content-Type: application/json
  {
    ${column_name}: ${column_value}
  }
```
#### Request :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `column_name` | `string` | **Required** Column name |
| `column_value` | `string` | **Required** Column value |
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `data` | `object` | Data created |

### Delete data of table
```http
  DELETE /${database}/${table}/data
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `message` | `string` | Request description |

====================================================================================================

### Endpoints
```http
  Method: OPTIONS, GET, PUT, DELETE
  Path: /${database}/${table}/data/${document}
```
| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `database` | `string` | **Required**. database to path    |
| `table`    | `string` | **Required**. table to path       |
| `document` | `string` | **Required**. document to path    |

### Get method list of data
```http
  OPTIONS /${database}/${table}/data/${document}
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `methods` | `array` | List of methods |

### Get data of table
```http
  GET /${database}/${table}/data/${document}
```
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `values` | `object` | Data |


### Update data of table
```http
  PUT /${database}/${table}/data/${document}
  Content-Type: application/json
  {
    ${column_name}: ${column_value}
  }
```
#### Request :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `column_name` | `string` | **Required** Column name |
| `column_value` | `string` | **Required** Column value |
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
