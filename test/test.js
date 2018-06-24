const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp);

const {app, runServer, closeServer} = require('../server')
const expect = chai.expect

describe('Root', function() {

	it('should respond with a status code on GET', function() {
		return chai.request(app)
			.get('/')
			.then(function(res) {
				console.log(res)
				expect(res).to.have.status(200)
			})
	})
})