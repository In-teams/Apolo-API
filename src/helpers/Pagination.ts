import { dataPerPage } from "../config/app";

class Pagination {
  index(page: number) {
    return dataPerPage * page - dataPerPage;
  }
}

export default new Pagination().index;
