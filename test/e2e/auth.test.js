const request = require('./request');
const { assert } = require('chai');
const db = require('./db');

describe('Authentication API', () => {
    beforeEach(() => {
        db.drop();
    });

    let token = null;
    let char = null;

    beforeEach(() => {
        return request
            .post('/api/characters')
            .send({
                name: 'Jeff Racecar',
                description: 'Spaceman Spiff with a five o\'clock shadow',
                user: '590643bc2cd3da2808b0e651'
            })
            .then(({ body }) => (char = body));
    });

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'Test Boy',
                password: 'testword',
                Characters: ['590643bc2cd3da2808b0e652']
            })
            .then(({ body }) => {
                token = body.token;
            })
            .then(() => {
                return request
                    .post(`/api/newChar/${char._id}`)
                    .set('Authorization', token)
                    .send({
                        name: 'Jeff Racecar',
                        description: 'Spaceman Spiff with a five o\'clock shadow',
                        user: '590643bc2cd3da2808b0e651'
                    });
            });
    });

    it('gives a token on signup', () => {
        assert.ok(token);
    });

    it('can\'t signup with the same name', () => {
        return request
            .post('/api/auth/signup')
            .send({ name: 'Test Boy', password: 'whatever' })
            .then(() => {
                throw new Error('Unexpected success which is terrible in this case');
            },
            err => {
                assert.equal(err.status, 400);
            });
    });

    it('can\'t signup without password', () => {
        return request
            .post('/api/auth/signup')
            .send({ name: 'Test LAD' })
            .then(() => {
                throw new Error('Unexpected success which is terrible in this case');
            },
            err => {
                assert.equal(err.status, 400);
            });
    });

    it('should signin with the same credentials', () => {
        return request
            .post('/api/auth/signin')
            .send({ name: 'Test Boy', password: 'whatever' })
            .then(({ body }) => {
                assert.ok(body.token);
                assert.ok(body.userChars);
            });
    });

    it('can\'t sign in with wrong credentials', () => {
        return request
            .post('/api/auth/signin')
            .send({ name: 'Test Boy', password: 'bAdPaSsWoRd' })
            .then(() => {
                throw new Error('Unexpected success which is terrible in this case');
            },
            err => {
                assert.equal(err.status, 401);
            });
    });
});