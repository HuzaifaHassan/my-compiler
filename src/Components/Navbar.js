import React, { useRef } from 'react';
import Select from 'react-select';
import '../Components/Navbar.css';
import Axios from 'axios';

const Navbar = ({ userLang, setUserLang, userTheme, setUserTheme, fontSize, setFontSize, setUserCode }) => {
    const inputFileRef = useRef(null);
    
    const languages = [
        { id:"48" , value: "c", label: "C" },
        { value: "cpp", label: "C++" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
    ];
    const themes = [
        { value: "vs-dark", label: "Dark" },
        { value: "light", label: "Light" },
    ];

    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function(evt) {
                setUserCode(evt.target.result);
            };
            reader.onerror = function(evt) {
                console.error("An error occurred reading the file");
            };
        }
    };

    const handleUploadClick = () => {
        inputFileRef.current.click();
    };

    return (
        <div className="navbar">
            <h1>Web Code Editor</h1>
            <Select options={languages} value={userLang}
                onChange={(e) => setUserLang(e.value)}
                placeholder={userLang} />
            <Select options={themes} value={userTheme}
                onChange={(e) => setUserTheme(e.value)}
                placeholder={userTheme} />
            <label>Font Size</label>
            <input type="range" min="18" max="30"
                value={fontSize} step="2"
                onChange={(e) => { setFontSize(e.target.value) }} />
            <button className="upload-btn" onClick={handleUploadClick}>Upload Code</button>
            <input type="file" id="upload-code" ref={inputFileRef} style={{ display: "none" }} onChange={handleUpload} />
        </div>
    );
};

export default Navbar;
