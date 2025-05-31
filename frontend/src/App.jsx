import { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

function App() {

  let backendUrl = "https://python-code-editor-osbl.onrender.com"

  const [code, setCode] = useState("#Type code here")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  async function handleRun () {
    setOutput("Running...")
    try {
      const res = await axios.post(`${backendUrl}/run`, { code , input })
      setOutput(res.data.output)
    } catch (err) {
      setOutput("Error: " + err.message)
    }
  }

  return (
    <div className="p-4 bg-slate-100 text-center mx-auto w-[100%]">
      <h1 className="text-2xl font-bold">Mini Coding Editor</h1>
      <Editor
        height="300px" language="python" defaultValue={code} theme="vs-dark" onChange={(value) => setCode(value)} />
      
      <textarea className="mt-4 w-full p-2 border bg-neutral-100 rounded" placeholder="Enter input here" rows={4} value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleRun} className="px-4 my-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Run
      </button>
      <pre className="bg-black h-[20vh] text-green-400 p-4 rounded whitespace-pre-wrap">
        {output}
      </pre>
    </div>
  );
}

export default App

