import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/app";

const expect = chai.expect;
const token: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJfaWQiOiJzdXBlciIsIm5hbWUiOm51bGwsInVzZXJfcHJvZmlsZSI6IiIsImxldmVsIjoiMSIsImVtYWlsIjpudWxsLCJzY29wZSI6bnVsbCwicGhvdG8iOm51bGwsInJlZ2lkIjpudWxsfSwiaWF0IjoxNjM0MDA4OTM4fQ.HY_z7VgxqDDnMK5tIleCilpNCUHCWfulwqYflAnUxPs";

chai.use(chaiHttp);

// chai.should()
describe("Redeem Endpoint", () => {
  it("Should Error Get Redeem Summary when pass not allowed Qparams", (done) => {
    chai
      .request(app)
      .get("/api/v1/redeem?example=blablabla")
      .set("Authorization", token)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body.data).to.be.a("null");
        expect(res.body.error).to.be.a("string");
        done();
      });
  });
  it("Get Redeem Summary", (done) => {
    chai
      .request(app)
      .get("/api/v1/redeem")
      .set("Authorization", token)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body.data).to.have.all.keys(
          "achieve",
          "redeem",
          "achieveconvert",
          "redeemconvert",
          "percentage",
          "percen"
        );
        done();
      });
  });
  it("Get Redeem Summary By Head Region", (done) => {
    chai
      .request(app)
      .get("/api/v1/redeem/summary/hr")
      .set("Authorization", token)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.a("array");
        expect(res.body.data[0]).to.have.all.keys(
          "head_region_id",
          "head_region_name",
          "achieve",
          "redeem",
          "diff",
          "percentage",
          "pencapaian"
        );
        // expect(res.body).to.have.property("data", "array");
        done();
      });
  });
  it("Get Redeem Summary By Region", (done) => {
    chai
      .request(app)
      .get("/api/v1/redeem/summary/region")
      .set("Authorization", token)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.a("array");
        expect(res.body.data[0]).to.have.all.keys(
          "region_name",
          "region_id",
          "achieve",
          "redeem",
          "diff",
          "percentage",
          "pencapaian"
        );
        // expect(res.body).to.have.property("data", "array");
        done();
      });
  });
  it("Get Redeem Summary By Area", (done) => {
    chai
      .request(app)
      .get("/api/v1/redeem/summary/area")
      .set("Authorization", token)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.a("array");
        expect(res.body.data[0]).to.have.all.keys(
          "area_name",
          "area_id",
          "achieve",
          "redeem",
          "diff",
          "percentage",
          "pencapaian"
        );
        // expect(res.body).to.have.property("data", "array");
        done();
      });
  });
  it("Get Redeem Summary By Distributor", (done) => {
    chai
      .request(app)
      .get("/api/v1/redeem/summary/distributor")
      .set("Authorization", token)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.a("array");
        expect(res.body.data[0]).to.have.all.keys(
          "distributor_name",
          "distributor_id",
          "achieve",
          "redeem",
          "diff",
          "percentage",
          "pencapaian"
        );
        // expect(res.body).to.have.property("data", "array");
        done();
      });
  });
  it("Get Redeem Summary By Outlet", (done) => {
    chai
      .request(app)
      .get("/api/v1/redeem/summary/outlet")
      .set("Authorization", token)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.a("array");
        expect(res.body.data[0]).to.have.all.keys(
          "outlet_name",
          "outlet_id",
          "achieve",
          "redeem",
          "diff",
          "percentage",
          "pencapaian"
        );
        // expect(res.body).to.have.property("data", "array");
        done();
      });
  });
  it("Get Redeem Summary By ASM", (done) => {
    chai
      .request(app)
      .get("/api/v1/redeem/summary/asm")
      .set("Authorization", token)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.a("array");
        expect(res.body.data[0]).to.have.all.keys(
          "nama_pic",
          "asm_id",
          "achieve",
          "redeem",
          "diff",
          "percentage",
          "pencapaian"
        );
        // expect(res.body).to.have.property("data", "array");
        done();
      });
  });
  it("Get Redeem Summary By ASS", (done) => {
    chai
      .request(app)
      .get("/api/v1/redeem/summary/ass")
      .set("Authorization", token)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.a("array");
        expect(res.body.data[0]).to.have.all.keys(
          "nama_pic",
          "ass_id",
          "achieve",
          "redeem",
          "diff",
          "percentage",
          "pencapaian"
        );
        // expect(res.body).to.have.property("data", "array");
        done();
      });
  });
  
});
