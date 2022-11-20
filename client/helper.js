// CODE REUSED FROM PREVIOUS HW ASSIGNMENT (WITH NEW COMMENTS + ALTERED CONTENT)//
//Displays error message as text the user can see on-screen
const handleError = (message) => {
    let errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.textContent = message;
    errorMessageElement.classList.remove('hidden');
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if(result.error) {
      handleError(result.error);
    }

    if(result.redirect) {
      window.location = result.redirect;
    }

    if(handler) {
      handler(result);
    }
};

//Hide error messages
const hideError = () => {
    document.getElementById('errorMessage').classList.add('hidden');
};

module.exports = {
    handleError,
    sendPost,
    hideError
};