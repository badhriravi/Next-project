import { useRouter } from "next/router";
import React from "react";
import { getData, hello } from "../helpers/constants";


export default function BaseballPlayers() {
    var router = useRouter();    
    var id = router.query["token"];
    console.log("here", id);

    React.useEffect(() => {
        // POST request using fetch inside useEffect React hook
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "magic_token": id })
        };
        fetch('https://xs8g-hdcn-kjia.m2.xano.io/api:6hazS0TY/auth/magic-login', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));  //console

        // empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, []);



    return (
        <div>

            <h1>ID: {id}</h1> 
            {/* //front */}
            <h2>{hello}</h2>
            <h3>{getData()}</h3>
        </div>
    );
}
















