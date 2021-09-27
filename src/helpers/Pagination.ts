import config from "../config/app";

class Pagination {
  index(page: number) {
    return config.dataPerPage * page - config.dataPerPage;
  }
}

export default new Pagination().index;
