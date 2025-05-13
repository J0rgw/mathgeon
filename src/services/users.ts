import { deleteUser } from "firebase/auth";
import { ref, get, set, getDatabase } from "firebase/database";

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
            console.log(users[uid]?.status);
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
        return UserErrorType.NO_SNAPSHOT;
    }
    
    const users = snapshot.val();
    
    if (!users[uid]) {
        return UserErrorType.NO_USER_WITH_UID;
    }

    let userStatus: any[] = users[uid].status ?? [];
    userStatus.push("deleted");
    set(ref(db, `users/${uid}/status`), userStatus);
}