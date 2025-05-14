import { useEffect, useRef, useState } from "react";
import McInput from "../McInput";
import McButton from "../McButton";

export type AdminFieldEditorProps = {
    field: string, // path to firebase registry
    oldValue?: string
}

function AdminFieldEditor(props: AdminFieldEditorProps) {
    const dialog = useRef<null | HTMLDialogElement>(null);
    const [newValue, setNewValue] = useState("");

    // useEffect(() => {
    //     dialog?.current?.showModal();
    // });

    return (
        <dialog className="mg-admin-field-editor" ref={dialog}>
            <h2>Editing <span style={{color: "#e79333"}}>{props.field}</span></h2>
            <div>
                <label>New Value:</label>
                <McInput onChange={(e)=>{setNewValue(e.target.value)}} value={newValue} placeholder={props.oldValue ?? ""}></McInput>
                <McButton onClick={()=>{}}>Save</McButton>
            </div>
        </dialog>
    );
}

export default AdminFieldEditor