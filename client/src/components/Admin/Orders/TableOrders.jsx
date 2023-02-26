import React, { useEffect, useState } from 'react';
import { Table, Modal, Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import './Style.css'

function TableOrders({ currentOrders }) {
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalPost, setShowModalPost] = useState(false);
    const [selectedData, setSelectedData] = useState({});

    const handleClick = (item) => {
        setSelectedData(item);
        setShowModalEdit(true);
    };
    const handleClickPost = (e) => {
        e.preventDefault()
        setShowModalPost(true)
    }

    const headers = Object.keys(currentOrders[0]);

    return (
        <>


            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map((item, index) => (
                        <tr key={index} onClick={() => handleClick(item)} style={{ cursor: 'pointer' }}>
                            {headers.map((header, subIndex) => (
                                (typeof item[header] !== "object") ?
                                    <td key={subIndex} className="ellipsis">{item[header]}</td> :
                                    <td key={subIndex} className="ellipsis">{item[header].id}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* <Modal show={showModalEdit} onHide={() => setShowModalEdit(false)} >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormProducts selectedData={selectedData} setShowModalEdit={setShowModalEdit} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalEdit(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModalPost} onHide={() => setShowModalPost(false)} >
                <Modal.Header closeButton>
                    <Modal.Title>Create Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormProductsPost setShowModalPost={setShowModalPost} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalPost(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal> */}
        </>


    )
}


export default TableOrders;