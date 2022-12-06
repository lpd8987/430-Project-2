// CODE REUSED FROM PREVIOUS HW ASSIGNMENT + NEW ADDITIONS//
const helper = require('./helper.js');

//Event handlers
const handleLogin = (e) => {
    const elementIds = ['user', 'pass'];

    e.preventDefault();
    helper.hideError(elementIds);

    
    const username = e.target.querySelector("#user").value;
    const pass = e.target.querySelector("#pass").value;
    const _csrf = e.target.querySelector("#_csrf").value;

    if(!username || !pass) {
        helper.handleError('Username or password is empty!', elementIds);
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, _csrf});

    return false;
};

const handleSignup = (e) => {
    const elementIds = ['user', 'pass', 'pass2'];

    e.preventDefault();
    helper.hideError(elementIds);

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const _csrf = e.target.querySelector("#_csrf").value;

    if(!username || !pass || !pass2) {
        helper.handleError('All fields are required!', elementIds);
        return false;
    }

    if (pass !== pass2) {
        helper.handleError('Passwords do not match', elementIds);
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2, _csrf});

    return false;
};

//Login JSX content
const LoginWindow = (props) => {
    return (
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm box"
        >
            <h3 className="title is-3"><u>Login</u></h3>
            <label className="label" htmlFor="username">Username: </label>
            <input className="input" id="user" type="text" name="username" placeholder="username" />

            <label className="label" htmlFor="pass">Password: </label>
            <input className="input" id="pass" type="password" name="pass" placeholder="password" />

            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />

            <input className="formSubmit button mt-3 is-success" type="submit" value="Sign in" />
        </form>
    );
};

//Signup JSX content
const SignupWindow = (props) => {
    return (
        <form id="signupForm"
        name="signupForm"
        onSubmit={handleSignup}
        action="/signup"
        method="POST"
        className="mainForm box"
        >
            <h3 className="title is-3"><u>Signup</u></h3>
            <label className="label" htmlFor="username">Username: </label>
            <input className="input" id="user" type="text" name="username" placeholder="username" />

            <label className="label" htmlFor="pass">Password: </label>
            <input className="input" id="pass" type="password" name="pass" placeholder="password" />

            <label className="label" htmlFor="pass2">Retype Password: </label>
            <input className="input" id="pass2" type="password" name="pass2" placeholder="retype password" />

            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />

            <input className="formSubmit button mt-3 is-success" type="submit" value="Signup" />
        </form>
    );
};


//Setup the page
const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        helper.hideError([]);
        ReactDOM.render(<LoginWindow csrf={data.csrfToken} />,
            document.getElementById('content'));

        loginButton.classList.add('is-success');
        signupButton.classList.remove('is-success');

        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        helper.hideError([]);

        ReactDOM.render(<SignupWindow csrf={data.csrfToken} />,
            document.getElementById('content'));

        loginButton.classList.remove('is-success');
        signupButton.classList.add('is-success');

        return false;
    });

    ReactDOM.render(<LoginWindow csrf={data.csrfToken} />,
        document.getElementById('content'));
};

window.onload = init;