const request = require("supertest")
const server = require("./server")
const db = require("../data/dbConfig")

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db("users").truncate()
})

afterAll(async () => {
  await db.destroy()
})

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})


describe("Server Tests POST /API/AUTH/REGISTER", () => {
  test("POST /register with body", async () => {
    let resp = await request(server).post("/api/auth/register").send({ username: "foo", password: "bar" })

    expect(resp.status).toBe(201)
    expect(resp.body).toHaveProperty("id", "token", "username")
  })

  test("POST /register without body", async () => {
    let resp = await request(server).post("/api/auth/register")

    expect(resp.status).toBe(400)
    expect(resp.body).toEqual({ "message": "username and password required" })
  })
})

describe("Server Tests POST /API/AUTH/LOGIN", () => {
  test("POST /LOGIN with body", async () => {
    await request(server).post("/api/auth/register").send({ username: "foo", password: "bar" })
    const resp = await request(server).post("/api/auth/login").send({ username: "foo", password: "bar" })

    expect(resp.status).toBe(200)
    expect(resp.body).toHaveProperty("message", null, "token")
  })

  test("POST /LOGIN without body", async () => {
    const resp = await request(server).post("/api/auth/login")

    expect(resp.status).toBe(404)
    expect(resp.body).toEqual({ "message": "username and password required" })
  })
  
  describe("Server Tests GET /API/JOKES", () => {
    test("GET / with Token", async () => {
      await request(server).post("/api/auth/register").send({ username: "foo", password: "bar" })
      const login = await request(server).post("/api/auth/login").send({ username: "foo", password: "bar" })
      console.log(login)
      const resp = await request(server).get("/api/jokes").set("Authorization", login.body.token)
      expect(resp.status).toBe(200)
    })
  })
  
    test("GET / without Token", async () => {
      const resp = await request(server).get("/api/jokes")

      expect(resp.status).toBe(401)
      expect(resp.body).toEqual("token required")
    })
  })