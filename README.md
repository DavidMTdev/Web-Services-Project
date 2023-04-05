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


## Example
```http
  curl -X OPTIONS 'http://localhost:3000'

  {
    "description": "List of methods",
    "methods": ["GET","POST"]
  }
```
```http
  curl -X GET 'http://localhost:3000'
  
  {
    "description": "List of database",
    "databases": [
      "cinema",
      "test"
    ]
  }     
```
```http
  curl -X POST 'http://localhost:3000' \
  -H 'Content-Type: application/json' \
  -d '{
    "database": "companies"
  }'  

  {
    "description": "Database created",
    "database": "companies"
  }
```
```http
  curl -X OPTIONS 'http://localhost:3000/cinema'

  {
    "description": "List of methods",
    "Methods": ["GET", "POST", "DELETE"]
  }
```
```http
  curl -X POST 'http://localhost:3000/cinema'
  -H 'Content-Type: application/json' \
  -d '{
    "table": "movies"
  }'

  {
    "description": "Database created",
    "table": "movies"
  }
```
```http
  curl -X GET 'http://localhost:3000/cinema' \

  {
      "description": "List of tables",
      "tables": [
          "movies"
      ]
  }
```
```http
  curl -X DELETE 'http://localhost:3000/cinema'

  {
    "Description": "Database deleted",
    "database": "cinema"
  }
```
```http
  curl -X OPTIONS 'http://localhost:3000/cinema/movies'

  {
    "description": "List of methods",
    "methods": ["GET", "POST", "DELETE"]
  }
```
```http
  curl -X POST 'http://localhost:3000/cinema/movies' \
  -H 'Content-Type: application/json' \
  -d '{
    "columns": [
          {
            "name":"id", 
            "type": "int",
            "primaryKey": true,
            "unique": true,
            "autoIncrement": true
          }, 
          {
            "name":"title", 
            "type": "string"
          }, 
          {
            "name":"vote", 
            "type": "int",
            "nullable": true
          },
          {
              "name": "language",
              "type": "string"
          },
          {
              "name": "budget",
              "type": "float",
              "nullable": true
          }
      ]
  }'

  {
    "description": "Columns created",
    "Columns": {
        "id": {
            "name": "id",
            "type": "number",
            "nullable": false,
            "default": null,
            "primaryKey": true,
            "unique": true,
            "autoIncrement": true,
            "count": 0
        },
        "title": {
            "name": "title",
            "type": "string",
            "nullable": false,
            "default": null,
            "primaryKey": false,
            "unique": false,
            "autoIncrement": false,
            "count": 0
        },
        "vote": {
            "name": "vote",
            "type": "number",
            "nullable": true,
            "default": null,
            "primaryKey": false,
            "unique": false,
            "autoIncrement": false,
            "count": 0
        },
        "language": {
            "name": "language",
            "type": "string",
            "nullable": false,
            "default": null,
            "primaryKey": false,
            "unique": false,
            "autoIncrement": false,
            "count": 0
        },
        "budget": {
            "name": "budget",
            "type": "number",
            "nullable": true,
            "default": null,
            "primaryKey": false,
            "unique": false,
            "autoIncrement": false,
            "count": 0
        }
    }
}
```
```http
  curl -X DELETE 'http://localhost:3000/cinema/movies'

  {
    "description": "Table deleted",
    "table": "movies"
  }
```
```http
  curl -X OPTIONS 'http://localhost:3000/cinema/movies/columns'

  {
    "description": "List of methods",
    "methods": ["GET", "POST"]
  }
```
```http
  curl -X GET 'http://localhost:3000/cinema/movies/columns'

  {
    "description": "List of columns",
    "columns": [
        "id",
        "title",
        "vote",
        "language",
        "budget"
    ]
  }
```
```http
  curl -X POST 'http://localhost:3000/cinema/movies/columns'
  -H 'Content-Type: application/json' \
  -d '{
    "popularity": {
      "type": "float",
      "nullable": true,
      "default": null,
      "primaryKey": false,
      "unique": false,
      "autoIncrement": false
    }
  }'

  {
    "message": "Columns created"
  }
```
```http
  curl -X OPTIONS 'http://localhost:3000/cinema/movies/columns/id'
  
  {
    "description": "List of methods",
    "methods": ["GET", "PUT", "DELETE"]
  }
```
```http
  curl -X GET 'http://localhost:3000/cinema/movies/columns/id'
  
  {
    "description": "List of column details",
    "column": {
        "name": "id",
        "type": "number",
        "nullable": false,
        "default": null,
        "primaryKey": true,
        "unique": true,
        "autoIncrement": true,
        "count": 0
    }
  }
```
```http
  curl -X PUT 'http://localhost:3000/cinema/movies/columns/title' \
  -H 'Content-Type: application/json' \
  -d '{
    "default": "Default Title"
  }'

  {
    "message": "Columns updated",
    "column": {
        "default": "Default Title"
    }
  }
```
```http
  curl -X DELETE 'http://localhost:3000/cinema/movies/columns/language'

  {
    "message": "Columns deleted"
  }
```
```http
  curl -X OPTIONS 'http://localhost:3000/cinema/movies/data'

  {
    "description": "List of methods",
    "methods": ["GET", "POST", "DELETE"]
  }
```
```http
  curl -X POST 'http://localhost:3000/cinema/movies/data'
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Kill Bill: Vol. 1",
    "vote": 12820,
    "budget": 30000000
  }'

  {
    "message": "Data created",
    "data": {
        "title": "Kill Bill: Vol. 1",
        "vote": 12820,
        "budget": 30000000,
        "id": 1
    }
  }
```
```http
  curl -X GET 'http://localhost:3000/cinema/movies/data'

  {
    "description": "List of data",
    "data": {
        "899b30341e674c52a98615207bc99444": {
            "title": "Kill Bill: Vol. 1",
            "vote": 12820,
            "budget": 30000000,
            "id": 2
        }
    }
  }
```
```http
  curl -X OPTIONS 'http://localhost:3000/cinema/movies/data/899b30341e674c52a98615207bc99444'

  {
    "description": "List of methods",
    "methods": ["GET", "PUT", "DELETE"]
  }
```
```http
  curl -X GET 'http://localhost:3000/cinema/movies/data/899b30341e674c52a98615207bc99444'

  {
    "description": "Values of Document",
    "values": {
        "title": "Kill Bill: Vol. 1",
        "vote": 12820,
        "budget": 30000000,
        "id": 2
    }
  }
```
```http
  curl -X PUT 'http://localhost:3000/cinema/movies/data/899b30341e674c52a98615207bc99444'
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Kill Bill",
      "vote": 43762,
      "budget": 50000000
  }'

  {
    "description": "Document updated"
  }
```
```http
  curl -X DELETE 'http://localhost:3000/cinema/movies/data/899b30341e674c52a98615207bc99444'

  {
    "description": "Document deleted"
  }
```