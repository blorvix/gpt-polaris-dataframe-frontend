import { useState } from "react";

const InsightsConv = (props: {dataset_id: number}) => {
    const [conversationStarted, setConversationStarted] = useState<boolean>(false)

    return (
        <>
            {conversationStarted ? (
                <></>
            ) : (
                <div className="start-conv-click">
                    Click me to get insights of the dataset.
                </div>
            )}
        </>
    )
}

export default InsightsConv;
