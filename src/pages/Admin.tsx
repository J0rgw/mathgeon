import AdminDungeons from "../components/admin/AdminDungeons";
import AdminUsers from "../components/admin/AdminUsers";

function Admin() {
    return (
        <>
            <h1 className="mg-admin-title">Yoo this base is so fire</h1>
            
            <h2 className="mg-admin-title">Losers</h2>
            <AdminUsers></AdminUsers>

            <h2 className="mg-admin-title">Dungeons</h2>
            <AdminDungeons></AdminDungeons>
        </>
    );
}

export default Admin