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
    NO_USER_WITH_UID,
}

export const deleteDungeonByUid = async (uid: string) => {
    const db = getDatabase();
    // const dungeonSnapshot = await get(ref(db, "dungeons"));
    
    // if (!dungeonSnapshot.exists()) {
    //     throw DungeonErrorType.NO_SNAPSHOT;
    // }
    
    // const dungeons = dungeonSnapshot.val();
    
    // if (!dungeons[uid]) {
    //     throw DungeonErrorType.NO_USER_WITH_UID;
    // }

    // set(ref(db, `dungeons/${uid}`), null);

    // Cascade (delete high scores for this dungeon)
    const userProgressSnaphot = await get(ref(db, "userProgress"));
    // If the table doesn't exist (HOW???), return. There's nothing to delete from a non-existent table
    if (!userProgressSnaphot.exists()) return;

    const userProgress = userProgressSnaphot.val()

    for (const upInstance in userProgress) {
        if (Object.hasOwn(userProgress[upInstance], uid))
            console.log("has it");
    }
}

export const createDungeon = async (uid: string, name: string) => {
    const db = getDatabase();
    set(ref(db, `dungeons/${uid}`), {name: name});
}