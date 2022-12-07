const helper = require('./helper.js');

//Handles sending the post request to change password
const handlePasswordChange = (e) => {
    e.preventDefault();

    const oldPassword = e.target.querySelector("#oldPassword").value;
    const newPassword = e.target.querySelector("#newPassword").value;
    const newPassword2 = e.target.querySelector("#newPassword2").value;
    const _csrf = e.target.querySelector("#_csrf").value;

    //Step 1: Make sure the user has added all parameters
    if (!oldPassword || !newPassword || !newPassword2) {
        helper.handleError('Missing required parameters!', ['oldPassword', 'newPassword', 'newPassword2']);
        return false;
    }

    //Step 3: Make sure the user is not trying to reset their password to the same thing.
    if (oldPassword === newPassword) {
        helper.handleError('New password cannot be the same as old password!', ['oldPassword', 'newPassword']);
        return false;
    }

    //Step 4: Make sure the user has entered the same password twice
    if (newPassword !== newPassword2) {
        helper.handleError('New passwords do not match!', ['newPassword','newPassword2']);
        return false;
    }

    helper.sendPost(e.target.action, {oldPassword, newPassword, newPassword2, _csrf});
};

//Handles sending post request to change username
const handleUsernameChange = (e) => {
    e.preventDefault();

    const newUsername = e.target.querySelector("#newUsername").value;
    const _csrf = e.target.querySelector("#_csrf").value;

    //Step 1: Make sure the user has added a parameter
    if (!newUsername) {
        helper.handleError('Missing required parameters!', ['newUsername']);
        return false;
    }

    helper.sendPost(e.target.action, {newUsername, _csrf});
};

/*Sends a post request that includes just a users username and password
and handles it according to its form action*/
const handleCredentialsPost = (e) => {
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

//REACT Components
//Render the form for changing the password
const ChangePassWindow = (props) => {
    return (
        <form id="changePassForm"
        name="changePassForm"
        onSubmit={handlePasswordChange}
        action="/changePass"
        method="POST"
        className='mainForm box'>
            <div id="changePasswordHeader">
                <h2 className='title is-underlined'>Change Password:</h2>
                <h3 className='subtitle has-text-danger'>(Warning: Changing Password will log you out!)</h3>
            </div>
            <label className="label" htmlFor="pass">Old Password: </label>
            <input className="input"id="oldPassword" type="password" name="oldPass" placeholder="password" />

            <label className="label" htmlFor="pass2">New Password: </label>
            <input className="input" id="newPassword" type="password" name="newPass" placeholder="new password" />

            <label className="label" htmlFor="pass2">New Password: </label>
            <input className="input" id="newPassword2" type="password" name="newPass2" placeholder="retype new password" />

            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit button mt-3 is-danger" type="submit" value="Submit" />
        </form>
    );
};

//Render the form for changing username
const ChangeUsernameWindow = (props) => {
    return (
        <form id="changeUserForm"
        name="changeUserForm"
        onSubmit={handleUsernameChange}
        action="/changeUser"
        method="POST"
        className='mainForm box'>
            <h2 className="title is-3 is-underlined">Change Username:</h2>
            <h3 className='subtitle'>(Username will change immediately if it is not already taken)</h3>

            <label className="label" htmlFor="newUsername">New Username: </label>
            <input className="input"id="newUsername" type="text" name="newUsername" placeholder="new username" />

            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="button mt-3 is-warning" type="submit" value="Submit" />
        </form>
    );
};

const DeleteAccountWindow = (props) => {
    return (
        <form id="deleteForm"
            name="deleteForm"
            onSubmit={handleCredentialsPost}
            action="/deleteAccount"
            method="POST"
            className="mainForm box"
        >
            <h3 className="title is-3 is-underlined">Delete Account</h3>
            <h2 className='subtitle has-text-danger'>Enter your credentials below to delete your account</h2>
            <label className="label" htmlFor="username">Username: </label>
            <input className="input" id="user" type="text" name="username" placeholder="username" />

            <label className="label" htmlFor="pass">Password: </label>
            <input className="input" id="pass" type="password" name="pass" placeholder="password" />

            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />

            <input className="formSubmit button mt-3 is-danger" type="submit" value="Delete my Account" />
        </form>
    );
}

const ResetScoreWindow = (props) => {
    return (
        <form id="resetForm"
            name="resetForm"
            onSubmit={handleCredentialsPost}
            action="/resetHighScore"
            method="POST"
            className="mainForm box"
        >
            <h3 className="title is-3 is-underlined">Reset Account Data</h3>
            <h2 className='subtitle'>This will erase your high score data.</h2>
            <label className="label" htmlFor="username">Username: </label>
            <input className="input" id="user" type="text" name="username" placeholder="username" />

            <label className="label" htmlFor="pass">Password: </label>
            <input className="input" id="pass" type="password" name="pass" placeholder="password" />

            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />

            <input className="formSubmit button mt-3 is-warning" type="submit" value="Reset my High Score" />
        </form>
    );
}


const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const changeUserBtn = document.getElementById('changeUserBtn');
    const changePassBtn = document.getElementById('changePassBtn');
    const eraseDataBtn = document.getElementById('eraseDataBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');

    //CHANGE USER
    changeUserBtn.addEventListener('click', (e) => {
        e.preventDefault();

        ReactDOM.render(
            <ChangeUsernameWindow csrf={data.csrfToken} />,
            document.getElementById('editForm')
        );

        helper.hideError(['newUsername']);

        changeUserBtn.classList.add("is-primary");
        changePassBtn.classList.remove("is-primary");
        eraseDataBtn.classList.remove("is-primary");
        deleteAccountBtn.classList.remove("is-primary");
    });

    //CHANGE PASSWORD
    changePassBtn.addEventListener('click', (e) => {
        e.preventDefault();

        ReactDOM.render(
            <ChangePassWindow csrf={data.csrfToken} />,
            document.getElementById('editForm')
        );

        helper.hideError(['oldPassword', 'newPassword', 'newPassword2']);

        changeUserBtn.classList.remove("is-primary");
        changePassBtn.classList.add("is-primary");
        eraseDataBtn.classList.remove("is-primary");
        deleteAccountBtn.classList.remove("is-primary");
    });

    //ERASE CURRENT HIGH SCORE
    eraseDataBtn.addEventListener('click', (e) => {
        e.preventDefault();

        ReactDOM.render(
            <ResetScoreWindow csrf={data.csrfToken} />,
            document.getElementById('editForm')
        );

        helper.hideError(['user', 'pass']);

        changeUserBtn.classList.remove("is-primary");
        changePassBtn.classList.remove("is-primary");
        eraseDataBtn.classList.add("is-primary");
        deleteAccountBtn.classList.remove("is-primary");
    });

    //DELETE USER ACCOUNT
    deleteAccountBtn.addEventListener('click', (e) => {
        e.preventDefault();

        ReactDOM.render(
            <DeleteAccountWindow csrf={data.csrfToken} />,
            document.getElementById('editForm')
        );

        helper.hideError(['user', 'pass']);

        changeUserBtn.classList.remove("is-primary");
        changePassBtn.classList.remove("is-primary");
        eraseDataBtn.classList.remove("is-primary");
        deleteAccountBtn.classList.add("is-primary");
    });
}

window.onload = init;