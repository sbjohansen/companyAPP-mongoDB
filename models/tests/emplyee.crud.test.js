const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');

describe('Employee', () => {
    //connect to the database
    before(async () => {
        try {
            await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
        } catch (err) {
            console.error(err);
        }
    });

    // tests for finding entries in the database

    describe('Reading data', () => {
        beforeEach(async () => {
            const testEmpOne = new Employee({ firstName: 'Test firstName One', lastName: 'Test lastName One', department: 'Test Department One' });
            await testEmpOne.save();

            const testEmpTwo = new Employee({ firstName: 'Test firstName Two', lastName: 'Test lastName Two', department: 'Test Department Two' });
            await testEmpTwo.save();
        });

        it('should find all employees with "find" method', async () => {
            const employees = await Employee.find();
            const expectedLength = 2;
            expect(employees).to.have.lengthOf(expectedLength);
        });

        it('should return proper document by "firstName", "lastName", or "department" with fineOne method', async () => {
            const cases = [{ firstName: 'Test firstName One' }, { lastName: 'Test lastName One' }, { department: 'Test Department One' }];
            for (let employee of cases) {
                const emp = await Employee.findOne(employee);
                expect(emp).to.exist;
            }
        });

        after(async () => {
            await Employee.deleteMany();
        });
    });

    // tests for creating entries in the database

    describe('Creating data', () => {
        it('should create a new employee with "insertOne" method', async () => {
            const employee = new Employee({ firstName: 'Test firstName One', lastName: 'Test lastName One', department: 'Test Department One' });
            await employee.save();
            expect(employee.isNew).to.be.false;
        });
        it('should throw an error if any of arguments is empty', async () => {
            const employee = new Employee({ firstName: '', lastName: '', department: '' });
            await employee.save().catch((err) => {
                expect(err.errors.firstName).to.exist;
                expect(err.errors.lastName).to.exist;
                expect(err.errors.department).to.exist;
            });
        });
        it('should throw an error if any or arguments is not a string', async () => {
            const employee = new Employee({ firstName: 1, lastName: 1, department: 1 });
            await employee.save().catch((err) => {
                expect(err.errors.firstName).to.exist;
                expect(err.errors.lastName).to.exist;
                expect(err.errors.department).to.exist;
            });
        });

        after(async () => {
            await Employee.deleteMany();
        });
    });

    // tests for updating entries in the database

    describe('Updating data', () => {
        beforeEach(async () => {
            const testEmpOne = new Employee({ firstName: 'Test firstName One', lastName: 'Test lastName One', department: 'Test Department One' });
            await testEmpOne.save();

            const testEmpTwo = new Employee({ firstName: 'Test firstName Two', lastName: 'Test lastName Two', department: 'Test Department Two' });
            await testEmpTwo.save();
        });

        it('should properly update one document with "updateOne" method', async () => {
            await Employee.updateOne({ firstName: 'Test firstName One' }, { firstName: 'Test firstName One Updated' });
            const employee = await Employee.findOne({ firstName: 'Test firstName One Updated' });
            expect(employee).to.exist;
        });

        it('should properly update one document with save method', async () => {
            const employee = await Employee.findOne({ firstName: 'Test firstName One' });
            employee.firstName = 'Test firstName One Updated';
            await employee.save();
            const updatedEmployee = await Employee.findOne({ firstName: 'Test firstName One Updated' });
            expect(updatedEmployee).to.exist;
        });

        it('should properly update multiple documents with updateMany method', async () => {
            await Employee.updateMany({}, { $set: { firstName: 'UPDATED!' } });
            const employees = await Employee.find();
            expect(employees[0].firstName).to.equal('UPDATED!');
            expect(employees[1].firstName).to.equal('UPDATED!');
        });
    });

    // tests for deleting entries in the database

    describe('Deleting data', () => {
        beforeEach(async () => {
            const testEmpOne = new Employee({ firstName: 'Test firstName One', lastName: 'Test lastName One', department: 'Test Department One' });
            await testEmpOne.save();

            const testEmpTwo = new Employee({ firstName: 'Test firstName Two', lastName: 'Test lastName Two', department: 'Test Department Two' });
            await testEmpTwo.save();
        });

        it('should properly delete one document with "deleteOne" method', async () => {
            await Employee.deleteOne({ firstName: 'Test firstName One' });
            const employee = await Employee.findOne({ firstName: 'Test firstName One' });
            expect(employee).to.not.exist;
        });

        it('should properly delete one document with remove method', async () => {
            const employee = await Employee.findOne({ firstName: 'Test firstName One' });
            await employee.remove();
            const deletedEmployee = await Employee.findOne({ firstName: 'Test firstName One' });
            expect(deletedEmployee).to.not.exist;
        });

        it('should properly delete multiple documents with "deleteMany" method', async () => {
            await Employee.deleteMany({});
            const employees = await Employee.find();
            expect(employees).to.have.lengthOf(0);
        });
        after(async () => {
            await Employee.deleteMany();
        });
    });

    after(async () => {
        await Employee.deleteMany();
    });
});
