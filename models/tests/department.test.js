const Department = require('../department.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Department', () => {
    it('should throw an error if no "name" is provided', () => {
        const department = new Department();
        department.validate((err) => {
            expect(err.errors.name).to.exist;
        });
        after(() => {
            mongoose.models = {};
        });
    });
    it('should throw an error if "name" is not a string', () => {
        const cases = [{}, []];
        for (let name of cases) {
            const dep = new Department({ name });

            dep.validate((err) => {
                expect(err.errors.name).to.exist;
            });
            after(() => {
                mongoose.models = {};
            });
        }
    });
    it('should throw an error if "name" is too short or too long', () => {
        const cases = [{ name: 'a' }, { name: 'a'.repeat(25) }];
        for (let name of cases) {
            const dep = new Department(name);

            dep.validate((err) => {
                expect(err.errors.name).to.exist;
            });
            after(() => {
                mongoose.models = {};
            });
        }
    });
    it('should not throw an error if "name" is valid', () => {
        const cases = [{ name: 'aaaaa' }, { name: 'a'.repeat(10) }];
        for (let name of cases) {
            const dep = new Department(name);

            dep.validate((err) => {
                expect(err).to.not.exist;
            });
            after(() => {
                mongoose.models = {};
            });
        }
    });
});
