// Piston api is used to run the code in the editor and get the output

const PISTON_API = "https://emkc.org/api/v2/piston";

const LANGUAGE_VERSIONS = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};

/**. JSDoc comments 
 * @param {string} language - programming language
 * @param {string} code - source code to executed
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const languageConfig = LANGUAGE_VERSIONS[language];

    if (!languageConfig) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    const response = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: languageConfig.language,
        version: languageConfig.version,
        //files is an array of objects with name and content properties. This allows us to run multiple files if needed in the future. For now, we will just run a single file with the code from the editor.
        //Even for single-file code, Piston still wants an array.
        // namr of main.java , main.py, main.js
        files: [
          {
            name: `main.${getFileExtension(language)}`,
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
      };
    }

    // data will have the following format: below of code there is one more comment with the actual format of the response
    const data = await response.json();

    const output = data.run.output || "";
    const stderr = data.run.stderr || ""; //compilation errors or runtime errors

    if (stderr) {
      return {
        success: false,
        output: output,
        error: stderr,
      };
    }

    return {
      success: true,
      output: output || "No output",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
      // ex network error or piston api is down
    };
  }
}
// helper function to get file extension based on language
function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
  };

  return extensions[language] || "txt";
}

// {
//   "run": {
//     "stdout": "...",
//     "stderr": "...",
//     "output": "..."
//   }
// }
