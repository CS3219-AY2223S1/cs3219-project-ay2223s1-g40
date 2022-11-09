import chai from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import UserModelSchema from "../model/user-model.js";

chai.use(chaiHttp);
chai.should();

describe("user-controller test", () => {
  before((done) => {
    UserModelSchema.deleteMany({}, (err) => {
      done();
    });
  });

  describe("sign up success", () => {
    it("create user", (done) => {
      chai
        .request(app)
        .post("/api/user/")
        .send({ username: "user1", password: "password1" })
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });

  describe("sign up fail missing", () => {
    it("user info missing", (done) => {
      chai
        .request(app)
        .post("/api/user/")
        .send()
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  describe("sign up fail duplicate", () => {
    it("duplicate user", (done) => {
      chai
        .request(app)
        .post("/api/user/")
        .send({ username: "user2", password: "test" })
        .then((res) => {
          res.should.have.status(201);
          chai
            .request(app)
            .post("/api/user/")
            .send({ username: "user2", password: "test" })
            .then((res) => {
              res.should.have.status(400);
            });
          done();
        });
    });
  });

  describe("sign in fail incorrect", () => {
    it("sign in with wrong password", (done) => {
      chai
        .request(app)
        .post("/api/user/login")
        .send({ username: "user1", password: "password" })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe("sign in fail missing", () => {
    it("user info missing", (done) => {
      chai
        .request(app)
        .post("/api/user/login")
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe("sign in success", () => {
    it("sign in existing user", (done) => {
      chai
        .request(app)
        .post("/api/user/")
        .send({ username: "testuser", password: "test", admin: false })
        .then((res) => {
          res.should.have.status(201);
          chai
            .request(app)
            .post("/api/user/login")
            .send({ username: "testuser", password: "test" })
            .then((res) => {
              res.should.have.status(200);
            });
          done();
        });
    });
  });
});
