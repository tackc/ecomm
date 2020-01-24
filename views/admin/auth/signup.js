const layout = require('../layout')

const getError = (errors, prop) => {
    // prop === 'email' || 'password' || 'passwordConfirmation'
    try {
        return errors.mapped()[prop].msg;
        // errors.mapped is going to return an object with props ONLY IF THEY EXIST. That's why we are using a try / catch statement instead of an if statement. This is a cheat. Series of if statements would be the "right" way
    } catch (err) {
        return '';
    }
}

module.exports = ({ req, errors }) => {
    return layout({ 
        content: `
            <div>
                Your id is: ${req.session.userId}
                <form method="POST">
                    <input name="email" placeholder="email" />
                    ${getError(errors, 'email')}
                    <input name="password" placeholder="password" />
                    ${getError(errors, 'password')}
                    <input name="passwordConfirmation" placeholder="password confirmation" />
                    ${getError(errors, 'passwordConfirmation')}
                    <button>Sign Up</button>
                </form>
            </div>
        `
    });
};