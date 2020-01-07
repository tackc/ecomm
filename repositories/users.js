class UsersRepository {
    //constructor functions get called immediately whenever we create a new instance of a class
    constructor(filename) {
        if(!filename) {
            throw new Error('Creating a repository requires a filename')
        }
        
        this.filename = filename;

    }
}

//Testing stuff - cd into the repositories directory and run 'node users.js'...should see the error in Terminal
new UsersRepository();