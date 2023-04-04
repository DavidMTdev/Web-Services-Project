# Web-Services-Project
Create web services api RESTfull

## Features

- Light/dark mode toggle
- Live previews
- Fullscreen mode
- Cross platform

## Tech Stack

**Client:** React, React Router, React Query, Axios

**Server:** Node

## API Reference

## API Reference

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


### Get method list of database
```http
  OPTIONS /${database}
```
#### Request :
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `database` | `string` | **Required**. databas to path |
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `methods` | `array` | List of methods |

### Get table list of database
```http
  GET /${database}
```
#### Request :
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `database` | `string` | **Required**. databas to path |
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
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `database` | `string` | **Required**. databas to path |
#### Request :

| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `table` | `string` | Table name |
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `tables` | `array` | List of tables |