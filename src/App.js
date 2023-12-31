// import React, { Component, Fragment } from 'react'
import React, { useState, Fragment, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

// import AuthenticatedRoute from './components/shared/AuthenticatedRoute'
import AutoDismissAlert from './components/shared/AutoDismissAlert/AutoDismissAlert'
import Header from './components/shared/Header'
import RequireAuth from './components/shared/RequireAuth'
import Home from './components/Home'
import About from './components/About'
import ToyIndex from './components/toys/ToyIndex'
import Playroom from './components/Playroom'
import SignUp from './components/auth/SignUp'
import SignIn from './components/auth/SignIn'
import SignOut from './components/auth/SignOut'
import ChangePassword from './components/auth/ChangePassword'
import ToyShow from './components/toys/ToyShow'
import RotationShow from './components/rotations/RotationShow'
import ToyCreate from './components/toys/ToyCreate'
import RotationCreate from './components/rotations/RotationCreate'

const App = () => {

  const [user, setUser] = useState(null)
  const [msgAlerts, setMsgAlerts] = useState([])

  console.log('user in app', user)
  console.log('message alerts', msgAlerts)
  
  useEffect(() => {
	// access localStorage
	const loggedInUser = localStorage.getItem('user')
	// console.log('the loggedInUser', loggedInUser)

	if (loggedInUser) {
		// we need to parse our JSON string
		const foundUser = JSON.parse(loggedInUser)
		// console.log('foundUser', foundUser)
		// then set the user
		setUser(foundUser)
	}
}, [])

  const clearUser = () => {
    console.log('clear user ran')
    setUser(null)
	localStorage.removeItem('user')
  }

	const deleteAlert = (id) => {
		setMsgAlerts((prevState) => {
			return (prevState.filter((msg) => msg._id !== id) )
		})
	}

	const msgAlert = ({ heading, message, variant }) => {
		const id = uuid()
		setMsgAlerts(() => {
			return (
				[{ heading, message, variant, id }]
      )
		})
	}

	return (
		<Fragment>
			<Header user={user} />
			<Routes>
				<Route 
					path='/' 
					element={<Home msgAlert={msgAlert} user={user} />} 
				/>
				<Route 
					path='/about' 
					element={<About msgAlert={msgAlert} user={user} />} 
				/>
				<Route 
					path='/toys' 
					element={<ToyIndex msgAlert={msgAlert} user={user} />} 
				/>
				<Route 
					path='/toys/mine' 
					element={<Playroom msgAlert={msgAlert} user={user} />} 
				/>
				<Route
					path='/sign-up'
					element={<SignUp msgAlert={msgAlert} setUser={setUser} />}
				/>
				<Route
					path='/sign-in'
					element={<SignIn msgAlert={msgAlert} setUser={setUser} />}
				/>
				<Route
					path='/sign-out'
					element={
					<RequireAuth user={user}>
						<SignOut msgAlert={msgAlert} clearUser={clearUser} user={user} />
					</RequireAuth>
					}
				/>
				<Route
					path='/change-password'
					element={
					<RequireAuth user={user}>
						<ChangePassword msgAlert={msgAlert} user={user} />
					</RequireAuth>}
				/>
				<Route 
					path='/create-toy'
					element={
						<RequireAuth user={user}>
							<ToyCreate user={user} msgAlert={msgAlert} />
						</RequireAuth>
					}
				/>
				<Route 
					path='/create-rotation'
					element={
						<RequireAuth user={user}>
							<RotationCreate user={user} msgAlert={msgAlert} />
						</RequireAuth>
					}
				/>
				<Route 
					path='toys/:id'
					element={
						<ToyShow user={user} msgAlert={msgAlert} />
					}
				/>
				<Route 
					path='rotations/:id'
					element={
						<RotationShow user={user} msgAlert={msgAlert} />
					}
				/>
			</Routes>
				{msgAlerts.map((msgAlert) => (
					<AutoDismissAlert
						key={msgAlert._id}
						heading={msgAlert.heading}
						variant={msgAlert.variant}
						message={msgAlert.message}
						id={msgAlert._id}
						deleteAlert={deleteAlert}
					/>
				))}
		</Fragment>
	)
}

export default App
