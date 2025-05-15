import { useEffect, useState } from "react";
import { createDungeon, deleteDungeonByUid } from "../../services/dungeons";
import McInput from "../McInput";
import AdminFieldEditor from "./AdminFieldEditor";
import { getDatabase, onValue, ref } from "firebase/database";

function AdminDungeons() {
    const [dungeonsElements, setDungeonsElements] = useState<any>(null);
    const [dungeonsUids, setDungeonsUids] = useState("");
    const [dungeonsNames, setDungeonsNames] = useState("");
    const [fieldEditor, setFieldEditor] = useState<React.JSX.Element | null>(null);

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, "dungeons");
        const unsubscribeFn = onValue(reference, (snapshot) => {
            if (snapshot.exists()) {
                setDungeonsElements(buildTable(snapshot.val()));
            } else {
                console.error("Couldn't obtain dungeon data from database");
            }
        })

        return ()=>{
            unsubscribeFn();
        }
    }, []);

    function remove(uid: string) {
        deleteDungeonByUid(uid);
    }
    function create(uid: string, name: string) {
        createDungeon(uid, name);
    }
    function edit(uid: string, currentName: string) {
        setFieldEditor(<AdminFieldEditor field={`dungeons/${uid}/name`} oldValue={currentName}></AdminFieldEditor>);
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
                        <button className="mg-admin-table-ban" onClick={() => {edit(uid, dungeons[uid].name)}}>Edit</button>
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
            {fieldEditor}
        </>
    );
}

export default AdminDungeons