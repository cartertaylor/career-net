import {Modal, Button} from "react-bootstrap"

function ModalPopup(props) {

    console.log(props)

    function handleSuccess()
    {
        // Run the success function


        // Run the close function
        props.onHide()
        
    }

    function handleCancel()
    {
        props.onHide()
    }

    return (
        <Modal
            {...props}
            size=""
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit User Submission
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Confirm</h4>
                <p>
                    Are you sure you would like to alter this users permisisions?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleCancel}>Close</Button>
                <Button variant="primary" onClick={props.onHide}>
                    Confirm Submission
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

// function App() {
//     const [modalShow, setModalShow] = React.useState(false);

//     return (
//         <>
//             <Button variant="primary" onClick={() => setModalShow(true)}>
//                 Launch vertically centered modal
//             </Button>

//             <MyVerticallyCenteredModal
//                 show={modalShow}
//                 onHide={() => setModalShow(false)}
//             />
//         </>
//     );
// }


export default ModalPopup;
