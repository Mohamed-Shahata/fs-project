/**
 * - npm init | npm init -y
 * - npm run <script>
 * - npm install <package> | npm install <package> --save-dev | npm install
 * - npm uninstall <package>
 * - npm update
 * - npm list
 * - npm cache clean --force
 */

import http from "http";
import fs from "fs";

const hostName = "127.0.0.1" // 127.0.0.1
const port = 3000
const path = "./data.json"

// HTTP Methods => GET | POST | PUT | PATCH | DELETE
const server = http.createServer((req, res) => {
  // if (req.url === "/login" && req.method === "GET") {
  //   res.end("Welcome to the login page")
  // } else if (req.url === "/register" && req.method === "GET") {
  //   res.end("Welcome to the register page")
  // } else {
  //   res.end("not found page")
  // }

  const [, route, userEmail] = req.url.split("/");
  const switchToArray = () => {
    const data = fs.readFileSync(path, "utf8");
    return JSON.parse(data)
  }
  if (req.url === "/getStudent" && req.method === "GET") {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.log(err)
      }
      res.end(data)
    })
  } else if (req.url === "/setStudent" && req.method === "POST") {
    let students = switchToArray()

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString()
    })

    req.on("end", () => {
      let { id, name, age, email, password } = JSON.parse(body);

      id = students.length + 1
      students.push({ id, name, age, email, password });
      fs.writeFileSync(path, JSON.stringify(students))
    });
    res.writeHead(201);
    res.end("successfully");
  } else if (req.url === "/deleteStudent" && req.method === "DELETE") {
    let students = switchToArray()

    let body = ""; // id
    req.on("data", (chunk) => {
      body += chunk.toString()
    })

    req.on("end", () => {
      const student = JSON.parse(body);
      students = students.filter((stud) => stud.id !== student.id);
      fs.writeFileSync(path, JSON.stringify(students))
    });
    res.end("successfully");
  } else if (route === "updateStudent" && userEmail && req.method === "PUT") {
    let students = switchToArray()

    let body = ""; // id
    req.on("data", (chunk) => {
      body += chunk.toString()
    })

    req.on("end", () => {
      const { name, age, email, password } = JSON.parse(body);
      students = students.map((stud) => {
        if (stud.email === userEmail) {
          return {
            id: stud.id,
            name: name || stud.name,
            age: age || stud.age,
            email: email || stud.email,
            password: password || stud.password
          }
        }
        return stud;
      })
      fs.writeFileSync(path, JSON.stringify(students))
    });
    res.end("updated successfully");
  }
  else {
    res.end("Not found page")
  }
});

// fs.readFile("./text.txt", "utf8", (err, data) => {
//   if (err)
//     console.log(err)
//   console.log(data)
// })

// fs.writeFile("./text.txt", "test", (err) => {
//   if (err) {
//     console.log(err)
//   }
// })

// fs.appendFile("./text.txt", "How are you", (err) => {
//   if (err) {
//     console.log(err)
//   }
// })

// fs.unlink("./text.txt", (err) => {
//   if (err) {
//     console.log(err)
//   }
// })

server.listen(port, hostName, () => {
  console.log(`server is ruinng on port ${port}`);
})