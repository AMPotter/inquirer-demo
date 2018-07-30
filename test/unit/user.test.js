const { assert } = require('chai');
const User = require('../../lib/models/user');

describe('User Model', () => {
    const user = new User({
        name: 'Big Boy'
    });

    it('generates hash from password', () => {
        user.generateHash('password');
        assert.isOk(user.hash);
    });

    it('compares password', () => {
        user.generateHash('this');
        assert.isTrue(user.comparePassword('this'));
        assert.isFalse(user.comparePassword('that'));
    });

    it('validates a good model', () => {
        const validate = user.validateSync();
        assert.equal(validate, undefined);
    });

    it('returns error if no name is provided', () => {
        const fakeBoy = new User({});
        const { errors } = fakeBoy.validateSync();
        assert.equal(errors.name.kind, 'required');
    });
});