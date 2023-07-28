import { Modal, Box, Typography } from "@mui/material"

const DataModal = (props: {open: boolean, setOpen: (_: boolean) => void}) => {
    const handleClose = () => {
        props.setOpen(false)
    }

    return (
        <Modal
            open={props.open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{outline: 0}}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Datasets
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </Typography>
            </Box>
        </Modal>
    )
}

export default DataModal;
