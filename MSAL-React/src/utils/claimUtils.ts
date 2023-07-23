/**
 * Populate claims table with appropriate description
 *
 * @param {Object} claims ID token claims
 * @returns claimsObject
 */
export const createClaimsTable = (claims: {
  [key: string]: string | number;
}): [string[]] => {
  let claimsObj: [string[]] = [[]];
  let index = 0;

  Object.keys(claims).forEach((key) => {
    if (typeof claims[key] !== "string" && typeof claims[key] !== "number")
      return;

    switch (key) {
      case "aud":
        populateClaim(
          key,
          claims[key],
          "Identifies the intended recipient of the token. In ID tokens, the audience is your app's Application ID, assigned to your app in the Azure portal.",
          index,
          claimsObj
        );
        index++;
        break;
      case "iss":
        populateClaim(
          key,
          claims[key],
          "Identifies the issuer, or authorization server that constructs and returns the token. It also identifies the Azure AD tenant for which the user was authenticated. If the token was issued by the v2.0 endpoint, the URI will end in /v2.0. The GUID that indicates that the user is a consumer user from a Microsoft account is 9188040d-6c67-4c5b-b112-36a304b66dad.",
          index,
          claimsObj
        );
        index++;
        break;
      case "iat":
        populateClaim(
          key,
          changeDateFormat(claims[key] as number),
          "Issued At indicates when the authentication for this token occurred.",
          index,
          claimsObj
        );
        index++;
        break;
      case "nbf":
        populateClaim(
          key,
          changeDateFormat(claims[key] as number),
          "The nbf (not before) claim identifies the time (as UNIX timestamp) before which the JWT must not be accepted for processing.",
          index,
          claimsObj
        );
        index++;
        break;
      case "exp":
        populateClaim(
          key,
          changeDateFormat(claims[key] as number),
          "The exp (expiration time) claim identifies the expiration time (as UNIX timestamp) on or after which the JWT must not be accepted for processing. It's important to note that in certain circumstances, a resource may reject the token before this time. For example, if a change in authentication is required or a token revocation has been detected.",
          index,
          claimsObj
        );
        index++;
        break;
      case "name":
        populateClaim(
          key,
          claims[key],
          "The name claim provides a human-readable value that identifies the subject of the token. The value isn't guaranteed to be unique, it can be changed, and it's designed to be used only for display purposes. The profile scope is required to receive this claim.",
          index,
          claimsObj
        );
        index++;
        break;
      case "preferred_username":
        populateClaim(
          key,
          claims[key],
          "The primary username that represents the user. It could be an email address, phone number, or a generic username without a specified format. Its value is mutable and might change over time. Since it is mutable, this value must not be used to make authorization decisions. It can be used for username hints, however, and in human-readable UI as a username. The profile scope is required in order to receive this claim.",
          index,
          claimsObj
        );
        index++;
        break;
      case "nonce":
        populateClaim(
          key,
          claims[key],
          "The nonce matches the parameter included in the original /authorize request to the IDP. If it does not match, your application should reject the token.",
          index,
          claimsObj
        );
        index++;
        break;
      case "oid":
        populateClaim(
          key,
          claims[key],
          "The oid (user’s object id) is the only claim that should be used to uniquely identify a user in an Azure AD tenant. The token might have one or more of the following claim, that might seem like a unique identifier, but is not and should not be used as such.",
          index,
          claimsObj
        );
        index++;
        break;
      case "tid":
        populateClaim(
          key,
          claims[key],
          "The tenant ID. You will use this claim to ensure that only users from the current Azure AD tenant can access this app.",
          index,
          claimsObj
        );
        index++;
        break;
      case "upn":
        populateClaim(
          key,
          claims[key],
          "(user principal name) – might be unique amongst the active set of users in a tenant but tend to get reassigned to new employees as employees leave the organization and others take their place or might change to reflect a personal change like marriage.",
          index,
          claimsObj
        );
        index++;
        break;
      case "email":
        populateClaim(
          key,
          claims[key],
          "Email might be unique amongst the active set of users in a tenant but tend to get reassigned to new employees as employees leave the organization and others take their place.",
          index,
          claimsObj
        );
        index++;
        break;
      case "acct":
        populateClaim(
          key,
          claims[key],
          "Available as an optional claim, it lets you know what the type of user (homed, guest) is. For example, for an individual’s access to their data you might not care for this claim, but you would use this along with tenant id (tid) to control access to say a company-wide dashboard to just employees (homed users) and not contractors (guest users).",
          index,
          claimsObj
        );
        index++;
        break;
      case "sid":
        populateClaim(
          key,
          claims[key],
          "Session ID, used for per-session user sign-out.",
          index,
          claimsObj
        );
        index++;
        break;
      case "sub":
        populateClaim(
          key,
          claims[key],
          "The sub claim is a pairwise identifier - it is unique to a particular application ID. If a single user signs into two different apps using two different client IDs, those apps will receive two different values for the subject claim.",
          index,
          claimsObj
        );
        index++;
        break;
      case "ver":
        populateClaim(
          key,
          claims[key],
          "Version of the token issued by the Microsoft identity platform.",
          index,
          claimsObj
        );
        index++;
        break;
      case "aio":
        populateClaim(
          key,
          " ... ",
          "An internal claim that's used to record data for token reuse. Should be ignored.",
          index,
          claimsObj
        );
        index++;
        break;
      case "idp":
        populateClaim(
          key,
          claims[key],
          "Records the identity provider that authenticated the subject of the token.",
          index,
          claimsObj
        );
        index++;
        break;
      case "acr":
        populateClaim(
          key,
          claims[key],
          "A value of 0 for the 'Authentication context class' claim indicates the end-user authentication didn't meet the requirements of ISO/IEC 29115.",
          index,
          claimsObj
        );
        index++;
        break;
      case "appid":
        populateClaim(
          key,
          claims[key],
          "The application ID of the client using the token. The application can act as itself or on behalf of a user. The application ID typically represents an application object, but it can also represent a service principal object in Azure AD.",
          index,
          claimsObj
        );
        index++;
        break;
      case "appidacr":
        populateClaim(
          key,
          claims[key],
          "Indicates authentication method of the client. For a public client, the value is 0. When you use the client ID and client secret, the value is 1. When you use a client certificate for authentication, the value is 2.",
          index,
          claimsObj
        );
        index++;
        break;
      case "family_name":
        populateClaim(
          key,
          claims[key],
          "Provides the last name, surname, or family name of the user as defined on the user object.",
          index,
          claimsObj
        );
        index++;
        break;
      case "given_name":
        populateClaim(
          key,
          claims[key],
          "Provides the first or given name of the user, as set on the user object.",
          index,
          claimsObj
        );
        index++;
        break;
      case "ipaddr":
        populateClaim(
          key,
          claims[key],
          "The IP address the user authenticated from.",
          index,
          claimsObj
        );
        index++;
        break;
      case "unique_name":
        populateClaim(
          key,
          claims[key],
          "Provides a human readable value that identifies the subject of the token.",
          index,
          claimsObj
        );
        index++;
        break;
      case "uti":
      case "rh":
        index++;
        break;
      case "_claim_names":
      case "_claim_sources":
      default:
        populateClaim(key, claims[key], "", index, claimsObj);
        index++;
    }
  });

  return claimsObj;
};

/**
 * Populates claim, description, and value into an claimsObject
 *
 * @param {String} claim
 * @param {String} value
 * @param {String} description
 * @param {Number} index
 * @param {Object} claimsObject
 */
const populateClaim = (
  claim: string,
  value: string | number,
  description: string,
  index: number,
  claimsObject: [string[]]
) => {
  let claimsArray: string[] = [];
  claimsArray[0] = claim;
  claimsArray[1] = typeof value === "number" ? value.toString() : value;
  claimsArray[2] = description;
  claimsObject[index] = claimsArray;
};

/**
 * Transforms Unix timestamp to date and returns a string value of that date
 *
 * @param {Number} date Unix timestamp
 * @returns
 */
const changeDateFormat = (date: number) => {
  let dateObj = new Date(date * 1000);
  return `${date} - [${dateObj.toString()}]`;
};
