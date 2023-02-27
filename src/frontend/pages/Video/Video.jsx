import {useState} from 'react'

export default function Video()
{
    const [videoName, setVideoName] = useState('test0.mp4')

    const handleClick = (event) =>
    {
        setVideoName(value => value = event.target.getAttribute('value'))
    }

    return (
        <>
            <ul onClick={handleClick}>
                <li value="test0.mp4">test0</li>
                <li value="test2.MOV">test2</li>
                <li value="toto.mp4">test1</li>
            </ul>
            <video src={`/api/video?video=${videoName}`} type="video/mp4" width="400" height="300" controls></video>
        </>
    )
}