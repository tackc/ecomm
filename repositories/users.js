const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
    async comparePasswords(saved, supplied) {
        // Saved -> password saved in database (hashed.salt)
        // Supplied -> password given to us by user trying to sign in
        const [hashed, salt] = saved.split('.');
        // Make sure the number below matches the one create method above
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

        // Remember this is a buffer
        return hashed === hashedSuppliedBuf.toString('hex');
    }
    
    async create(attrs) {
        // attrs = { email: '', password: '' }
        attrs.id = this.randomId();

        // every byte returns back 2 characters
        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64);
    
        const records = await this.getAll();
        // We are adding a period in-between the password + salt and storing just the salt after the period
        const record = {
            ...attrs,
            password: `${buf.toString('hex')}.${salt}`
        }
        records.push(record);
    
        await this.writeAll(records);
    
        return record;
    }
}

module.exports = new UsersRepository('users.json');

// down side to exporting as below is that it exports the entire Class...we only want to export an instance of the Class
// module.exports = UsersRepository;