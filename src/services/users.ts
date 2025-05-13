import { deleteUser } from "firebase/auth";
import { ref, get, set, getDatabase } from "firebase/database";

export const fetchUsers = async () => {
    const db = getDatabase();
    const snapshot = await get(ref(db, "users"));
    return snapshot.exists() ? snapshot.val() : {};
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
    
    deleteUser(users[uid])
        .then(()=>{
            set(ref(db, `users/${uid}`), null);
        })
        .catch((e)=>{
            console.error(e);
        });
}