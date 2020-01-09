const fs = require('fs');
const crypto = require('crypto');

class UsersRepository {
    //constructor functions get called immediately whenever we create a new instance of a class
    //constructor functions are not allowed to be async in nature...that's why we are using fs.accessSync...normally not used much because there is no callback (it's not asynchronous)
    constructor(filename) {
        if(!filename) {
            throw new Error('Creating a repository requires a filename')
        }

        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]')
        }
    }

    async getAll() {
        return JSON.parse(
            await fs.promises.readFile(this.filename, {
                encoding: 'utf8'
            })
        );
    }

    async create(attrs) {
        attrs.id = this.randomId();

        const records = await this.getAll();
        records.push(attrs);

        await this.writeAll(records);
    }

    async writeAll(records) {
        // write the updated records array to this.filename
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 4))
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Error(`Record with id ${id} not found`);
        }

        //takes the info in the second argument and adds it to the first argument
        Object.assign(record, attrs);
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();
        
        for (let record of records) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }
            if (found) {
                return record;
            }
        }
    }
}

module.exports = new UsersRepository('users.json');

// down side to exporting as below is that it exports the entire Class...we only want to export an instance of the Class
// module.exports = UsersRepository;