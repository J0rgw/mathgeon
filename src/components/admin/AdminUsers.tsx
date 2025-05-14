import React, { useEffect, useState } from "react";
import { banUserByUid, deleteUserByUid, fetchUsers, unbanUserByUid } from "../../services/users";
import { User } from "firebase/auth";

import '../../styles/admin.css';

function AdminUsers() {
    const [usersElements, setUsersElements] = useState<any>(null);
    useEffect(() => {
        const interval = setInterval(() => {
            fetchUsers()
                .then((users)=>{
                    setUsersElements(buildTable(users));
                });
        }, 1000);

        return ()=>{
            clearInterval(interval);
        }
    }, []);

    function murder(uid: string) {
        deleteUserByUid(uid)
            .then(()=>{
                // console.log("I can't believe he's fucking dead!");
                fetchUsers()
                    .then((users)=>{
                        setUsersElements(buildTable(users));
                    });
            })
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
                fetchUsers()
                    .then((users)=>{
                        setUsersElements(buildTable(users));
                    });
            })
    }
    function unban(uid: string) {
        unbanUserByUid(uid)
            .then(()=>{
                console.log("!knoB");
                fetchUsers()
                    .then((users)=>{
                        setUsersElements(buildTable(users));
                    });
            })
    }

    function buildTable(users: any) {
        let usersReact = [];
        for (const uid in users) {
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