import { fa } from '@faker-js/faker';
import { generateUserLoginData, generateUserRegistrationData } from '../../support/fakerUtils';
import authenticateToken from '../../../backend/middleware/authMiddleware';


const BASE_URL = 'http://localhost:3000/api/users';
const AUTH_TOKEN = 'Bearer STATIC_TOKEN_123';

describe('User API Tests', () => {
  
  let userId;
  let createdUserName;
  let createdUserEmail;
  let loginUser;

  it('Should create a user successfully', () => {
    const newUser = generateUserRegistrationData();

    cy.api({
      method: 'POST',
      url: BASE_URL + '/register',
      body: newUser,
    }).should((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('User registered');
      expect(response.body.user).to.have.property('id');
      expect(response.body.user.name).to.eq(newUser.name);
      expect(response.body.user.email).to.eq(newUser.email);

      // Store the user details for later assertions
      userId = response.body.user.id;
      createdUserName = response.body.user.name;
      createdUserEmail = response.body.user.email;
    });
  });

    it('Should Log the user in successfuly', () => {
    const user = {
        email: createdUserEmail,
        password: 'passw0rd',
    }
    cy.api({
      method: 'POST',
      url: BASE_URL + '/login',
      body: user,
    }).should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token', 'STATIC_TOKEN_123');
    });
    })

    it('Should get all users', () => {
    cy.api({
        method: 'GET',
        url: BASE_URL,
        headers: {
          'Authorization': AUTH_TOKEN
        },
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
    });
});


  it('Should get the created user by ID', () => {
    cy.api({
      method: 'GET',
      url: BASE_URL + '/' + userId,
      headers: {
        'Authorization': AUTH_TOKEN
      },
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', userId);
      expect(response.body).to.have.property('name', createdUserName);
      expect(response.body).to.have.property('email', createdUserEmail);
    });
  });


  it('Should Successfuly update the user details', () => {
    const updatedUser = {
        name: 'Updated User',
        email: 'updatedemail.example.com',
        password: 'newpassword',
    }

    cy.api({
      method: 'PUT',
      url: BASE_URL + '/' + userId,
      headers:{
        'Authorization': AUTH_TOKEN
      },
      body: updatedUser,
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'User updated');
      expect(response.body.user).to.have.property('id', userId);
      expect(response.body.user).to.have.property('name', updatedUser.name);
      expect(response.body.user).to.have.property('email', updatedUser.email);
    })

  })

  it('Should Successfuly patch the user details', () => {
    const patchedUser = {
        name: 'Patched User',}
        cy.api({
            method: 'PATCH',
            url: BASE_URL + '/' + userId,
            headers:{
                'Authorization': AUTH_TOKEN
            },
            body:patchedUser,
        }).should((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('message', 'User patched');
        })
    })

    it('Should Successfuly delete the user', () => {
        cy.api({
            method: 'DELETE',
            url: BASE_URL + '/' + userId,
            headers:{
                'Authorization': AUTH_TOKEN 
            },
                
            })
            .should((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('message', 'User deleted');
            })
        })
});

