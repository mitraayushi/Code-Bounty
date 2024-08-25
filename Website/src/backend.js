const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const web3 = require('@solana/web3.js');
const readline = require('readline');

const cwd = process.cwd();
const compiler = require("compilex");
const { compileSol } = require("./solidity");

const options = { stats: true };
compiler.init(options);

const createApp1 = () => {
  const app = express();

  const ROOT_DIR = path.resolve();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(
    "/src/codemirror-5.65.16",
    express.static(`${cwd}/src/codemirror-5.65.16`) // absolute path needed
  );

  // app.get("/ide", (req, res) => {
  //   res.sendFile(`${cwd}/ide/index.html`); // absolute path needed
  // });

  app.post("/compile", (req, res) => {
    console.log(req.body);
    const code = req.body.code;
    // var input = req.body.input;
    const lang = req.body.lang;
    const problemId = req.body.problemId;
    //if windows
    const { expectedOutput, input } = problemSet[problemId];
    // console.log(expectedOutput);
    try {
      if (lang === "Cpp") {
        // if (!input) {
        //   var envData = {
        //     OS: "windows",
        //     cmd: "g++",
        //     options: { timeout: 10000 },
        //   }; // (uses g++ command to compile )
        //   compiler.compileCPP(envData, code, function (data) {
        //     if (data.output ) {
        //       res.send(data);
        //     } else {
        //       res.send({ output: "error" });
        //     }
        //   });
        // } else
        //  {
        //if windows
        console.log("ENTERED CPP++++++++++++++++++++");
        var envData = {
          OS: "windows",
          cmd: "g++",
          options: { timeout: 10000 },
        }; // (uses g++ command to compile )
        compiler.compileCPPWithInput(envData, code, input, function (data) {
          console.log(
            `ACTUAL: ${data.output}\n EXPECTED: ${expectedOutput}\n\n`
          );
          if (parseFloat(data.output) === parseFloat(expectedOutput)) {
            console.log("+++++++++++++++SUCCESS++++++++++++++++++++++");
            res.send({ output: "✅Success Passed" });
          } else {
            console.log("+++++++++++++++FAILED++++++++++++++++++++++");

            res.send({ output: "❌ error in logic, try again" });
          }
        });
        // }
      } else if (lang === "Java") {
        // if (!input) {
        //   var envData = {
        //     OS: "windows",
        //     cmd: "java",
        //     options: { timeout: 10000 },
        //   };
        //   compiler.compileJava(envData, code, function (data) {
        //     if (data.output) {
        //       res.send(data);
        //     } else {
        //       res.send({ output: "error in logic, try again" });
        //     }
        //   });
        // } else
        {
          var envData = {
            OS: "windows",
            cmd: "java",
            options: { timeout: 10000 },
          };
          compiler.compileJavaWithInput(envData, code, input, function (data) {
            console.log(
              `ACTUAL: ${data.output}\n EXPECTED: ${expectedOutput}\n\n`
            );

            if (parseFloat(data.output) === parseFloat(expectedOutput)) {
              res.send({ output: "✅Success Passed" });
            } else {
              res.send({ output: "❌ error in logic, try again" });
            }
          });
        }
      } else if (lang === "Python") {
        // if (!input) {
        //   var envData = {
        //     OS: "windows",
        //     cmd: "python",
        //     options: { timeout: 10000 },
        //   };
        //   compiler.compilePython(envData, code, function (data) {
        //     if (data.output) {
        //       res.send(data);
        //       cleanTempDirectory();
        //     } else {
        //       res.send({ output: "error" });
        //     }
        //   });
        // } else
        {
          var envData = {
            OS: "windows",
            cmd: "python",
            options: { timeout: 10000 },
          };
          compiler.compilePythonWithInput(
            envData,
            code,
            input,
            function (data) {
              console.log(
                `ACTUAL: ${data.output.length}\n EXPECTED: ${expectedOutput.length}\n\n`
              );
              console.log(
                parseFloat(data.output) === parseFloat(expectedOutput)
              );
              if (parseFloat(data.output) === parseFloat(expectedOutput)) {
                res.send({ output: "✅Success Passed" });
                cleanTempDirectory();
              } else {
                res.send({ output: "❌ error in logic, try again" });
              }
            }
          );
        }
      } else if (lang === "Sol") {
        // if (!input) {
        //   var envData = {
        //     OS: "windows",
        //     cmd: "python",
        //     options: { timeout: 10000 },
        //   };
        //   compiler.compilePython(envData, code, function (data) {
        //     if (data.output) {
        //       res.send(data);
        //       cleanTempDirectory();
        //     } else {
        //       res.send({ output: "error" });
        //     }
        //   });
        // } else
        const input = {
          language: "Solidity",
          sources: {
            "test.sol": {
              content: code,
            },
          },
        };
        console.log(compileSol(input))
        if (compileSol(input)) {
          res.send({ output: "✅Success Passed" });
          cleanTempDirectory();
        }else{
          res.send({ output: "❌ error in logic, try again" });
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  });

  function cleanTempDirectory() {
    const tempFolderPath = `${cwd}/temp`; // Hardcoded path to the temporary directory

    fs.readdir(tempFolderPath, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return;
      }

      const fileCount = files.length;

      if (fileCount > 2) {
        console.log(
          `Cleaning up ${fileCount} files and folders in the temporary directory...`
        );

        files.forEach((file) => {
          const filePath = `${tempFolderPath}/${file}`;
          fs.stat(filePath, (err, stats) => {
            if (err) {
              console.error("Error getting file stats:", err);
              return;
            }

            if (stats.isDirectory()) {
              fs.rmdir(filePath, { recursive: true }, (err) => {
                if (err) {
                  console.error("Error deleting directory:", err);
                } else {
                  console.log(`Deleted directory: ${filePath}`);
                }
              });
            } else {
              fs.unlink(filePath, (err) => {
                if (err) {
                  console.error("Error deleting file:", err);
                } else {
                  console.log(`Deleted file: ${filePath}`);
                }
              });
            }
          });
        });
      }
    });
  }

  // MongoDB connection
  mongoose
    .connect(
      "mongodb+srv://manjeet0796:manjeet0796@cluster0.irnuxnb.mongodb.net/Socratech?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err.message);
    });

  // Signup schema
  const signupSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confpassword: {
      type: String,
      required: true,
    },
  });

  // Signup model
  const Signup = mongoose.model("signups", signupSchema);

  app.get("/", (req, res) => {
    const filepath = `${ROOT_DIR}/src/landing.html`;
    res.sendFile(filepath);
  });

  app.get("/signup", (req, res) => {
    const filepath = `${ROOT_DIR}/src/signup.html`;
    res.sendFile(filepath);
  });

  app.post("/signup", async (req, res) => {
    const { email, username, password, confpassword } = req.body;

    try {
      // Check if password and confirm password match
      if (password !== confpassword) {
        return res.status(400).send("Passwords do not match");
      }

      // Check if email already exists
      const existingEmail = await Signup.findOne({ email });
      if (existingEmail) {
        return res.status(400).send("Email already exists");
      }

      // Check if username already exists
      const existingUsername = await Signup.findOne({ username });
      if (existingUsername) {
        return res.status(400).send("Username already exists");
      }
      const problemsolved= new Set()
      // Create a new Signup document
      const newSignup = new Signup({ email, username, password, confpassword ,walletaddress:"",blockchain:"",balance:"",problemsolved});

      // Save the new signup to the database
      const savedData = await newSignup.save();
      console.log("Data saved to the database:", savedData);
      res.redirect("/login");
    } catch (error) {
      console.error("Error saving data:", error.message);
      res.status(500).send("Error saving data");
    }
  });

  app.get("/login", (req, res) => {
    const filepath = `${ROOT_DIR}/src/login.html`;
    res.sendFile(filepath);
  });

  app.post("/login", async (req, res) => {
    const { username, password, rememberMe } = req.body;

    try {
      // Check if the username or email exists
      const user = await Signup.findOne({
        $or: [{ email: username }, { username: username }],
      });
      if (!user) {
        return res.status(400).send("Email or username does not exist");
      }

      // Check if the password matches
      if (password !== user.password) {
        return res.status(400).send("Password is incorrect");
      }

      if (rememberMe) {
        res.cookie("username", user.username, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        }); // Cookie expires in 30 days
        res.cookie("password", user.password, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        }); // Cookie expires in 30 days
      }

      console.log("Successfully logged in:", user);
      res.redirect("/home.html");
    } catch (error) {
      console.error("Error logging in:", error.message);
      res.status(500).send("Error logging in");
    }
  });

  app.get("/wallet", (req, res) => {
    res.sendFile(`${ROOT_DIR}/src/wallet.html`);
  });

  app.post("/wallet", async (req, res) => {
    const { walletaddress,username,blockchain } = req.body;
    try {
      const user = await Signup.findOne({
        $or: [{ email: username }, { username: username }],
      });
      if (!user) {
        return res.status(400).send("Email or username does not exist");
      }
      // Create a connection to the Devnet
      const connection = new web3.Connection(web3.clusterApiUrl('testnet'));
  
      // Check if the address is valid
      const publicKey = new web3.PublicKey(walletaddress);
  
      // If the address is a valid public key, we proceed
      const accountInfo = await connection.getAccountInfo(publicKey);
  
      if (accountInfo !== null) {
        console.log('The address is a valid Solana testnet address.');
        
        // Save the wallet address to the database
        user.blockchain=blockchain;
        user.walletaddress = walletaddress;
        const savedData = await user.save();
        console.log("Data saved to the database:", savedData);
  
        // Respond with success
        res.send({ success: true, message: 'The address is a valid Solana testnet address and has been saved.' });
      } else {
        console.log('The address is not found on the Solana testnet.');
        res.send({ success: false, message: 'The address is not found on the Solana testnet.' });
      }
    } catch (error) {
      console.error('Invalid Solana address:', error);
      res.status(400).send({ success: false, message: 'Invalid Solana address.' });
    }
  });

  app.use(cookieParser()); // Make sure this middleware is used

  app.use(async (req, res, next) => {
    const { username, password } = req.cookies;

    if (username && password) {
      try {
        const user = await Signup.findOne({ username });

        if (user && user.password === password) {
          res.locals.user = user;
          req.user = user; // Set user on req object for further use
        }
      } catch (error) {
        console.error("Error authenticating user with cookies:", error.message);
      }
    }

    next();
  });
  app.post("/withdraw",async (req, res) => {
    console.log(req.body, "=============");
    const { clientAddress, claimAmt } = req.body;
    const template = `export const walletAddress = "${clientAddress}";
    export const claimableAmt = ${claimAmt};`;
    fs.writeFileSync("./receiver.ts", template);
    if(claimAmt > 0) {
      await runDeployTransfer();
    }
    console.log("023948,============");
    res.send(JSON.stringify({ transaction: "success" }));
  });
  
  app.get("/ide", (req, res) => {
    res.sendFile(`${ROOT_DIR}/src/code_editor.html`);
  }); 

  // for handling CSS files
  app.use(express.static("src"));

  app.post("/problem_details", (req, res) => {
    console.log("======================================");
    console.log(req.body);
    const { problemId } = req.body;
    const { name, description } = problemSet[problemId];
    const problemInfo = { name, description };
    res.send(JSON.stringify(problemInfo));
  });

  const displayAll = async () => {
    try {
      const allData = await Signup.find();
      console.log(allData);
      return allData;
    } catch (error) {
      console.error("Error fetching data:", error.message);
      throw error;
    }
  };

  displayAll(); // This will execute when the script runs

  // app.listen(port, () => console.log("Listening On", port));
  return app;
};

const problemSet = {
  p1: {
    problemId: "p1",
    name: "Sum",
    description:
      "Write a program, which takes two numbers as in input and prints sum",
    input: "3\n4\n",
    expectedOutput: "7",
  },
  p2: {
    problemId: "p1",
    name: "Product",
    description: "Write a program, which takes two numbers as in input and prints products",
    input: "3\n4\n",
    expectedOutput: "12",
  },
  p3: {
    problemId: "p3",
    name: "Subtract",
    description: "Write a program, which takes two numbers as in input and prints difference",
    input: "3\n4\n",
    expectedOutput: "-1",
  },
  p4: {
    problemId: "p4",
    name: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. 
    You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

 

Example 1:

Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
Example 2:

Input: nums = [3,2,4], target = 6
Output: [1,2]
Example 3:

Input: nums = [3,3], target = 6
Output: [0,1]
 

Constraints:

2 <= nums.length <= 104
-109 <= nums[i] <= 109
-109 <= target <= 109
Only one valid answer exists.


Follow-up: Can you come up with an algorithm that is less than O(n2) time complexity?`,
    input: "3\n4\n",
    expectedOutput: "-1",
  },
};

module.exports = { createApp1 };