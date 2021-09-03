import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Server } from "../service/remote-server";
import CircularProgress from '@material-ui/core/CircularProgress';


function Signin() {
    const [userData, setUserData] = useState({code: ""});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("out");
    console.log(window.location.href);
    const history = useHistory();
    const onChange = (e) => {
        setUserData(() => {
            return {
               code: e.target.value,
            }
        })
    }
    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        Server.misc.getCode()
        .then((response) => {
            if (String(response.data.code) === userData.code) {
                setResult("passed");
                localStorage.setItem("isAuthenticated", "true");
                history.goBack();
            } else {
                setResult("failed");
                localStorage.setItem("isAuthenticated", "false");
            }
            console.log(result);
            setLoading(false);
        })
        .catch((e) => {
            console.log(e);
            localStorage.setItem("isAuthenticated", "false");
            setLoading(false);
        })
    }
    if (loading) {
        return (
        <div>
            <CircularProgress />
        </div>
        )
    } else {
        return (
            <div>
                <h1>您先登录个...</h1>
                <form>
                <label>Code</label>
                <input type="text" onChange={onChange} />
                <button type="submit" onClick={handleSubmit}>想清楚了</button>
                </form>
            </div>
        )
    }
}

export default Signin;