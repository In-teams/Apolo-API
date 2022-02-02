import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/app";

const expect = chai.expect;
let token: string = "";

chai.use(chaiHttp);

// chai.should()
it("Get Token", (done) => {
  chai
    .request(app)
    .post("/api/v1/auth")
    .send({
      username: "super",
      password: "admin",
    })
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      token = res.body.data.token;
      done();
    });
});
describe("Outlet Endpoint", () => {
  it("Get Outlet Data", (done) => {
    chai
      .request(app)
      .get("/api/v1/outlet")
      .set("Authorization", token)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        done();
      });
  });
  it("Error Get Outlet Data When Pass Not Allowed Qparams", (done) => {
    chai
      .request(app)
      .get("/api/v1/outlet?example=blabla")
      .set("Authorization", token)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });
  it("Get Outlet Active", (done) => {
    chai
      .request(app)
      .get("/api/v1/outlet/active")
      .set("Authorization", token)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body.data).to.have.all.keys(
          "total_outlet",
          "aktif",
          "percentage",
          "percen"
        );
        expect(res.body.success).to.be.true;
        done();
      });
  });
  it("Error Authenticatation When Get Outlet Data", (done) => {
    chai
      .request(app)
      .get("/api/v1/outlet")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.have.property("success", false);
        expect(res.body).to.have.property("error", "Invalid Token");
        expect(res.body).to.have.property("data", null);
        expect(res).to.have.status(401);
        done();
      });
  });
});
