const helper = require('./helper.js');

//Handles sending the post request
const handlePasswordChange = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector("#username").value;
    const oldPassword = e.target.querySelector("#oldPassword").value;
    const newPassword = e.target.querySelector("#newPassword").value;
    const newPassword2 = e.target.querySelector("#newPassword2").value;
    const _csrf = e.target.querySelector("#_csrf").value;

    //Step 1: Make sure the user has added all parameters
    if (!oldPassword || !newPassword || !newPassword2) {
        helper.handleError('Missing required parameters!');
        return false;
    }

    //Step 3: Make sure the user is not trying to reset their password to the same thing.
    if (oldPassword === newPassword) {
        helper.handleError('New password cannot be the same as old password!');
        return false;
    }

    //Step 4: Make sure the user has entered the same password twice
    if (newPassword !== newPassword2) {
        helper.handleError('New passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, oldPassword, newPassword, newPassword2, _csrf});
};

//Render the form for changing the password
const ChangePassWindow = (props) => {
    return (
        <form id="changePassForm"
        name="changePassForm"
        onSubmit={handlePasswordChange}
        action="/changePass"
        method="POST"
        className='mainForm'>
            <div id="changePasswordHeader">
                <h2>Change Password:</h2>
                <h3>(Warning: Changing Password will log you out!)</h3>
            </div>
            <label htmlFor="username">Username: </label>
            <input id="username" type="text" name="username" placeholder="username" />

            <label htmlFor="pass">Old Password: </label>
            <input id="oldPassword" type="password" name="oldPass" placeholder="password" />

            <label htmlFor="pass2">New Password: </label>
            <input id="newPassword" type="password" name="newPass" placeholder="new password" />

            <label htmlFor="pass2">New Password: </label>
            <input id="newPassword2" type="password" name="newPass2" placeholder="retype new password" />

            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Submit" />
        </form>
    );
};

const init = async () => {
    console.log("Rendering changePass Window")
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <ChangePassWindow csrf={data.csrfToken} />,
        document.getElementById('changePassword')
    );
}

window.onload = init;