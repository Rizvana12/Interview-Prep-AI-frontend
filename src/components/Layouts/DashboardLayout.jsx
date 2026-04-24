import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../Context/userContext";
import Navbar from "../Inputs/Navbar";

const DashboardLayout = ({ children }) => {
    const { user, loading } = useContext(UserContext);
    const token = localStorage.getItem("token");

    if (!token && !loading) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <Navbar />
            <div>{children}</div>
        </div>
    );
};

export default DashboardLayout;