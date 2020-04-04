const http = require('http')
const { parse } = require('url')

const getUsers = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'applitcation/json',
  })

  res.write(JSON.stringify([{ id: 1 }]))
  res.end()
}

const createUser = (req, res) => {
  const body = []

  req.on('data', (chunck) => {
    body.push(chunck)
  })

  req.on('end', () => {
    const parsedBody = Buffer.concat(body)
      .toString()
      .split('&')
      .map((item) => item.split('='))
      .reduce(
        (memo, current) => ({
          ...memo,
          [current[0]]: current[1],
        }),
        {}
      )

    // db.save(parsedBody)

    res.writeHead(200, {
      'Content-Type': 'applitcation/json',
    })

    res.write(JSON.stringify(parsedBody))
    res.end()
  })
}

const routes = {
  '/users': {
    GET: getUsers,
    POST: createUser,
  },
}

const server = http.createServer((req, res) => {
  const url = parse(req.url)

  if (routes[url.pathname] && routes[url.pathname][req.method]) {
    routes[url.pathname][req.method](req, res)
  }
})

server.listen(3000)

// GET http://localhost:3000
