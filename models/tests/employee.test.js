const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
    it('should throw an error if no "name" is provided', () => {
        const employee = new Employee();
        employee.validate((err) => {
            expect(err.errors.firstName).to.exist;
        });
    });
    it('should throw an error if "name" is not a string', () => {
        const cases = [{}, []];
        for (let employee of cases) {
            const emp = new Employee({ firstName: employee, lastName: employee, department: employee });

            emp.validate((err) => {
                expect(err.errors.firstName).to.exist;
            });
        }
    });
    it('should throw an error if arguments does not contain firstName, lastName, department', () => {
        const cases = [{ firstName: 'John' }, { lastName: 'Doe', department: 'Tech' }, { firstName: 'Amanda', lastName: 'Watson' }];
        for (let employee of cases) {
            const emp = new Employee(employee);
            emp.validate((err) => {
                expect(err.errors).to.exist;
            });
        }
    });
    it('should not throw an error if firstName, lastName, department is correct', () => {
        const cases = [
            { firstName: 'John', lastName: 'Doe', department: 'Tech' },
            { firstName: 'Amanda', lastName: 'Watson', department: 'Tech' },
        ];
        for (let employee of cases) {
            const emp = new Employee(employee);
            emp.validate((err) => {
                expect(err).to.not.exist;
            });
        }
    });
});
