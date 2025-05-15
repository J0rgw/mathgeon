import { useEffect, useRef, useState } from "react";
import McInput from "../McInput";
import McButton from "../McButton";
import { set } from "../../services/firebase";

export type AdminFieldEditorProps = {
    field: string, // path to firebase registry
    oldValue?: string
}

function AdminFieldEditor(props: AdminFieldEditorProps) {
    const dialog = useRef<null | HTMLDialogElement>(null);
    const [newValue, setNewValue] = useState(props.oldValue ?? "");

    useEffect(() => {
        dialog.current?.showModal();
    }, []);

    function persist() {
        set(props.field, newValue);
        dialog.current?.close();
    }

    return (
        <dialog className="mg-admin-field-editor" ref={dialog}>
            <h2>Editing <span style={{color: "#e79333"}}>{props.field}</span></h2>
            <div>
                <label>New Value:</label>
                <McInput onChange={(e)=>{setNewValue(e.target.value)}} value={newValue} placeholder={props.oldValue ?? ""}></McInput>
                <McButton onClick={persist}>Save</McButton>
            </div>
        </dialog>
    );
}

export default AdminFieldEditor