const crypto = require('crypto')

const inMemory = {}

// class DatabaseManager {
//     constructor() {
//         this.databases = {}
//     }

//     getDatabases() {
//         return this.databases
//     }

//     getDatabase(name) {
//         return this.databases[name]
//     }

//     databaseExists(name) {
//         return this.databases[name] ? true : false
//     }

//     createDatabase(name) {
//         this.databases[name] = new Database(name)
//     }

//     dropDatabase(name) {
//         delete this.databases[name]
//     }
// }

class Database {
    constructor(name) {
        this.name = name
        this.tables = {}

        inMemory[name] = this
    }

    getTables() {
        return this.tables
    }

    getTable(name) {
        return this.tables[name]
    }

    tableExists(name) {
        return this.tables[name] ? true : false
    }

    createTable(name) {
        this.tables[name] = new Table(name)
    }

    dropTable(name) {
        delete this.tables[name]
    }
}

class Table {
    constructor(name) {
        // this.name = name
        this.columns = {}
        this.data = []
        this.count = 0
    }

    getData() {
        return this.data
    }

    getColumns() {
        return this.columns
    }

    getColumn(name) {
        return this.columns[name]
    }

    getCount() {
        return this.count
    }

    columnExists(name) {
        return this.columns[name] ? true : false
    }

    documentExists(value) {
        return this.data.filter((row) => {
            return row.getId() === value
        }).length > 0
    }


    autoIncrement(column) {
        this.columns[column].autoIncrementCount()
    }

    createColumn(name, type, value = null, nullable = false, primaryKey = false, unique = false, autoIncrement = false) {
        this.columns[name] = new Column(name, type, value, nullable, primaryKey, unique, autoIncrement)
    }

    dropColumn(name) {
        delete this.columns[name]
    }

    insert(data) {
        this.count++
        this.data.push(new Document(data))
    }

    findOne(where) {
        if (where) {
            return this.data.find(row => where(row))
        }

        return this.data[0]
    }

    find(where) {
        if (where) {
            return this.data.filter(row => where(row))
        }

        return this.data
    }

    update(where, data) {
        const rows = this.find(row => where(row))

        for (const row of rows) {
            for (const key in data) {
                row.setValue(key, data[key])
            }
        }
    } 

    delete(where) {
        const rows = this.find(row => where(row))

        for (const row of rows) {
            this.data.splice(this.data.indexOf(row), 1)
        }
    }

    truncate() {
        this.data = []
    }     
}

class Column {
    constructor(name, type, value = null, nullable = false, primaryKey = false, unique = false, autoIncrement = false) {
        this.name = name
        this.type = type
        this.nullable = nullable
        this.default = value
        this.primaryKey = primaryKey
        this.unique = unique
        this.autoIncrement = autoIncrement
        this.count = 0
    }

    autoIncrementCount() {
        return this.count++
    }

    setNullable(nullable) {
        this.nullable = nullable
    }

    setDefault(defaultValue) {
        this.default = defaultValue
    }

    setPrimaryKey(primaryKey) {
        this.primaryKey = primaryKey
    }

    setUnique(unique) {
        this.unique = unique
    }

    setAutoIncrement(autoIncrement) {
        this.autoIncrement = autoIncrement
    }

    getDefault() {
        return this.default
    }

    getType() {
        return this.type
    }

    getName() {
        return this.name
    }

    getCount() {
        return this.count
    }

    isNullable() {
        return this.nullable
    }

    isPrimaryKey() {
        return this.primaryKey
    }

    isUnique() {
        return this.unique
    }

    isAutoIncrement() {
        return this.autoIncrement
    }
}

class Document {
    constructor(values) {
        this.uuid = crypto.randomUUID()
        this.values = values
    }

    getId() {
        return this.uuid.replaceAll("-", "")
    }

    getValues() {
        return this.values
    }

    getValue(key) {
        return this.values[key]
    }

    setValue(key, value) {
        this.values[key] = value
    }
}

const databases = () => {
    return inMemory
}

const existsDatabase = (name) => {
    return inMemory[name] ? true : false
}

const dropDatabase = (name) => {
    delete inMemory[name]
}

module.exports = {
    // DatabaseManager,
    Database, 
    Table,
    Column,
    databases,
    existsDatabase,
    dropDatabase
}
