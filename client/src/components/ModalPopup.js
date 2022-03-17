import {Modal, Button} from "react-bootstrap"

function ModalPopup({show, onHide, props, modalText, successSubmit,submitButton= "Submit", buttonVariant="primary"}) {

    console.log(props)

    console.log(buttonVariant)
    // Format of modalText
    // Title: Top title for the modal popup

    // Subtitle: sub header with bigger letters before body
    // Body: longer message with main content (smaller letters)

    function handleSuccess()
    {
        // Run the success function
        successSubmit()

        // Run the close function
        onHide()
        
    }

    function handleCancel()
    {
        onHide()
    }

    return (
        <Modal
            {...props}
            size=""
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show}
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {modalText.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{modalText.subTitle}</h4>
                <p>
                    {modalText.body}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                <Button variant={buttonVariant} onClick={handleSuccess}>
                    Confirm Submission
                </Button>
            </Modal.Footer>
        </Modal>
    );
}




export default ModalPopup;
