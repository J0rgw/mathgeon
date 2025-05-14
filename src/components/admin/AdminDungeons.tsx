import { useEffect, useState } from "react";
import { createDungeon, deleteDungeonByUid, fetchDungeons } from "../../services/dungeons";
import McInput from "../McInput";
import AdminFieldEditor from "./AdminFieldEditor";

function AdminDungeons() {
    const [dungeonsElements, setDungeonsElements] = useState<any>(null);
    const [dungeonsUids, setDungeonsUids] = useState("");
    const [dungeonsNames, setDungeonsNames] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            fetchDungeons()
                .then((dungeons)=>{
                    setDungeonsElements(buildTable(dungeons));
                });
        }, 1000);

        return ()=>{
            clearInterval(interval);
        }
    }, []);

    function remove(uid: string) {
        deleteDungeonByUid(uid)
            .then(()=>{
                fetchDungeons()
                    .then((dungeons)=>{
                        setDungeonsElements(buildTable(dungeons));
                    });
            })
    }
    function create(uid: string, name: string) {
        createDungeon(uid, name)
            .then(()=>{
                fetchDungeons()
                    .then((dungeons)=>{
                        setDungeonsElements(buildTable(dungeons));
                    });
            })
    }

    function buildTable(dungeons: any) {
        let dungeonsReact = [];
        for (const uid in dungeons) {
            dungeonsReact.push(
                <div key={uid} className="mg-admin-table-data">
                    <div>
                        <p>{uid}</p>
                        <p>{dungeons[uid].name}</p>
                    </div>
                    <div>
                        <button className="mg-admin-table-ban" onClick={() => {}}>Edit</button>
                        <button className="mg-admin-table-delete" onClick={() => remove(uid)}>Delete</button>
                    </div>
                </div>
            )
        }
        return dungeonsReact;
    }

    return (
        <>
            <div className="mg-admin-table">
                {dungeonsElements}
                <div className="mg-admin-table-data">
                    <div>
                        <McInput onChange={(e)=>{setDungeonsUids(e.target.value)}} value={dungeonsUids} placeholder="UID"></McInput>
                        <McInput onChange={(e)=>{setDungeonsNames(e.target.value)}} value={dungeonsNames} placeholder="Name"></McInput>
                    </div>
                    <div>
                        <button className="mg-admin-table-create" onClick={() => create(dungeonsUids, dungeonsNames)}>Create!</button>
                    </div>
                </div>
            </div>
            <AdminFieldEditor field="dungeons/Cream-of-Mushroom/name" oldValue="Cream of Mushroom"></AdminFieldEditor>
        </>
    );
}

export default AdminDungeons