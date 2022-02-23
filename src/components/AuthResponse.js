import React, {useState, useEffect} from "react"



const AuthResponse = (props) => {
    var OAuth =  require('@zalando/oauth2-client-js')
    var rav = new OAuth.Provider({
        id: 'rav',
        authorization_url: 'https://www.ravelry.com/oauth2/auth'
        
    })

    let response

    if (response == undefined) {
        // Create a new request
        var request = new OAuth.Request({
            client_id: '56b73fe8a72ade0a563541ec119d869d',  // required
            redirect_uri: 'https://localhost:3000/oauth'
        });
        

    // Give it to the provider
    var uri = rav.requestToken(request);

    // Later we need to check if the response was expected
    // so save the request
    rav.remember(request);

    // Do the redirect
    window.location.href = uri;
    }
    
    return <div>Auth response component</div>

}

export default AuthResponse