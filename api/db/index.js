const inMemory = {}

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

    createTable(name) {
        this.tables[name] = []
    }
}

class Table {
    constructor(name) {
        this.name = name
        this.columns = []
        this.data = []
    }

    insert(data) {
        this.data.push(data)
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
    return Object.keys(inMemory)
}

module.exports = {
    Database, 
    Table, 
    databases
}
