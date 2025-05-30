import { useEffect, useRef, useState } from "react";
import McInput from "../McInput";
import McButton from "../McButton";
import { set } from "../../services/firebase";

export type AdminFieldEditorProps = {
    field: string, // path to firebase registry
    onClose: VoidFunction, // would be unclosable without this
    oldValue?: string,
    open?: boolean,
}

function AdminFieldEditor(props: AdminFieldEditorProps) {
    const dialog = useRef<null | HTMLDialogElement>(null);
    const [newValue, setNewValue] = useState(props.oldValue ?? "");

    useEffect(() => {
        if (props.open) {
            dialog.current?.showModal();
        };
    });

    function persist() {
        props.onClose(); // fix visibility issues by not waiting for the event to fire
        set(props.field, newValue);
        dialog.current?.close();
    }

    return (
        <dialog className="mg-admin-field-editor" ref={dialog} onClose={props.onClose} onToggle={()=>{setNewValue(props.oldValue ?? "")}}>
            <h2>Editing <span style={{color: "#144524"}}>{props.field}</span></h2>
            <div>
                <label htmlFor="editor-field">New Value:</label>
                <McInput id="editor-field" onChange={(e)=>{setNewValue(e.target.value)}} value={newValue} placeholder={props.oldValue ?? ""}></McInput>
                <McButton onClick={persist}>Save</McButton>
            </div>
        </dialog>
    );
}

export default AdminFieldEditor