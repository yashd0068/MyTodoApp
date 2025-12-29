import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FacebookCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");

        fetch("http://localhost:5000/api/auth/facebook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem("token", data.token);
                navigate("/home");
            });
    }, []);

    return <button className=" "> Facebook...</button>;
}
