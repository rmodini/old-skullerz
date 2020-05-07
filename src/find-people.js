import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default function FindPeople() {
    const [lastPeople, setLastPeople] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchUser, setSearchUser] = useState([]);
    useEffect(() => {
        let ignore = false;
        (async () => {
            const { data } = await axios.get("/users");
            if (!ignore) {
                setLastPeople(data);
            }
        })();
        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        let ignore = false;
        (async () => {
            const { data } = await axios.post("/search/users", {
                input: searchInput,
            });
            if (!ignore) {
                setSearchUser(data);
            }
        })();
        return () => {
            ignore = true;
        };
    }, [searchInput]);

    const handleChange = (e) => {
        setSearchInput(e.target.value);
    };

    return (
        <React.Fragment>
            <div>
                <h1>Find people</h1>
                {searchInput == "" && (
                    <div>
                        <h2>Check out our last members!</h2>
                        <h3>
                            {lastPeople.map((user) => {
                                return (
                                    <div key={user.id}>
                                        <Link to={`/user/${user.id}`}>
                                            <div className="user-result-box">
                                                <div className="img-box">
                                                    <img
                                                        className="result-profile-pic"
                                                        src={user.img_url}
                                                    />
                                                </div>
                                                <p className="user-name">{`${user.first} ${user.last}`}</p>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </h3>
                    </div>
                )}
                <h2>Are you looking for someone in particular?</h2>
                <input
                    name="searchInput"
                    onChange={handleChange}
                    autoComplete="off"
                    placeholder="enter name"
                ></input>

                {searchInput != "" && (
                    <h3>
                        {searchUser.map((user) => {
                            return (
                                <div key={user.id}>
                                    <Link to={`/user/${user.id}`}>
                                        <div className="user-result-box">
                                            <div className="img-box">
                                                <img
                                                    className="result-profile-pic"
                                                    src={user.img_url}
                                                />
                                            </div>
                                            <p className="user-name">{`${user.first} ${user.last}`}</p>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </h3>
                )}
                {searchUser.length == 0 && searchInput != "" && (
                    <h3>No results for {`"${searchInput}"`}</h3>
                )}
            </div>
        </React.Fragment>
    );
}
