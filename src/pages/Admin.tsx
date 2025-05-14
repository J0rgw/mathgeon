import AdminDungeons from "../components/admin/AdminDungeons";
import AdminUsers from "../components/admin/AdminUsers";

function Admin() {
    return (
        <>
            <h1>Yoo this base is so fire</h1>
            
            <h2>Losers</h2>
            <AdminUsers></AdminUsers>

            <h2>Dungeons</h2>
            <AdminDungeons></AdminDungeons>
        </>
    );
}

export default Admin