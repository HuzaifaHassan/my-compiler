import { useState } from 'react';
import './App.css';
import Editor from "@monaco-editor/react";
import Navbar from './Components/Navbar';
import Axios from 'axios';
import spinner from './spinner.svg';
 
function App() {
 
    
    const [userCode, setUserCode] = useState(``);
 
    const [userLang, setUserLang] = useState("python");
 
    
    const [userTheme, setUserTheme] = useState("vs-dark");
 
    
    const [fontSize, setFontSize] = useState(20);
 
 const [userInput, setUserInput] = useState("");
 
    // State variable to set users output
    const [userOutput, setUserOutput] = useState("");
 
    // Loading state variable to show spinner
    // while fetching data
    const [loading, setLoading] = useState(false);
 
    const options = {
        fontSize: fontSize
    }
 
  
    function compile() {
        setLoading(true);
        if (userCode === ``) {
            return
        }

        Axios.post(`http://localhost:8000/compile`, {
            code: userCode,
            language: userLang,
            input: userInput
        }).then((res) => {
            setUserOutput(res.data.output);
        }).then(() => {
            setLoading(false);
        })
    }
    function DownloadCode(){
        const blob= new Blob([userCode],{type:'text/plain'});
        const href= URL.createObjectURL(blob);
        const link= document.createElement('a');
        link.href=href;
        link.download=`code.${getExtension(userLang)}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }
    function getExtension(language){
        switch(language){
            case "python":
                return "py";

                default:
                    return "txt";
        }
          
    }

 
    // Function to clear the output screen
    function clearOutput() {
        setUserOutput("");
    }
 
    return (
        <div className="App">
            <Navbar
                userLang={userLang} setUserLang={setUserLang}
                userTheme={userTheme} setUserTheme={setUserTheme}
                fontSize={fontSize} setFontSize={setFontSize}
                userCode={userCode} setUserCode={setUserCode}
            />
            <div className="main">
                <div className="left-container">
                    <Editor
                        options={options}
                        height="calc(100vh - 50px)"
                        width="100%"
                        theme={userTheme}
                        language={userLang}
                        defaultLanguage="python"
                        value={userCode || "# Enter your code here"}
                        onChange={(value) => { setUserCode(value) }}
                    />
                    <button className="run-btn" onClick={() => compile()}>
                        Run
                    </button>
                    <button className="download-btn" onClick={()=>DownloadCode()}>Save</button>
                </div>
                <div className="right-container">
                    <h4>Input:</h4>
                    <div className="input-box">
                        <textarea id="code-inp" onChange=
                            {(e) => setUserInput(e.target.value)}>
                        </textarea>
                    </div>
                    <h4>Output:</h4>
                    {loading ? (
                        <div className="spinner-box">
                            <img src={spinner} alt="Loading..." />
                        </div>
                    ) : (
                        <div className="output-box">
                            <pre>{userOutput}</pre>
                            <button onClick={() => { clearOutput() }}
                                className="clear-btn">
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
 
export default App;