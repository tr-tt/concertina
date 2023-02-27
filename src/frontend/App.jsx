import {Routes, Route, Outlet, Link} from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import Login from './pages/Login/Login.jsx'
import Video from './pages/Video/Video.jsx'

export default function App()
{
    return (
        <div>
            <h1>Server Rendering Example</h1>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />}/>
                    <Route path="login" element={<Login />} />
                    <Route path="video" element={<Video />} />
                    <Route path="*" element={<NoMatch />} />
                </Route>
            </Routes>
        </div>
    )
}

function Layout()
{
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/video">Video</Link>
                    </li>
                    <li>
                        <Link to="/nothing-here">Nothing Here</Link>
                    </li>
                </ul>
            </nav>

            <hr />

            <Outlet />
        </div>
    )
}

function NoMatch()
{
    return (
        <div>
            <h2>Nothing to see here!</h2>
            <p>
                <Link to="/">Go to the home page</Link>
            </p>
        </div>
    )
}