import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import LoadingScreen from '../shared/LoadingScreen'
import EditToyModal from './EditToyModal'
import Upload from '../Upload'
// import NewToyModal from '../toys/NewToyModal'
// import ToyShow from '../toys/ToyShow'
import { useNavigate } from 'react-router-dom'

import { Container, Card, Button } from 'react-bootstrap'

// we'll need to import an api function to grab an individual toy
import { detailToy, updateToy, deleteToy } from '../../api/toy'

import { detailToyFailure, deleteToySuccess, deleteToyFailure } from '../shared/AutoDismissAlert/messages'

// we're going to use route parameters to get the id of the toy we're trying to retrieve from the server.
// then we use that id with our api call function
// when we finally retrieve the toy, render the details on the screen

const toyCardContainerLayout = {
    display: 'flex',
    justifyContent: 'center',
    flexFlow: 'row wrap'
}

const ToyShow = (props) => {
    const [toy, setToy] = useState(null)
    const [editModalShow, setEditModalShow] = useState(false)
    // const [toyModalShow, setToyModalShow] = useState(false)
    // this is a boolean that we can alter to trigger a page re-render
    const [updated, setUpdated] = useState(false)

    const navigate = useNavigate()

    // we need to pull the id from the url
    // localhost:3000/toys/<toy_id>
    // to retrieve our id, we can use something from react-router-dom called useParams
    // this is called id, because that's how it is declared in our Route component in App.js
    const { id } = useParams()
    const { user, msgAlert, file, setFile, handleFileChange } = props

    // useEffect takes two arguments
    // the callback function
    // the dependency array
    // the dependency array determines when useEffect gets called
    // if any piece of state inside the dependency array changes
    // this triggers the useEffect to run the callback function again
    // NEVER EVER EVER EVER EVER EVER EVER put a piece of state in the dependency array that gets updated by the useEffect callback function
    // doing this causes an infinite loop
    // react will kill your application if this happens
    useEffect(() => {
        detailToy(id)
            .then(res => setToy(res.data.toy))
            .catch(err => {
                msgAlert({
                    heading: 'Error getting toy',
                    message: detailToyFailure,
                    variant: 'danger'
                })
            })
    }, [updated])

    const toyRemoval = () => {
        // we want to remove the toy
        deleteToy(user, toy._id)
            // send a success message
            .then(() =>
                msgAlert({
                    heading: `${toy.name} has been deleted`,
                    message: deleteToySuccess,
                    variant: 'success',
                })
            )
            // navigate the user to the home page(index)
            .then(() => navigate('/toys'))
            // send a fail message if there is an error
            .catch(() =>
                msgAlert({
                    heading: 'Oh no!',
                    message: deleteToyFailure,
                    variant: 'danger',
                })
            )
    }

    let toyCards
    if (toy) {
        if (toy.length > 0) {
            toyCards = toy.map(toy => (
                <ToyShow 
                    key={toy._id}
                    toy={toy}
                    msgAlert={msgAlert}
                    triggerRefresh={() => setUpdated(prev => !prev)}
                    user={user}
                />
            ))
        } else {
            toyCards = <p></p>
        }
    }

    if(!toy) {
        return <LoadingScreen />
    }

    return (
        <>
            <Container className='m-2'>
                <Card className='showColor'>
                    <Card.Header className='showColorHeader'>{ toy.name }</Card.Header>
                    <Card.Body className='showColor'>
                        <Card.Text className='showColor'>
                            <small>Name: {toy.name}</small><br/>
                            <small>Level: {toy.level}</small><br/>
                            <small>Focus Area: {toy.focusArea}</small><br/>
                            <small>Type: {toy.type}</small><br/>
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        {
                            toy.owner && user && toy.owner._id === user._id
                            ?
                            <>
                                <Button 
                                    className="m-2" variant="warning"
                                    onClick={() => setEditModalShow(true)}
                                >
                                    Edit
                                </Button>
                                <Button 
                                    className="m-2" variant="danger"
                                    onClick={() => toyRemoval()}
                                >
                                    Delete
                                </Button>
                                <Upload  />
                            </>
                            :
                            null
                        }
                    </Card.Footer>
                </Card>
            </Container>
            <Container className='m-2' style={toyCardContainerLayout}>
                {toyCards}
            </Container>
            {/* <Upload  /> */}
                {/* // file={file} 
                // setFile={setFile} 
                // onChange={handleFileChange}
                // <Image src="holder.js/171x180" thumbnail />
                // imgSrc="https://xylo-toy-box-app.s3.amazonaws.com/6.png"  */}
               
            <EditToyModal 
                user={user}
                show={editModalShow}
                updateToy={updateToy}
                msgAlert={msgAlert}
                handleClose={() => setEditModalShow(false)}
                triggerRefresh={() => setUpdated(prev => !prev)}
                toy={toy}
                className='modalColor'
            />
        </>
    )
}

export default ToyShow