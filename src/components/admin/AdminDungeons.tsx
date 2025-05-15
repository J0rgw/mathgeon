import { useEffect, useRef, useState } from "react";
import { createDungeon, deleteDungeonByUid } from "../../services/dungeons";
import McInput from "../McInput";
import AdminFieldEditor from "./AdminFieldEditor";
import { getDatabase, onValue, ref } from "firebase/database";

function AdminDungeons() {
    const [dungeonsElements, setDungeonsElements] = useState<any>(null);
    const [dungeonsUids, setDungeonsUids] = useState("");
    const [dungeonsNames, setDungeonsNames] = useState("");
    const [editorUid, setEditorUid] = useState("");
    const [editorCurrentName, setEditorCurrentName] = useState("");
    const [editorOpen, setEditorOpen] = useState(false);

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
        setDungeonsUids("");
        setDungeonsNames("");
        createDungeon(uid, name);
    }
    function edit(uid: string, currentName: string) {
        setEditorUid(`dungeons/${uid}/name`);
        setEditorCurrentName(currentName);
        setEditorOpen(true);
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
            {<AdminFieldEditor field={editorUid} oldValue={editorCurrentName} open={editorOpen} onClose={() => setEditorOpen(false)}></AdminFieldEditor>}
        </>
    );
}

export default AdminDungeons