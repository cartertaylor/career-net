import {Modal, Button} from "react-bootstrap"
import React  from 'react';

function ModalPopup({show, onHide, props, modalText, successSubmit, submitButton= "Submit", buttonVariant="primary", modalComponent=null, buttonLabel="Confirm Submission",  checkValid= () =>null}) {

    console.log(props)

    console.log(buttonVariant)
    // Format of modalText
    // Title: Top title for the modal popup

    // Subtitle: sub header with bigger letters before body
    // Body: longer message with main content (smaller letters)

    function handleSuccess()
    {

        const validSubmit = checkValid()

        if (validSubmit == null || validSubmit == true )
        {
            // Run the success function
            successSubmit()

            // Run the close function
            onHide()
        }
        
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

                {modalComponent}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                <Button variant={buttonVariant} onClick={handleSuccess}>
                    {buttonLabel}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}




export default ModalPopup;
