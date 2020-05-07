import axios from "axios";

// this copy would be used evrey time we require axios
const copy = axios.create({
    xsrfCookieName: "mytoken",
    xsrfHeaderName: "csrf-token"
});

export default copy;
