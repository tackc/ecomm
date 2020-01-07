const fs = require('fs')

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
        const records = await this.getAll();
        records.push(attrs);

        // write the updated records array to this.filename
        await fs.promises.writeFile(this.filename, JSON.stringify(records))
    }
}

//Testing stuff - cd into the repositories directory and run 'node users.js'...should see the error in Terminal
const test = async () => {
    const repo = new UsersRepository('users.json');

    await repo.create({ email: 'test@test.com', password: 'password' })
    
    //this is only being placed inside test() because older versions of node do not support top level 'await' statements
    const users = await repo.getAll();

    console.log(users)
};

test();