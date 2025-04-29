import * as fs from "node:fs";

async function generateToken({username}) {
  const res = await fetch("http://localhost:8080/api/login", {
    method: 'POST',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify( {
      username, password: "password"
    })})
  if (res.ok) {
    return (await res.json())
  }
}

async function generateTokensFile(){
  let tokens = []
  for(let i=0; i<5; i++){
    const token = await generateToken({username: `user${i+1}`})
    tokens.push(token)
  }
  await fs.promises.writeFile('data/tokens.json', JSON.stringify(tokens))
}

await generateTokensFile()
