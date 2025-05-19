import { useEffect, useState } from "react";
import AdminDungeons from "../components/admin/AdminDungeons";
import AdminUsers from "../components/admin/AdminUsers";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { auth } from "../services/firebase";
import { Link, useNavigate } from "react-router-dom";

function Admin() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const db = getDatabase();
                const usernameRef = ref(db, `users/${firebaseUser.uid}`);
                onValue(usernameRef, (snapshot) => {
                    const my = snapshot.val();

                    // Handle account status
                    if (my.status) {
                        if (my.status?.includes("deleted")) {
                            signOut(auth);
                            return;
                        }
                        else if (my.status?.includes("banned")) {
                            console.warn("GTFO of here loser!");
                            navigate("/");
                            return;
                        }
                    }

                    // Handle permissions
                    if (!my.roles?.includes("superAdmin")) {
                        console.warn("Insufficient Permissions!");
                        navigate("/");
                        return;
                    }

                    setIsAdmin(true);
                });
            } else {
                navigate("/");
            }
        });
        return () => unsubscribe();
    }, []);

    if (!isAdmin) {
        return (
            <>
                <h1 className="mg-admin-title">Checking your permissions...</h1>
            </>
        );
    }

    return (
        <>
            <Link className="mg-to-title" to="/">Exit Admin Panel</Link>

            <h1 className="mg-admin-title">Administration Panel</h1>
            
            <h2 className="mg-admin-title">Users</h2>
            <AdminUsers></AdminUsers>

            <h2 className="mg-admin-title">Dungeons</h2>
            <AdminDungeons></AdminDungeons>
        </>
    );
}

export default Admin

function setUser(firebaseUser: User) {
    throw new Error("Function not implemented.");
}
