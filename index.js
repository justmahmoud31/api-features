export default class ApiFeature {
    constructor(mongooseQuery, searchQuery) {
        this.mongooseQuery = mongooseQuery;
        this.searchQuery = searchQuery;
    }
    pagination(limit) {
        let pageNumber = this.searchQuery.page * 1 || 1;
        if (this.searchQuery.page < 1) {
            pageNumber = 1;
        }
        const pageLimit = limit;
        this.pageNumber = pageNumber;
        let skip = (pageNumber - 1) * pageLimit;
        this.mongooseQuery.skip(skip).limit(pageLimit);
        return this;
    }
    filter() {
        let searchQuery = structuredClone(this.searchQuery);
        searchQuery = JSON.stringify(searchQuery);
        searchQuery = searchQuery.replace(/(gt|gte|lt|lte)/g, (value) => {
            return "$" + value;
        });
        searchQuery = JSON.parse(searchQuery);
        let deletedwords = ['page', 'sort', 'fields', 'search'];
        deletedwords.forEach(word => delete searchQuery[word]);
        this.mongooseQuery.find(searchQuery);
        return this;
    }
    sort() {
        if (this.searchQuery.sort) {
            let sortBy = this.searchQuery.sort.split(',').join(' ');
            this.mongooseQuery.sort(sortBy);
        }
        return this;
    }

    fields() {
        if (this.searchQuery.fields) {
            let fieldsBy = this.searchQuery.fields.split(',').join(' ');
            this.mongooseQuery.select(fieldsBy);
        }
        return this;
    }

    search(fields = [' ']) {
        if (this.searchQuery.search) {
            const searchQueries = fields.map(field => ({
                [field]: { $regex: this.searchQuery.search, $options: 'i' }
            }));
            this.mongooseQuery.find({ $or: searchQueries });
        }
        return this;
    }
}
