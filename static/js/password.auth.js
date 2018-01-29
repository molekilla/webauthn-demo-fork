'use strict';
/* Handle for register form submission */
$('#register').submit(function (event) {
    event.preventDefault();

    let username = this.username.value;
    let name = this.name.value;

    if (!username || !name) {
        alert('Name or username is missing!')
        return
    }

    getMakeCredentialsChallenge({
            username,
            name
        })
        .then((response) => {
            let publicKey = preformatMakeCredReq(response);
            return navigator.credentials.create({
                publicKey
            })
        })
        .then((response) => {
            let makeCredResponse = publicKeyCredentialToJSON(response);
            return sendWebAuthnResponse(makeCredResponse)
        })
        .then((response) => {
            if (response.status === 'ok') {
                loadMainContainer()
            } else {
                alert(`Server responed with error. The message is: ${response.message}`);
            }
        })
        .catch((error) => alert(error))


})
/* Handle for login form submission */
$('#login').submit(function(event) {
    event.preventDefault();

    let username = this.username.value;

    if(!username) {
        alert('Username is missing!')
        return
    }

    getGetAssertionChallenge({username})
        .then((response) => {
            let publicKey = preformatGetAssertReq(response);
            return navigator.credentials.get({ publicKey })
        })
        .then((response) => {
            let getAssertionResponse = publicKeyCredentialToJSON(response);
            return sendWebAuthnResponse(getAssertionResponse)
        })
        .then((response) => {
            if(response.status === 'ok') {
                loadMainContainer()   
            } else {
                alert(`Server responed with error. The message is: ${response.message}`);
            }
        })
        .catch((error) => alert(error))
})