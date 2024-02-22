import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from '../App'
import Home from '../home/Home'


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />
            }
        ]
    }
])

export default router