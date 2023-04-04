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
<!-- #### Request :
```http
  curl -X OPTIONS 'http://localhost:3000'
``` -->
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `methods` | `array` | List of methods |
<!-- ```json
  {
    "description": "List of methods",
    "methods": ["GET","POST"]
  } 
``` -->

### Get database list
```http
  GET /
```
<!-- #### Request :
```http
  curl -X GET 'http://localhost:3000'
``` -->
#### Response :
| Property | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `description` | `string` | Request description |
| `databases` | `array` | List of database |
<!-- ```json
  {
    "description": "List of database",
    "databases": ["cinema","Test1"]
  } 
``` -->

### Create database
```http
  POST /
  Content-Type: application/json
  {
    "database": {database}
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
<!-- #### Request
```http
  curl -X GET 'http://localhost:3000' \
  -H 'Content-Type: application/json' \
  -d '{
    "database": "cinema"
  }'
```
#### Response
```json
  {
    "description": "List of database",
    "databases": ["cinema","company"]
  } 
``` -->