import CognitoIdentityServiceProvider from "aws-sdk/clients/cognitoidentityserviceprovider";
import logger from "./logger";

/**
 * This class serves as a wrapper to the Cognito Identity Service Provider.
 * The primary benefit of this wrapper is to make testing of other
 * classes that use Cognito easier.  Mocking AWS services in unit testing
 * is a pain because of the promise() response structure.
 */
class CognitoService {
  private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;
  private static instance: CognitoService;

  /**
   * CognitoService is a Singleton, hence private constructor
   * to prevent direct constructions calls with new operator.
   */
  private constructor(region: string) {
    this.cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
      region: region,
    });
  }

  /**
   * Controls access to the singleton instance.
   */
  static getInstance(region: string) {
    if (!CognitoService.instance) {
      CognitoService.instance = new CognitoService(region);
    }

    return CognitoService.instance;
  }

  async listUsers(input: CognitoIdentityServiceProvider.ListUsersRequest) {
    logger.debug("Cognito ListUsers %o", input);
    return this.cognitoIdentityServiceProvider.listUsers(input).promise();
  }

  async addUser(input: CognitoIdentityServiceProvider.AdminCreateUserRequest) {
    logger.debug("Cognito AdminCreateUser %o", input);
    return this.cognitoIdentityServiceProvider.adminCreateUser(input).promise();
  }

  async removeUser(
    input: CognitoIdentityServiceProvider.AdminDeleteUserRequest
  ) {
    logger.debug("Cognito AdminDeleteUser %o", input);
    return this.cognitoIdentityServiceProvider.adminDeleteUser(input).promise();
  }

  async updateUserAttributes(
    input: CognitoIdentityServiceProvider.AdminUpdateUserAttributesRequest
  ) {
    logger.debug("Cognito AdminUpdateUserAttributes %o", input);
    return this.cognitoIdentityServiceProvider
      .adminUpdateUserAttributes(input)
      .promise();
  }
}

export default CognitoService;
