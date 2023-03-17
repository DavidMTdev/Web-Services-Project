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
        this.name = name
        this.columns = {}
        this.data = {}
    }

    insert(data) {
        this.data = data
    }

    select(where) {
        if (where) {
            return this.data.filter((row) => {
                return row[where.key] === where.value
            })
        }

        return this.data
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
    databases,
    existsDatabase,
    dropDatabase
}
