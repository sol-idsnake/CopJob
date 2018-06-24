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
          		'id', 'name', 'link', 'state', 'requirements', 'salary', 'description');
          	expect(department.requirements).to.include.keys(
          		'age', 'citizenship', 'degree');
          });
          resDepartment = res.body[0];
          return Department.findById(resDepartment.id);
				})
				.then(function(department) {
        	expect(resDepartment.id).to.be.equal(department.id);
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
	});
	
});