import { Op } from "sequelize";

export default class ApiFeature {
  constructor(query, queryString, dbType) {
    this.query = query;
    this.queryString = queryString;
    this.options = {};
    this.dbType = dbType;
  }

  pagination(limit) {
    let pageNumber = (this.queryString.page * 1) || 1;
    if (pageNumber < 1) {
      pageNumber = 1;
    }
    const pageLimit = limit;
    this.pageNumber = pageNumber;
    let offset = (pageNumber - 1) * pageLimit;
    if (this.dbType === 'sql') {
      if (!this.options) {
        this.options = {};
      }
      this.options.offset = offset;
      this.options.limit = pageLimit;
    } else {
      if (this.query) {
        this.query = this.query.skip(offset).limit(pageLimit);
      } else {
        console.error("this.query is not defined or does not have skip and limit methods");
      }
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.split(',').join(' ');
      if (this.dbType === 'sql') {
        const sortOptions = sortBy.split(' ').map(field => {
          if (field.startsWith('-')) {
            return [field.substring(1), 'DESC'];
          }
          return [field, 'ASC'];
        });
        this.options.order = sortOptions;
      } else {
        if (typeof this.query.sort === 'function') {
          this.query.sort(sortBy);
        } else {
          console.error('this.query is not a query object with sort method');
        }
      }
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      if (this.dbType === 'sql') {
        const fieldsArray = this.queryString.fields.split(',').map(field => field.trim());
        if (!this.options) {
          this.options = {};
        }
        this.options.attributes = fieldsArray;
      } else {
        let fieldBy = this.queryString.fields.split(',').join(' ');
        this.query.select(fieldBy);
      }
    } 
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(field => delete queryObj[field]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`);
    const parsedQuery = JSON.parse(queryStr);
    if(this.dbType === 'sql'){
      const sequelizeQuery = {};
      Object.keys(parsedQuery).forEach(key => {
        if (typeof parsedQuery[key] === 'object') {
          sequelizeQuery[key] = {};
          Object.keys(parsedQuery[key]).forEach(operator => {
            sequelizeQuery[key][Op[operator.substring(1)]] = parsedQuery[key][operator]; 
          });
        } else {
          sequelizeQuery[key] = parsedQuery[key];
        }
      });
      this.options.where = {
        ...this.options.where,
        ...sequelizeQuery
      };
    } else {
      this.query.find(parsedQuery);
    }
    return this;
  }

  search(fields = [' ']) {
    if (this.dbType === 'sql') {
      if (this.queryString.search) {
        const keyword = this.queryString.search;
        if (fields.length > 0 && keyword) {
          const searchQueries = fields.map(field => ({
            [field]: {
              [Op.like]: `%${keyword}%`, 
            }
          }));
          this.options.where = {
            ...this.options.where,
            [Op.or]: searchQueries,
          };
        } else {
          console.log("Fields array is empty or no search parameter provided");
        }
      } else {
        console.log("No search parameter provided");
      }
    } else {
      if (typeof this.queryString.search === 'string' && this.queryString.search.trim()) {
        const searchQueries = fields.map(field => ({
          [field]: { $regex: this.queryString.search, $options: 'i' }
        }));
        this.query.find({ $or: searchQueries });
      } 
    }
    return this;
  }
  
  apply() {
    if (this.query.find) {
      return this.query;
    } else {
      return this.query.findAll(this.options);
    }
  }
}
