import React, { useEffect, useState } from "react";
import { banUserByUid, deleteUserByUid, fetchUsers, unbanUserByUid } from "../../services/users";

import '../../styles/admin.css';
import { getDatabase, onValue, ref } from "firebase/database";

function AdminUsers() {
    const [usersElements, setUsersElements] = useState<any>(null);
    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, "users");
        const unsubscribeFn = onValue(reference, (snapshot) => {
            if (snapshot.exists()) {
                setUsersElements(buildTable(snapshot.val()));
            } else {
                console.error("Couldn't obtain user data from database");
            }
        })

        return ()=>{
            unsubscribeFn();
        }
    }, []);

    function murder(uid: string) {
        deleteUserByUid(uid)
            .then(()=>{
                console.log("player murdered successfully");
            });
    }
    
    function isBanned(user: any) {
        if (!user.status) {
            return false;
        }
        return user.status?.includes("banned");
    }
    function ban(uid: string) {
        banUserByUid(uid)
            .then(()=>{
                console.log("Bonk!");
            })
    }
    function unban(uid: string) {
        unbanUserByUid(uid)
            .then(()=>{
                console.log("!knoB");
            })
    }

    function buildTable(users: any) {
        let usersReact = [];
        for (const uid in users) {
            if (users[uid]?.status?.includes("deleted")) {
                continue;
            }

            usersReact.push(
                <div key={uid} className="mg-admin-table-data">
                    <div>
                        <p>{users[uid].username}</p>
                        <p>{users[uid].email}</p>
                    </div>
                    <div>
                        {isBanned(users[uid]) ?
                            <button className="mg-admin-table-unban" onClick={() => unban(uid)}>Unban</button>
                        :
                            <button className="mg-admin-table-ban" onClick={() => ban(uid)}>Ban</button>
                        }
                        <button className="mg-admin-table-delete" onClick={() => murder(uid)}>Delete</button>
                    </div>
                </div>
            )
        }
        return usersReact;
    }
    
    return (
        <div className="mg-admin-table">
            {usersElements}
        </div>
    );
}

export default AdminUsers