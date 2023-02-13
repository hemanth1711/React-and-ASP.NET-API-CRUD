import React, {useState,useEffect, Fragment} from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
const CRUD = () => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name,setname] = useState('');
  const [age,setage] = useState('');
  const [isActive,setIsActive] = useState(0);


  const [editname,seteditname] = useState('');
  const [editage,seteditage] = useState('');
  const [editisActive,seteditIsActive] = useState(0);

  const [editId,setEditId] = useState('');



    const empdata = [
        {
            id:1,
            name:'hemu',
            age:20,
            isActive:1
        },
        {
            id:2,
            name:'Hemanth',
            age:22,
            isActive:0
        },
        {
            id:3,
            name:'reddy',
            age:23,
            isActive:0
        }
    ]
    const [data,setdata] = useState([]);

    useEffect(()=>{
        getdata();
    },[])

    const getdata = ()=> {
      axios.get('https://localhost:7058/api/Employee').then((result)=>{
        setdata(result.data)
      })
      .catch((error)=>{
        console.log(error)
      })
    }

    const handleEdit = (id) => {
      const url =  `https://localhost:7058/api/Employee/id?id=${id}`;
      axios.get(url)
      .then((result)=>{
        seteditname(result.data.name);
        seteditage(result.data.age);
        seteditIsActive(result.data.isActive);
        setEditId(result.data.id);
      })
      .catch((error)=>
      {
        toast.error(error);
      })
        handleShow();
    }
    const handleDelete = (id) => {
      const url = `https://localhost:7058/api/Employee?id=${id}`
        if(window.confirm("Are you sure you want to delete this id")==true)
        {
            axios.delete(url)
            .then((result)=>{
              if(result.status === 200)
              {
                toast.success('employee deleted');
                getdata();
              }
            })
            .catch((error)=>
            {
              toast.error(error);
            })
        } 
    }

    const handleupdate = () => {
      const url = `https://localhost:7058/api/Employee/id?id=${editId}`;
      const data = {
        "id":editId,
        "name": editname,
        "age": editage,
        "isActive": editisActive
      }
      axios.put(url,data).then((result)=>{
        getdata();
        clear();
        toast.success('Employee data updated successfully');
      })
    }

    

    const handleSave = () => {
      const url = 'https://localhost:7058/api/Employee';
      const data = {
        "name": name,
        "age": age,
        "isActive": isActive
      }
      axios.post(url,data).then((result)=>{
        getdata();
        clear();
        toast.success('Employee Added successfully');
      })
    }

    const clear = () => {
      setname('');
      setage('');
      setIsActive(0);
      seteditname('');
      seteditage('');
      seteditIsActive(0);
      setEditId('');
    }
    const handleIsActivechange = (e) => {
      if(e.target.checked == true)
      {
        setIsActive(1);
      }
      else{
        setIsActive(0);
      }
    }
    const handleEditIsActive = (e) => {
      if(e.target.checked == true)
      {
        seteditIsActive(1);
      }
      else{
        seteditIsActive(0);
      }
    }

  return (
    <Fragment>
      <ToastContainer/>
      <Container>
      <Row>
        <Col>
        <input type="text" className='form-control' placeholder='Enter Name' value={name} onChange={(e)=>setname(e.target.value)} />
        </Col>
        <Col><input type="text" className='form-control' placeholder='Enter Age' value={age} onChange={(e)=>setage(e.target.value)} /></Col>
        <Col><input type="checkbox" checked={isActive===1?true:false} onChange={(e)=>handleIsActivechange(e)} value={isActive}/>
        <label>isActive</label>
        </Col>
        <Col>
        <button onClick={()=>handleSave() } className='btn btn-primary'>
          Submit
        </button>
        </Col>
      </Row>
    </Container>
        <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Age</th>
          <th>isActive</th>
        </tr>
      </thead>
      <tbody>
        {
            data && data.length> 0 ? data.map((item,index)=>
            {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.age}</td>
                        <td>{item.isActive}</td>
                        <td colSpan={2}>
                            <button className='btn btn-primary' onClick={() => handleEdit(item.id)}>
                                Edit
                            </button>
                            
                            <button className='btn btn-danger' onClick={() => handleDelete(item.id)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                )
            })
            :
            "Loading.."
        }
        
      </tbody>
    </Table>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify / update  Employee data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Row>
        <Col>
        <input type="text" className='form-control' placeholder='Enter Name' value={editname} onChange={(e)=>seteditname(e.target.value)} />
        </Col>
        <Col><input type="text" className='form-control' placeholder='Enter Age' value={editage} onChange={(e)=>seteditage(e.target.value)} /></Col>
        <Col><input type="checkbox" checked={editisActive===1?true:false} onChange={(e)=>handleEditIsActive(e)} value={editisActive}/>
        <label>isActive</label>
        </Col>
      </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleupdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  )
}

export default CRUD