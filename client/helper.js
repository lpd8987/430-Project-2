// CODE REUSED FROM PREVIOUS HW ASSIGNMENT (WITH NEW COMMENTS + ALTERED CONTENT)//
//Displays error message as text the user can see on-screen
const handleError = (message, elements) => {
    let errorMessageElement = document.getElementById('errorMessage');

    for(const elementString of elements){
      const el = document.getElementById(`${elementString}`);
      el.classList.add("is-danger");
    }

    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
    //console.log("IN SENDPOST in HELPER.JS");
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if(result.error) {
      handleError(result.error, []);
    }

    if(result.redirect) {
      window.location = result.redirect;
    }

    if(handler) {
      handler(result);
    }
};

//Hide error messages
const hideError = (elements) => {
    document.getElementById('errorMessage').style.display = 'none';

    for(const elementString of elements){
      const el = document.getElementById(`${elementString}`);
      el.classList.remove("is-danger");
    }
};

module.exports = {
    handleError,
    sendPost,
    hideError
};