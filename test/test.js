const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

chai.use(chaiHttp);

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const {Department} = require('../models');

const expect = chai.expect;


function seedDepartments() {
  console.info('seeding department data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateDepartmentData());
  };
  // this will return a promise
  return Department.insertMany(seedData);
};

function generateDepartmentData() {
	return {
    position: faker.name.jobTitle(),
  	name: faker.company.companyName(),
  	link: faker.internet.url(),
  	state: faker.address.state(),
  	requirements: {
  		age: 21,
  		citizenship: 'yes',
  		degree: 'yes'
  	},
  	salary: faker.finance.amount(),
  	description: faker.lorem.paragraph()
  };
};

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
};

describe('Department List API resource', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

  beforeEach(function() {
    return seedDepartments();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() {

		it('should return all existing departments', function() {
			let res
			return chai.request(app)
				.get('/list')
				.then(function(_res) {
					res = _res
					expect(res).to.have.status(200);
					expect(res.body).to.have.lengthOf.at.least(1);
					return Department.count();
				});
		});

		it('should return all existing departments with the right fields', function() {
			let resDepartment
			return chai.request(app)
				.get('/list')
				.then(function(res) {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);

          res.body.forEach(function(department) {
          	expect(department).to.be.a('object');
          	expect(department).to.include.keys(
          		'id', 'position', 'name', 'link', 'state', 'requirements', 'salary', 'description');
          	expect(department.requirements).to.include.keys(
          		'age', 'citizenship', 'degree');
          });
          resDepartment = res.body[0];
          return Department.findById(resDepartment.id);
				})
				.then(function(department) {
        	expect(resDepartment.id).to.be.equal(department.id);
          expect(resDepartment.position).to.be.equal(department.position)
        	expect(resDepartment.name).to.be.equal(department.name)
        	expect(resDepartment.link).to.be.equal(department.link)
        	expect(resDepartment.state).to.be.equal(department.state)
        	expect(resDepartment.requirements.age).to.be.equal(department.requirements.age)
        	expect(resDepartment.requirements.citizenship).to.be.equal(department.requirements.citizenship)
        	expect(resDepartment.requirements.degree).to.be.equal(department.requirements.degree)
        	expect(resDepartment.salary).to.be.equal(department.salary)
        	expect(resDepartment.description).to.be.equal(department.description)
        });
		});

    it("should return a department by ID", function() {
      return Department.findOne().then(function(res) {
        let departmentToFind = res._id;

        return chai
          .request(app)
          .get(`/list/${departmentToFind}`)
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a("object");
            expect(res).to.be.json;
          });
      });
    });
	});

  describe('POST endpoint', function() {
    it('should add a new department', function() {
      const newDepartment = generateDepartmentData()

      return chai.request(app)
        .post('/create')
        .send(newDepartment)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'position', 'name', 'requirements', 'link', 'salary', 'description');
          expect(res.body.id).to.not.be.null;
          expect(res.body.position).to.equal(newDepartment.position)
          expect(res.body.name).to.equal(newDepartment.name)
          expect(res.body.link).to.equal(newDepartment.link)
          expect(res.body.salary).to.equal(newDepartment.salary)
          expect(res.body.description).to.equal(newDepartment.description)

          return Department.findById(res.body.id)
        })
    });
    it('should error if field is missing', function() {
      const badRequestData = {}
      return chai.request(app)
        .post('/create')
        .send(badRequestData)
        .then(function(res){
          expect(res).to.have.status(400)
        })
    });
  });

  describe('PUT endpoint', function() {
    it('should update fields you send over', function() {
      const updateData = {
        name: 'This is only a test',
        requirements: {
          age: 99
        },
        description: 'something definitely not important.'
      };

      return Department
        .findOne()
        .then(function(department) {
          updateData.id = department.id

          return chai.request(app)
            .put(`/update/${department.id}`)
            .send(updateData)
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Department.findById(updateData.id);
        })
        .then(function(department) {
          expect(department.name).to.equal(updateData.name);
          expect(department.requirements.age).to.equal(updateData.requirements.age)
          expect(department.description).to.equal(updateData.description);
        });
    });
  });

  describe("DELETE endpoint", function() {
    it("delete a department by ID", function() {
      let department;

      return Department.findOne()
        .then(function(_department) {
          department = _department;
          return chai.request(app).delete(`/delete/${department.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Department.findById(department.id);
        })
        .then(function(_department) {
          expect(_department).to.be.null;
        });
    });
  });

	
});