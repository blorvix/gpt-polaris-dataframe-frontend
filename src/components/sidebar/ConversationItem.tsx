import { Conversation } from "#/types/chat"
import { useConfirm } from "material-ui-confirm";

const ConversationItem = (props: { conv: Conversation, onDelete: any, onClick: any, selected: boolean }) => {
    const confirm = useConfirm()

    const deleteItem = () => {
        confirm({ description: 'Do you really want to delete this conversation?' })
            .then(() => {
                props.onDelete(props.conv.id)
            })
    }

    return (
        <div className={"conversation " + (props.selected ? 'selected' : '')} data-convid={props.conv.id} onClick={() => props.onClick(props.conv.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-message icon"><path d="M8 9h8"></path><path d="M8 13h6"></path><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"></path></svg>
            <div className="name">{props.conv.name || "Conversation"}</div>
            {/* <div className="action edit">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-pencil"><path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path><path d="M13.5 6.5l4 4"></path></svg>
            </div> */}
            <div className="action remove" onClick={deleteItem}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-trash"><path d="M4 7l16 0"></path><path d="M10 11l0 6"></path><path d="M14 11l0 6"></path><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path></svg>
            </div>
        </div>
    )
}

export default ConversationItem;
