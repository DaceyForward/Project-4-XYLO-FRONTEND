import apiUrl from '../apiConfig'
import axios from 'axios'

// READ -> Index rotations
export const indexRotations = () => {
    return axios(`${apiUrl}/rotations`)}

// READ -> Show/detail page
export const detailRotation = (id) => {
    return axios(`${apiUrl}/rotations/${id}`)
}

// CREATE -> Add Rotation
export const createRotation = (user, newRotation) => {
    return axios({
        url: `${apiUrl}/rotations`,
        method: 'POST',
        headers: {
            Authorization: `Token token=${user.token}`
        },
        data: { rotation: newRotation }
    })
}
// UPDATE -> Edit Rotation
export const updateRotation = (user, updatedRotation) => {
    return axios({
        url: `${apiUrl}/rotations/${updatedRotation._id}`,
        method: 'PATCH',
        headers: {
            Authorization: `Token token=${user.token}`
        },
        data: { rotation: updatedRotation }
    })
}

// DELETE -> Delete rotation
export const deleteRotation = (user, rotationId) => {
    return axios({
        url: `${apiUrl}/rotations/${rotationId}`,
        method: 'DELETE',
        headers: {
            Authorization: `Token token=${user.token}`
        }
    })
}