import React, { useEffect, useState } from "react";
import { deleteUserByUid, fetchUsers } from "../../services/users";
import { User } from "firebase/auth";

import '../../styles/admin.css';

function AdminUsers() {
    const [usersElements, setUsersElements] = useState<any>(null);
    useEffect(() => {
        fetchUsers()
            .then((users)=>{
                setUsersElements(buildTable(users));
            });
    }, []);

    function murder(uid: string) {
        deleteUserByUid(uid)
            .then(()=>{
                console.log("deletus");
                
                fetchUsers()
                    .then((users)=>{
                        setUsersElements(buildTable(users));
                        console.log("regen");
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