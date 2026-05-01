import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // default to two-sum problem can be changed when URL param changes
  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  // default language is javascript but can be changed by user
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  // starter code for the problem, changes when user selects different language or different problem
  const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript);
  // output from code execution
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  //! get current problem details from PROBLEMS object based on currentProblemId
  const currentProblem = PROBLEMS[currentProblemId];

  // update problem when URL param changes and you get the starter code for that problem in selected language
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      // check if problem with given id exists
      setCurrentProblemId(id); // update current problem id
      setCode(PROBLEMS[id].starterCode[selectedLanguage]); // update code to starter code of new problem in selected language
      setOutput(null); // reset output
    }
  }, [id, selectedLanguage]);

  // drop down language change handler when user selects different language from dropdown in code editor panel
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]); // update code to starter code of new problem in selected language
    setOutput(null); // reset output
  };
  // problem change handler when user selects different problem from dropdown in problem description panel
  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    // normalize output for comparison (trim whitespace, handle different spacing)
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          // remove spaces after [ and before ]
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          // normalize spaces around commas to single space after comma
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };
  // function to check if actual output matches expected output for the problem, this will be used to determine if user passed the tests or not after running the code
  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);

    return normalizedActual == normalizedExpected;
  };
  //run code button handler when user clicks on run code button in code editor panel
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    //executeCode comming from piston where it have two parameters language and code and it will return the output of the code execution and if there is any error it will return that error
    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);

    // baicaly we got a result above now we will compare that result with expected output for the current problem and selected language and if it matches we will show success toast and trigger confetti and if it doesn't match we will show error toast to user to check their output

    // check if code executed successfully and matches expected output
    // this .success property is coming from piston response which we are returning in executeCode function in piston.js file if code executed successfully then only we will compare the output with expected output otherwise we will show error toast that code execution failed
    if (result.success) {
      const expectedOutput = currentProblem.expectedOutput[selectedLanguage]; // get expected output for current problem and selected language from PROBLEMS object
      const testsPassed = checkIfTestsPassed(result.output, expectedOutput); // compare actual output with expected output using our normalize and comparison function
      //! so my when we run code it give output then that aoutput should be same as expected output we use checkIfTestsPassed to remove extra spaces and new lines and make it comparable and if it matches we show success toast and trigger confetti otherwise we show error toast to check output
      if (testsPassed) {
        triggerConfetti();
        toast.success("All tests passed! Great job!");
      } else {
        toast.error("Tests failed. Check your output!");
      }
    } else {
      toast.error("Code execution failed!");
    }
  };

  return (
    <div className='h-screen bg-base-100 flex flex-col'>
      <Navbar />

      <div className='flex-1'>
        <PanelGroup direction='horizontal'>
          {/* left panel- problem desc */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)} // pass all problems as an array for the problem selector dropdown in ProblemDescription component
              // these are the props that ProblemDescription component needs to render the problem details and the problem selector dropdown
            />
          </Panel>

          {/* resize handle */}
          <PanelResizeHandle className='w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize' />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction='vertical'>
              {/* Top panel - Code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <PanelResizeHandle className='h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize' />

              {/* Bottom panel - Output Panel*/}

              <Panel defaultSize={30} minSize={30}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
