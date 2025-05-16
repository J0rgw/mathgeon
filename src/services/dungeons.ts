import { get, getDatabase, ref, set } from "firebase/database";

export const fetchDungeons = async () => {
    const db = getDatabase();
    const snapshot = await get(ref(db, "dungeons"));
    if (!snapshot.exists()) {
        return [];
    }
    const dungeons: any = snapshot.val();
    return dungeons;
};

export enum DungeonErrorType {
    NO_SNAPSHOT,
    NO_USER_WITH_UID
}

export const deleteDungeonByUid = async (uid: string) => {
    const db = getDatabase();
    const snapshot = await get(ref(db, "dungeons"));
    
    if (!snapshot.exists()) {
        throw DungeonErrorType.NO_SNAPSHOT;
    }
    
    const users = snapshot.val();
    
    if (!users[uid]) {
        throw DungeonErrorType.NO_USER_WITH_UID;
    }

    set(ref(db, `dungeons/${uid}`), null);
}

export const createDungeon = async (uid: string, name: string) => {
    const db = getDatabase();
    set(ref(db, `dungeons/${uid}`), {name: name});
}