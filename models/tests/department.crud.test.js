const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Department', () => {
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
            const testDepOne = new Department({ name: 'Test Department One' });
            await testDepOne.save();

            const testDepTwo = new Department({ name: 'Test Department Two' });
            await testDepTwo.save();
        });
        it('should find all departments with "find" method', async () => {
            const departments = await Department.find();
            const expectedLength = 2;
            expect(departments).to.have.lengthOf(expectedLength);
        });
        it('should return a proper document by "name" with "findOne" method', async () => {
            const department = await Department.findOne({ name: 'Test Department One' });
            expect(department.name).to.equal('Test Department One');
        });
        after(async () => {
            await Department.deleteMany();
        });
    });

    // tests for creating entries in the database

    describe('Creating data', () => {
        it('should create a new department with "insertOne" method', async () => {
            const department = new Department({ name: 'Test Department One' });
            await department.save();
            expect(department.isNew).to.be.false;
        });
        it('should throw an error if no "name" is provided', async () => {
            const department = new Department();
            await department.save().catch((err) => {
                expect(err.errors.name).to.exist;
            });
        });
        after(async () => {
            await Department.deleteMany();
        });
    });

    // tests for updating entries in the database

    describe('Updating data', () => {
        beforeEach(async () => {
            const testDepOne = new Department({ name: 'Test Department One' });
            await testDepOne.save();

            const testDepTwo = new Department({ name: 'Test Department Two' });
            await testDepTwo.save();
        });

        it('should properly update one document with "updateOne" method', async () => {
            await Department.updateOne({ name: 'Test Department One' }, { $set: { name: 'Test Department One Updated' } });
            const department = await Department.findOne({ name: 'Test Department One Updated' });
            expect(department.name).to.equal('Test Department One Updated');
        });

        it('should properly update one document with "save" method', async () => {
            const department = await Department.findOne({ name: 'Test Department One' });
            department.name = 'Test Dep. One Upd';
            await department.save();
            const updatedDepartment = await Department.findOne({ name: 'Test Dep. One Upd' });
            expect(updatedDepartment.name).to.not.be.null;
        });

        it('should properly update multiple documents with "updateMany" method', async () => {
            await Department.updateMany({}, { $set: { name: 'UpdatedDepartment' } });
            const departments = await Department.find();
            expect(departments).to.have.lengthOf(2);
        });

        afterEach(async () => {
            await Department.deleteMany();
        });
    });

    // tests for deleting entries in the database

    describe('Deleting data', () => {
        beforeEach(async () => {
            const testDepOne = new Department({ name: 'Test Department One' });
            await testDepOne.save();

            const testDepTwo = new Department({ name: 'Test Department Two' });
            await testDepTwo.save();
        });

        it('should properly delete one document with "deleteOne" method', async () => {
            await Department.deleteOne({ name: 'Test Department One' });
            const department = await Department.findOne({ name: 'Test Department One' });
            expect(department).to.be.null;
        });

        it('should properly delete one document with "remove" method', async () => {
            const department = await Department.findOne({ name: 'Test Department One' });
            await department.remove();
            const deletedDepartment = await Department.findOne({ name: 'Test Department One' });
            expect(deletedDepartment).to.be.null;
        });

        it('should properly delete multiple documents with "deleteMany" method', async () => {
            await Department.deleteMany({});
            const departments = await Department.find();
            expect(departments).to.have.lengthOf(0);
        });

        afterEach(async () => {
            await Department.deleteMany();
        });
    });
    // clear the database after each test
    after(() => {
        mongoose.models = {};
    });
});
