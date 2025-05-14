import { useEffect, useState } from "react";
import { fetchDungeons } from "../../services/dungeons";

function AdminDungeons() {
    const [dungeonsElements, setDungeonsElements] = useState<any>(null);
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
                        <button className="mg-admin-table-delete" onClick={() => {}}>Delete</button>
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
            </div>
        </>
    );
}

export default AdminDungeons