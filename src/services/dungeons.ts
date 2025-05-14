import { get, getDatabase, ref } from "firebase/database";

export const fetchDungeons = async () => {
    const db = getDatabase();
    const snapshot = await get(ref(db, "dungeons"));
    if (!snapshot.exists()) {
        return [];
    }
    const dungeons: any = snapshot.val();
    return dungeons;
};