import { deleteUser } from "firebase/auth";
import { ref, get, set, getDatabase } from "firebase/database";
import { auth } from "./firebase";

export const fetchUsers = async () => {
    const db = getDatabase();
    const snapshot = await get(ref(db, "users"));
    if (!snapshot.exists()) {
        return [];
    }
    const users: any = snapshot.val();
    const users2: any = [];
    for (const uid in users) {
        if (
            !users[uid]?.status ||
            !users[uid]?.status?.includes("deleted")
        ) {
            // console.log(users[uid]?.status);
            users2[uid] = users[uid];
        }
    }
    return users2;
};

export enum UserErrorType {
    NO_SNAPSHOT,
    NO_USER_WITH_UID
}

export const deleteUserByUid = async (uid: string) => {
    const db = getDatabase();
    const snapshot = await get(ref(db, "users"));
    
    if (!snapshot.exists()) {
        throw UserErrorType.NO_SNAPSHOT;
    }
    
    const users = snapshot.val();
    
    if (!users[uid]) {
        throw UserErrorType.NO_USER_WITH_UID;
    }

    let userStatus: any[] = users[uid].status ?? [];
    if (!userStatus.includes("deleted")) userStatus.push("deleted");
    set(ref(db, `users/${uid}/status`), userStatus);
}
export const banUserByUid = async (uid: string) => {
    banOrUnbanUserByUid(uid, true)
}
export const unbanUserByUid = async (uid: string) => {
    banOrUnbanUserByUid(uid, false)
}
const banOrUnbanUserByUid = async (uid: string, ban: boolean) => {
    const db = getDatabase();
    const snapshot = await get(ref(db, "users"));
    
    if (!snapshot.exists()) {
        throw UserErrorType.NO_SNAPSHOT;
    }
    
    const users = snapshot.val();
    
    if (!users[uid]) {
        throw UserErrorType.NO_USER_WITH_UID;
    }

    let userStatus: any[] = users[uid].status ?? [];
    if (ban) {
        if (!userStatus.includes("banned")) userStatus.push("banned");
    } else {
        if (userStatus.includes("banned")) userStatus.splice(userStatus.indexOf("banned"), 1);
    }
    set(ref(db, `users/${uid}/status`), userStatus);
}


export const amIAdmin = async () => {
    if (auth.currentUser == null) {
        return false;
    }

    const db = getDatabase();
    const snapshot = await get(ref(db, "users"));
    
    if (!snapshot.exists()) {
        throw UserErrorType.NO_SNAPSHOT;
    }
    
    const users = snapshot.val();
    
    if (!users[auth.currentUser.uid]) {
        throw UserErrorType.NO_USER_WITH_UID;
    }

    // Comprobar si tenemos el rol de super admin
    const myRoles = users[auth.currentUser.uid].roles ?? [];
    if (myRoles.includes("superAdmin")) {
        return true;
    }
    return false;
}
